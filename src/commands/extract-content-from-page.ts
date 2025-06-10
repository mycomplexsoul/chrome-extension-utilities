const extractContentFromPage = (
  selector: string,
  extractFn: (e: Element) => string = (e) => (e as HTMLElement).innerText
): string[] => {
  const items: string[] = Array.from(
    document.querySelectorAll(selector)
  ).map(extractFn);

  return items;
};

const extractFeedly = (): string[] => extractContentFromPage('.EntryTitleLink');
const extractGBM = (): string[] => extractContentFromPage('div[role=listitem] p[style="margin:0"');
const extractPiQ = (): string[] => extractContentFromPage('div.text-primary.v2-suite-column-main-title');
const extractTweets = (): string[] => extractContentFromPage('[data-testid="tweetText"]');
const extractCoin360 = (): string[] => extractContentFromPage('a');

export {
  extractContentFromPage,
  extractFeedly,
  extractGBM,
  extractPiQ,
  extractTweets,
  extractCoin360,
}
