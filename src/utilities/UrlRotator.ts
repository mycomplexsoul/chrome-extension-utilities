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
              )
            }, 500);
          }
        }
      },
      {
        // trading
        url: 'https://twitter.com/i/lists/1377429256498741249',
        time: 60 * 4
      },
      {
        url: 'https://finviz.com/',
        time: 60 * 1
      },
      {
        // inversion
        url: 'https://twitter.com/i/lists/1637108420376420362',
        time: 60 * 3
      },
      {
        url: 'https://coin360.com/',
        time: 60 * 1
      },
      {
        url: 'https://web.telegram.org/a/',
        time: 60 * 2
      },
      {
        url: 'https://web.whatsapp.com/',
        time: 60 * 3
      },
      {
        url: 'https://app.piqsuite.com/',
        time: 60 * 2
      },
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
    ]
  };
  public selectors = {
    CONTAINER: 'urlRotator_Container',
    BUTTONS_CONTAINER: 'urlRotator_ButtonsContainer',
    START_BUTTON: 'urlRotator_StartButton',
    NEXT_BUTTON: 'urlRotator_NextButton',
    STOP_BUTTON: 'urlRotator_StopButton',
    CLOSE_BUTTON: 'urlRotator_CloseButton',
    MESSAGES_CONTAINER: 'urlRotator_MessagesContainer',
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
    return;
  }

  generateHTML = () => {
    const containerStyles = 'position: fixed;z-index: 99999999;bottom: 300px; left: 10px; background-color: #16202b; border: 1px dotted rgb(1, 12, 94); padding: 10px; color: #fff';
    return `<div id="${this.selectors.CONTAINER}" style="${containerStyles}">
      <div id="${this.selectors.BUTTONS_CONTAINER}">
        <button id="${this.selectors.START_BUTTON}">Rotate urls</button>
        <button id="${this.selectors.NEXT_BUTTON}">Rotate to next url</button>
        <br/>
        <button id="${this.selectors.STOP_BUTTON}">Stop Rotation</button>
        <button id="${this.selectors.CLOSE_BUTTON}">Hide</button>
      </div>
      <div id="${this.selectors.MESSAGES_CONTAINER}"></div>
    </div>`;
  }

  registerHandlers = () => {
    const startButton = document.querySelector(`#${this.selectors.START_BUTTON}`);
    startButton?.addEventListener('click', () => this.startRotation());

    const nextButton = document.querySelector(`#${this.selectors.NEXT_BUTTON}`);
    nextButton?.addEventListener('click', () => this.nextRotation());

    const stopButton = document.querySelector(`#${this.selectors.STOP_BUTTON}`);
    stopButton?.addEventListener('click', () => this.stopRotation());
    
    const closeButton = document.querySelector(`#${this.selectors.CLOSE_BUTTON}`);
    closeButton?.addEventListener('click', () => this.closeUI());

    if (this.indexFromUrl !== null) {
      this.startRotation();
    }
  }

  closeUI = () => {
    const container: HTMLDivElement | null = document.querySelector(`#${this.selectors.BUTTONS_CONTAINER}`);
    if (container) {
      container.style.display = 'none';
    }
  }

  showUI = () => {
    const container: HTMLDivElement | null = document.querySelector(`#${this.selectors.BUTTONS_CONTAINER}`);
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

  stopRotation = () => {
    if (this.timeoutRef) {
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

  startTimer = (time: number) => {
    const container = document.querySelector(`#${this.selectors.MESSAGES_CONTAINER}`);
    this.remainingTime = time;
    let intervalRef = window.setInterval(() => {
      if (this.remainingTime === 0 || this.remainingTime === null || this.timeoutRef === null) {
        window.clearInterval(intervalRef);
        return;
      }
      this.remainingTime = this.remainingTime - 1;
      const min = Math.floor(this.remainingTime / 60);
      const seg = this.remainingTime % 60;
      if (container) {
        container.innerHTML = `${
          min >= 10 ? min : '0' + min}:${
          seg >= 10 ? seg : '0' + seg
        }`;
      }
    }, 1000);
  }

  /*getFromStorage = (key) => {
    return window.localStorage.getItem(key);
  }

  setToStorage =  (key, value) => {
    window.localStorage.setItem(key, value);
  }*/
}

export const urlRotator = new UrlRotator();
