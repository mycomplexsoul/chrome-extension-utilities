class UrlRotator {
  public lists: Record<string, {
    url: string;
    time: number;
    onLoad?: () => void;
  }[]> = {
    main: [
      {
        url: 'https://mail.google.com/mail/u/0/',
        time: 60 * 5
      },
      {
        url: 'https://feedly.com',
        time: 60 * 6
      },
      {
        // media
        url: 'https://twitter.com/i/lists/1412008021719400451',
        time: 60 * 3
      },
      {
        url: 'https://outlook.live.com/mail/0/',
        time: 60 * 4
      },
      {
        // design
        url: 'https://twitter.com/i/lists/1641246908399120386',
        time: 60 * 3
      },
      {
        url: 'https://github.com/mycomplexsoul/delta/pulls',
        time: 60 * 3
      },
      {
        // dev
        url: 'https://twitter.com/i/lists/1408399544010805248',
        time: 60 * 4
      },
      {
        url: 'https://producthunt.com',
        time: 60 * 2
      },
      {
        // math
        url: 'https://twitter.com/i/lists/1660273983256764416',
        time: 60 * 2
      },
      {
        url: 'http://localhost:8001/activities?selectedProject=FFJ&sortDescending=true&urlRotatorIndex',
        time: 60 * 5
      },
      {
        // security
        url: 'https://twitter.com/i/lists/1429577638608310273',
        time: 60 * 4
      },
      {
        url: 'https://feedly.com/i/saved',
        time: 60 * 3
      },
      {
        // space
        url: 'https://twitter.com/i/lists/1520984230376914944',
        time: 60 * 2
      },
      {
        url: 'https://docs.google.com/spreadsheets/d/1WxV2PMOaw2SdU0n66hd2enyp1WHcSJbsK-u40z-4ZFc/edit?urlRotatorIndex#gid=1073634791',
        time: 60 * 2
      },
      {
        // news
        url: 'https://twitter.com/i/lists/1408399351420948485',
        time: 60 * 5
      },
      {
        url: 'http://localhost/spaces/WebSearch.php',
        time: 60 * 2
      },
      {
        url: 'https://twitter.com/explore/tabs/for-you',
        time: 60 * 3
      },
    ],
    trading: [
      {
        url: 'https://www.cryptowaves.app',
        time: 60 * 1,
        onLoad: () => {
          const clean = (e: Element | null) => e?.classList.remove('blurred');
          const q = () => document.querySelector('.blurred');
          if (q()) {
            clean(q());
          } else {
            setTimeout(() => {
              clean(q());
              // cleanup headers and app ads
              document.querySelector('section')?.parentNode?.removeChild(
                document.querySelector('section') as Element
              );
              const container = document.querySelector('#heatmap')?.parentElement;
              if (container) {
                container.style = 'height: 120vh; min-height: 1200px;';
              }
              // trigger a window resize to fix the layout
              window.dispatchEvent(new Event('resize'));
            }, 500);
          }
        }
      },
      {
        // trading
        url: 'https://twitter.com/i/lists/1377429256498741249',
        time: 60 * 4
      }, {
        url: 'https://finviz.com/',
        time: 60 * 1
      }, {
        // investment
        url: 'https://x.com/i/lists/1934006541612634484',
        time: 60 * 3
      }, {
        url: 'https://web.telegram.org/a/',
        time: 60 * 2
      },{
        url: 'https://web.whatsapp.com/',
        time: 60 * 3
      }, {
        // inversion
        url: 'https://twitter.com/i/lists/1637108420376420362',
        time: 60 * 3
      }, {
        url: 'https://coin360.com/',
        time: 60 * 1
      }, {
        // dev
        url: 'https://twitter.com/i/lists/1408399544010805248',
        time: 60 * 4
      }, {
        url: 'https://cryptobubbles.net/',
        time: 60 * 1
      }, {
        url: 'https://app.piqsuite.com/',
        time: 60 * 2
      }, {
        url: 'https://polymarket.com/',
        time: 60 * 3
      }, {
        url: 'http://localhost:8001/lasttime',
        time: 60 * 2,
      }, {
        url: 'https://www.cryptocapi.com/',
        time: 60 * 1,
      }, {
        url: 'https://www.newsminimalist.com/',
        time: 60 * 2,
      }, {
        url: 'https://luma.com/tribuia',
        time: 60 * 1,
      }
      /* {
        url: 'https://www.theblock.co/data/crypto-markets/bitcoin-etf/spot-bitcoin-etf-flows',
        time: 60 * 1
      },
      {
        url: 'https://www.theblock.co/data/crypto-markets/ethereum-etf/spot-ethereum-etf-flows',
        time: 60 * 1
      }, */
      /* {
        url: 'https://www.dataroma.com/m/home.php',
        time: 60 * 2
      },
      {
        url: 'https://www.macrotrends.net/stocks/stock-screener',
        time: 60 * 3
      }, */
    ],
    charts: [
      {
        url: 'https://www.tradingview.com/chart/IRJZyZIC/',
        time: 60 * 2
      },
    ],
    work: [{
        url: 'https://mail.google.com/mail/u/0/',
        time: 60 * 10
      }, {
        url: 'https://calendar.google.com/calendar/u/0/r/week',
        time: 60 * 5
      }, {
        url: 'http://localhost:8001/balance',
        time: 60 * 5
      }, {
        url: 'https://mygrowth.university.globant.com/me',
        time: 60 * 5
      }, {
        url: 'https://globant.udemy.com/organization/home',
        time: 60 * 5
      }, {
        url: 'https://app.starmeup.com/home',
        time: 60 * 5
      }, {
        url: 'https://refactoring.guru/es/design-patterns',
        time: 60 * 5,
      }, {
        url: 'http://localhost:8001/plan-salvacion',
        time: 60 * 3,
      }, {
        url: 'http://localhost:8001/libros',
        time: 60 * 3,
      }, {
        url: 'https://glow.globant.com/?urlRotatorIndex#/dashboard/open-positions',
        time: 60 * 10
      }, {
        url: 'https://console.corp.geai.globant.com',
        time: 60 * 5
      }
    ],
  };
  public selectors = {
    CONTAINER: 'urlRotator_Container',
    MESSAGES_CONTAINER: 'urlRotator_MessagesContainer',
    CLOSE_BTN: 'urlRotator_CloseBtn',
  }
  public timer = 60 * 2;
  public selectedList: string | null = null;
  public indexFromUrl: number | null = null;
  public timeoutRef: number | null = null;
  public remainingTime: number | null = null;
  /* storageKeys = {
    index: 'urlRotatorIndex',
    active: 'urlRotatorActive',
  }; */

  defaultList = () => {
    return Object.keys(this.lists)[0];
  }

  injectDiv = (divHtml: string) => {
    const body = document.getElementsByTagName('body')[0];
    const div = document.createElement('div');
    div.innerHTML = divHtml;
    body.appendChild(div);
  };

  init = (url: string) => {
    const qs = new URL(url).searchParams;
    const urlRotatorIndex = qs.get('urlRotatorIndex');
    const [list = this.defaultList(), index] = urlRotatorIndex ? urlRotatorIndex.split('-') : [null, null];
    if (index && index !== null) {
      this.indexFromUrl = parseInt(index, 10);
    }
    if (list && this.lists[list]) {
      this.selectedList = list;
    } else {
      this.selectedList = this.defaultList();
    }
    
    if (this.indexFromUrl !== null) {
      console.log(`activating urlRotator list ${list}`);
      this.injectDiv(this.generateHTML());

      setTimeout(() => {
        this.registerHandlers();
        if (list && index !== null) {
          const onLoad = this.lists[list]?.[parseInt(index, 10)].onLoad;
  
          // launch onLoad when defined
          if (onLoad) {
            onLoad();
          }
        }
      }, 300);
    }

    return;
  }

  generateHTML = () => {
    const containerStyles = 'position: fixed;z-index: 99999999;bottom: 300px; left: 10px; background-color: #16202b; border: 1px dotted rgb(1, 12, 94); padding: 10px; color: #fff; cursor: pointer; border-radius: 4px; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: flex-start;';
    const buttonStyles = [
      `#${this.selectors.MESSAGES_CONTAINER} {`,
      '  position: relative;',
      '  display: flex;',
      '  align-items: center;',
      '}',
      `#${this.selectors.CLOSE_BTN} {`,
      '  display: none;',
      '  margin-left: 10px;',
      '  background: #e74c3c;',
      '  color: #fff;',
      '  border: none;',
      '  border-radius: 4px;',
      '  padding: 2px 4px;',
      '  cursor: pointer;',
      '  font-size: 14px;',
      '  z-index: 100000000;',
      '}',
      `#${this.selectors.MESSAGES_CONTAINER}:hover #${this.selectors.CLOSE_BTN} {`,
      '  display: block;',
      '}',
    ].join('\n');
    const style = `<style id="urlRotator_Style">${buttonStyles}</style>`;
    // Add the drag and drop handle as a vertical dotted line to the left of the MESSAGES_CONTAINER
    const dragHandle = `<div id="urlRotator_DragHandle" style="border-left: 3px dotted #b0b8c1; height: 16px; width: 4px; margin-right: 10px; cursor: move; user-select: none; display: flex; align-items: center; justify-content: center;"></div>`;
    return `${style}<div id="${this.selectors.CONTAINER}" title="Click to rotate to next url" style="${containerStyles}">\n  ${dragHandle}<div id="${
      this.selectors.MESSAGES_CONTAINER
    }">\n    <span id="urlRotator_Timer"></span>\n    <button id="${
      this.selectors.CLOSE_BTN
    }" title="Stop timer and close UI">✕</button>\n  </div>\n</div>`;
  }

  registerHandlers = () => {
    const nextButton = document.querySelector(`#${this.selectors.MESSAGES_CONTAINER}`);
    nextButton?.addEventListener('click', () => this.nextRotation());

    // Handler for the close button
    const closeBtn = document.getElementById(this.selectors.CLOSE_BTN);
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeUI();
      });
    }

    // Handler for drag and drop
    const container = document.getElementById(this.selectors.CONTAINER);
    const dragHandle = document.getElementById('urlRotator_DragHandle');
    if (container && dragHandle) {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      let startX = 0;
      let startY = 0;
      dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = container.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
        container.style.transition = 'none';
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        container.style.left = x + 'px';
        container.style.top = y + 'px';
        container.style.right = '';
        container.style.bottom = '';
        container.style.position = 'fixed';
      });
      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.userSelect = '';
        }
      });
    }

    if (this.indexFromUrl !== null) {
      this.startRotation();
    }
  }

  closeUI = () => {
    const container: HTMLDivElement | null = document.querySelector(`#${this.selectors.CONTAINER}`);
    if (container) {
      container.style.display = 'none';
    }
  }

  showUI = () => {
    const container: HTMLDivElement | null = document.querySelector(`#${this.selectors.CONTAINER}`);
    if (container) {
      container.style.display = 'block';
    }
  }

  nextRotation = (index: number = this.calculateNextIndex()) => {
    if (this.selectedList) {
      const url = this.lists[this.selectedList][index].url;
      const token = 'urlRotatorIndex';
      const finalUrl = url.includes(token) ? url.replace(token, `${token}=${this.selectedList}-${index}`) : `${url}?${token}=${this.selectedList}-${index}`;
      console.log(`navigating to ${finalUrl}`);
      window.location.href = finalUrl;
    }
  }

  previousRotation = (index: number = this.calculatePreviousIndex()) => {
    if (this.selectedList) {
      const url = this.lists[this.selectedList][index].url;
      const token = 'urlRotatorIndex';
      const finalUrl = url.includes(token) ? url.replace(token, `${token}=${this.selectedList}-${index}`) : `${url}?${token}=${this.selectedList}-${index}`;
      console.log(`navigating to ${finalUrl}`);
      window.location.href = finalUrl;
    }
  }

  stopRotation = () => {
    if (this.timeoutRef) {
      this.remainingTime = 0;
      this.updateTimerUI();
      this.closeUI();
      window.clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
      console.log('url rotator stopped');
    }
  }

  startRotation = () => {
    if (this.selectedList) {
      const index = this.calculateNextIndex();
      console.log(`scheduling url rotation to index ${index}`);
      const { time } = this.lists[this.selectedList][index === 0 ? this.lists[this.selectedList].length - 1 : index - 1];
  
      this.startTimer(time);
  
      this.timeoutRef = setTimeout(() => {
        this.nextRotation(index);
      }, time * 1000);
    }
  }

  calculateNextIndex = () => {
    let index = this.indexFromUrl !== null ? this.indexFromUrl : -1;
    if (index < -1) {
      index = -1;
    }
    if (this.selectedList) {
      index = (index + 1) % this.lists[this.selectedList].length;
    }
    return index;
  }

  calculatePreviousIndex = () => {
    let index = this.indexFromUrl !== null ? this.indexFromUrl : 0;
    if (index <= 0) {
      index = 0;
    }
    if (this.selectedList) {
      if (index === 0) {
        index = this.lists[this.selectedList].length - 1;
      } else {
        index = (index - 1) % this.lists[this.selectedList].length;
      }
    }
    return index;
  }

  updateTimerUI = () => {
    const timerSpan = document.querySelector('#urlRotator_Timer');
    if (timerSpan) {
      const min = Math.floor((this.remainingTime || 0) / 60);
      const seg = (this.remainingTime || 0) % 60;
      timerSpan.textContent = `${min >= 10 ? min : '0' + min}:${seg >= 10 ? seg : '0' + seg}`;
    }
  }

  startTimer = (time: number) => {
    this.remainingTime = time;
    let intervalRef = window.setInterval(() => {
      if (this.remainingTime === 0 || this.remainingTime === null || this.timeoutRef === null) {
        window.clearInterval(intervalRef);
        return;
      }
      this.remainingTime = this.remainingTime - 1;
      this.updateTimerUI();
    }, 1000);
  }
}

export const urlRotator = new UrlRotator();
