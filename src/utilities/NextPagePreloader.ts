const preloadImage = (src: string) => {
  if (!src) {
    return;
  }

  const image = new Image();
  image.decoding = 'async';
  image.loading = 'eager';
  image.src = src;
};

const getNextPageLink = () => {
  return (document.querySelector('#unext') as HTMLAnchorElement | null)
    ?? (document.querySelector('#next') as HTMLAnchorElement | null)
    ?? (document.querySelector('.ptds')?.nextElementSibling?.querySelector('a') as HTMLAnchorElement | null);
};

export const preloadNextPageAssets = () => {
  const nextLink = getNextPageLink();

  if (!nextLink?.href) {
    return;
  }

  const nextUrl = new URL(nextLink.href, window.location.href).toString();

  const prerenderLink = document.createElement('link');
  prerenderLink.rel = 'prerender';
  prerenderLink.href = nextUrl;
  document.head.appendChild(prerenderLink);

  fetch(nextUrl, { credentials: 'same-origin' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const thumbnails = Array.from(doc.querySelectorAll('.itg.glte .gl1e img')) as HTMLImageElement[];

      thumbnails.forEach((img) => {
        const src = img.getAttribute('src') || img.getAttribute('data-src');
        if (!src) {
          return;
        }

        preloadImage(new URL(src, nextUrl).toString());
      });
    })
    .catch((error) => {
      console.warn('Unable to prefetch next page assets', error);
    });
};
