const getSaveButton = (container: Element): HTMLElement | null => {
  // Prefer explicit bookmark/save testids or aria labels
  const selectors = [
    '[data-testid*="bookmark"]',
    '[data-testid*="save"]',
    'button[aria-label*="bookmark"]',
    'button[aria-label*="save"]',
    'button[title*="bookmark"]',
    'button[title*="save"]',
    // do NOT return generic 'button' or '[role="button"]' here — use fallback heuristics instead
  ];

  for (const sel of selectors) {
    const el = container.querySelector<HTMLElement>(sel);
    if (el) return el;
  }
  // Fallback: scan nearby interactive elements and match by prioritized heuristics
  const positive = /bookmark|save|saved|unbookmark|removebookmark|guardad/i;
  const negative = /acciones|more options|más opciones|reply|respuestas|me gusta|like|repost|retweet|compartir|share|analytics|visualizaciones|play|reproducir/i;

  const buttons = Array.from(container.querySelectorAll<HTMLElement>('button, [role="button"]'));

  // Prefer explicit testid matches
  const testidMatch = buttons.find(b => (b.getAttribute('data-testid') || '').toLowerCase().includes('bookmark'));
  if (testidMatch) return testidMatch;

  // Prefer buttons with positive labels/text and not matching negative patterns
  const positiveBtns = buttons.filter(b => {
    const text = ((b.getAttribute('aria-label') || b.getAttribute('title') || b.getAttribute('data-testid') || b.textContent) || '').toLowerCase();
    return positive.test(text) && !negative.test(text);
  });
  if (positiveBtns.length) return positiveBtns[0];

  // If none explicitly positive, pick a button that is not in the negative list and appears near the action group (heuristic: later in DOM)
  const candidates = buttons.filter(b => {
    const text = ((b.getAttribute('aria-label') || b.getAttribute('title') || b.getAttribute('data-testid') || b.textContent) || '').toLowerCase();
    return !negative.test(text);
  });
  if (candidates.length) return candidates[candidates.length - 1];

  return null;
};

const isTweetSaved = (button: HTMLElement | null): boolean => {
  if (!button) return false;

  // Explicit testids like 'unbookmark' indicate saved state
  const testid = (button.getAttribute('data-testid') || '').toLowerCase();
  if (/unbookmark|removebookmark|bookmarked|saved|bookmark/.test(testid)) return true;

  // aria-pressed or aria-checked may indicate a toggled state
  const pressed = button.getAttribute('aria-pressed') || button.getAttribute('aria-checked');
  if (pressed === 'true') return true;

  const label = [
    button.getAttribute('aria-label') || '',
    button.getAttribute('title') || '',
    button.textContent || '',
  ].join(' ').toLowerCase();

  return /saved|remove from saved|unsave|bookmarked|unbookmark|removebookmark|guardado|guardados/.test(label);
};

const isVisible = (element: Element): boolean => {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
};

const extractTweetUrl = (container: Element): string | null => {
  const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
  const tweetLink = anchors.find(anchor => {
    const href = anchor.getAttribute('href') || '';
    // support /status/ and /i/web/status/ patterns
    return /\/status\/\d+/.test(href) || /\/i\/web\/status\/\d+/.test(href);
  });

  if (!tweetLink) {
    return null;
  }

  const href = tweetLink.getAttribute('href') || '';
  return href.startsWith('http') ? href : new URL(href, window.location.origin).toString();
};

const extractAuthorUrl = (container: Element): string | null => {
  const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
  const authorLink = anchors.find(anchor => {
    const href = anchor.getAttribute('href') || '';
    if (!href || /\/status\/+\d+/.test(href)) {
      return false;
    }

    try {
      const url = new URL(href, window.location.origin);
      return ['x.com', 'twitter.com'].includes(url.hostname) && !url.pathname.includes('/status/');
    } catch {
      return /^\/[A-Za-z0-9_]{1,15}$/.test(href);
    }
  });

  if (!authorLink) {
    return null;
  }

  const href = authorLink.getAttribute('href') || '';
  return href.startsWith('http') ? href : new URL(href, window.location.origin).toString();
};

const collectTwitterSaved = async (maxItems = 100): Promise<{ tweetUrls: string[]; authorUrls: string[] }> => {
  const tweetUrls: string[] = [];
  const authorUrls: string[] = [];

  const maxScrollAttempts = 6; // how many times to try loading more when no new items
  let scrollAttempts = 0;

  // Loop until we collected enough items or no more content appears
  while (tweetUrls.length < maxItems) {
    const containers = Array.from(document.querySelectorAll<HTMLElement>('article, [data-testid="tweet"], [role="article"]'))
      .filter(container => isVisible(container) && (container.querySelector('[data-testid="tweetText"]') || container.querySelector('a[href*="/status/"]')));

    let foundNewInPass = false;

    for (const container of containers) {
      // mark container as processed to avoid re-processing when DOM doesn't change
      if (container.getAttribute('data-collected') === '1') continue;
      container.setAttribute('data-collected', '1');

      const saveButton = getSaveButton(container);
      if (!isTweetSaved(saveButton)) {
        continue;
      }

      const tweetUrl = extractTweetUrl(container);
      const authorUrl = extractAuthorUrl(container);

      if (tweetUrl && !tweetUrls.includes(tweetUrl)) {
        tweetUrls.push(tweetUrl);
        foundNewInPass = true;
      }

      if (authorUrl && !authorUrls.includes(authorUrl)) {
        authorUrls.push(authorUrl);
      }

      if (saveButton) {
        saveButton.click();
      }
      // pequeño retraso entre cada extracción para evitar hacer requests muy rápidos
      await new Promise(resolve => window.setTimeout(resolve, 500));

      if (tweetUrls.length >= maxItems) break;
    }

    if (tweetUrls.length >= maxItems) break;

    if (foundNewInPass) {
      // reset attempts because we saw new items
      scrollAttempts = 0;
    } else {
      // no new items in this pass — try to scroll to load more
      if (scrollAttempts >= maxScrollAttempts) break;
      scrollAttempts++;

      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      // esperar a que cargue más contenido (verificación): 1000ms fijo
      await new Promise(resolve => window.setTimeout(resolve, 1000));
    }
  }

  console.log('Twitter saved tweet URLs:', tweetUrls);
  console.log('Twitter saved author URLs:', authorUrls);

  return {
    tweetUrls,
    authorUrls,
  };
};

export {
  collectTwitterSaved,
};
