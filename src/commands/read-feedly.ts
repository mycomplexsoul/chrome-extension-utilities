const extractItemsFromPage = (): string[] => {
  const items: string[] = Array.from(
    document.querySelectorAll('.EntryTitleLink')
  ).map((e) => (e as HTMLAnchorElement).innerText);

  return items;
};

export {
  extractItemsFromPage,
}