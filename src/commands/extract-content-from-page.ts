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

const extractTelegram = (): string[] => {
  const items: string[] = Array.from(
    document.querySelectorAll('.text-content.clearfix.with-meta')
  ).map(e => e.textContent || '');
  const unreadCount = parseInt(
    document.querySelector(
      '.ListItem.Chat.chat-item-clickable.group.selected'
    )?.querySelector('.ChatBadge.unread')?.textContent || '', 10) || 1;
  
    if (unreadCount > 0) {
      const unread = items.slice(items.length - unreadCount, items.length);
      console.log('telegram extracted items', {
        items,
        unreadCount,
        unread,
      });
    return unread;
  }

  return [];
}

export {
  extractContentFromPage,
  extractFeedly,
  extractGBM,
  extractPiQ,
  extractTweets,
  extractCoin360,
  extractTelegram,
}
