const extractItemsFromPage = (): string[] => {
  const items: string[] = Array.from(
    document.querySelectorAll('[data-test^=homepage-section-]')
  ).map((e) => Array.from(e.querySelectorAll('[data-sentry-component=Card]')).map((p) => {
    const children: HTMLAnchorElement[] = Array.from(
      p.querySelectorAll('[data-sentry-component="Link"]')
    );
    const name = children[0]?.innerText;
    const description = children[1]?.innerText;
    return `${name} - ${description}`;
  })).flat();

  return items;
};

export {
  extractItemsFromPage,
}