const getLikeButton = (container: Element): HTMLElement | null => {
  const candidateButtons = Array.from(
    container.querySelectorAll<HTMLElement>('button, [role="button"]')
  ).filter(button => {
    const label = [
      button.getAttribute('aria-label'),
      button.getAttribute('title'),
      button.getAttribute('data-testid'),
      button.textContent,
    ].filter(Boolean).join(' ').toLowerCase();

    return label.includes('like') || label.includes('liked') || label.includes('unlike');
  });

  return candidateButtons[0] || null;
};

const isTweetLiked = (button: HTMLElement | null): boolean => {
  if (!button) {
    return false;
  }

  const pressed = button.getAttribute('aria-pressed');
  if (pressed === 'true') {
    return true;
  }

  const label = [
    button.getAttribute('aria-label') || '',
    button.getAttribute('title') || '',
    button.getAttribute('data-testid') || '',
  ].join(' ').toLowerCase();

  return label.includes('unlike') || label.includes('undo like') || label.includes('liked');
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
    return /\/status\/+\d+/.test(href);
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

const collectTwitterLikes = async (): Promise<{ tweetUrls: string[]; authorUrls: string[] }> => {
  const containers = Array.from(document.querySelectorAll<HTMLElement>('article, [data-testid="tweet"], [role="article"]'))
    .filter(container => isVisible(container) && (container.querySelector('[data-testid="tweetText"]') || container.querySelector('a[href*="/status/"]')));

  const tweetUrls: string[] = [];
  const authorUrls: string[] = [];

  for (const container of containers) {
    const likeButton = getLikeButton(container);
    if (!isTweetLiked(likeButton)) {
      continue;
    }

    const tweetUrl = extractTweetUrl(container);
    const authorUrl = extractAuthorUrl(container);

    if (tweetUrl) {
      tweetUrls.push(tweetUrl);
    }

    if (authorUrl) {
      authorUrls.push(authorUrl);
    }

    if (likeButton) {
      likeButton.click();
      await new Promise(resolve => window.setTimeout(resolve, 250));
    }
  }

  console.log('Twitter likes tweet URLs:', tweetUrls);
  console.log('Twitter likes author URLs:', authorUrls);

  return {
    tweetUrls,
    authorUrls,
  };
};

export {
  collectTwitterLikes,
};
