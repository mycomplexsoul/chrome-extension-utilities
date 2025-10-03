import { getLocalStorageUsage } from "./utility";

class LinkGrabber {
  bannerEH = () => {
    // obtain local storage usage to print it
      const localStorageUsage = getLocalStorageUsage();
      const localStorageUsageUI = localStorageUsage.details.filter(
        (e) => e.item === 'link-grabber-items'
      ).map(
        (e) => `<p>${e.item}: ${e.usedInKB} KB</p>`
      ).join('\n');

    return `<div style="position: fixed;z-index: 99999999;top: 100px; left: 10px; background-color: #fff; border: 1px dotted #000; padding: 10px;">
    <button type="button" id="btn-checkpoint">Save checkpoint</button>
    <button type="button" id="btn-select-all">Select all</button>
    <div id="checkpoint-list"></div>
    <div>Links</div>
    <div>
      <input type="number" value="" id="card-selector" style="width: 80px;" placeholder="Card # to select 1-25">
    </div>
    <div id="link-count">0 links</div>
    <button type="button" id="btn-copy-links">copy links</button>
    <hr />
    <button type="button" id="btn-toggle-view">Toggle view</button>
    <br/>
    <input type="number" value="8" id="carousel-timer" style="width: 50px;">
    <br/>
    <button type="button" id="btn-play-carousel">Play carousel</button>
    <br/>
    <button type="button" id="btn-stop-carousel">Stop carousel</button>
    <div>
      ${localStorageUsageUI}
    </div>
    <div id="carousel-msg"></div>
  </div>
`;
};

  links: string[] = [];


  injectDiv(divHtml: string) {
    const body = document.getElementsByTagName('body')[0];
    const div = document.createElement('div');
    div.innerHTML = divHtml;
    body.appendChild(div);
  };

  updateLinkCount() {
    const container = document.querySelector('#link-count');
    if (container) {
      container.innerHTML = `${this.links.length} links`;
    }
  }

  copyUrl = (url: string, el: HTMLElement) => {
    return navigator.clipboard.writeText(url).then(() => {
      el.innerText = `Copied ${this.links.length} items!`;
      return true;
    }).catch(e => {
      el.innerText = 'error copying';
      throw e;
    });
  };

  saveLinksToLocalStorage() {
    localStorage.setItem('link-grabber-items', JSON.stringify(this.links));
  }

  getLinksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('link-grabber-items') || '[]');
  }

  registerHandlersForEH() {
    const state: {
      toggleApplied: boolean;
      backup: string | null;
      stopCarousel: boolean;
    } = {
      toggleApplied: false,
      backup: null,
      stopCarousel: true,
    };
    const ehState: {
      linkList: HTMLAnchorElement[];
      imgList: HTMLImageElement[];
      dateList: HTMLElement[];
    } = {
      linkList: [],
      imgList: [],
      dateList: [],
    };

    const toggleView = () => {
      if (state.toggleApplied) {
        // if toggle is clicked then restore original HTML content
        const container = document.querySelector('.itg.glte');
        if (container) {
          container.innerHTML = state.backup || '';
          state.toggleApplied = false;
          return;
        }
      }
      // Find content to create custom layout
      const linkList: HTMLAnchorElement[] = Array.from(document.querySelectorAll('.itg.glte .gl1e a'));
      const imgList: HTMLImageElement[] = Array.from(document.querySelectorAll('.itg.glte .gl1e img'));
      const infoList: HTMLDivElement[] = Array.from(document.querySelectorAll('.itg.glte .gl4e .glink'));
      const dateList: HTMLElement[] = Array.from(document.querySelectorAll('.itg.glte .gl3e :nth-child(2)'));

      ehState.linkList = linkList;
      ehState.imgList = imgList;
      ehState.dateList = dateList;

      // save original content
      state.backup = document.querySelector('.itg.glte')?.innerHTML || '';
      // create new layout with same content
      if (state.backup) {
        const flagDates = Array.from(document.querySelectorAll('#checkpoint-list p')).map(e => new Date(e.innerHTML));
        const container: HTMLDivElement | null = document.querySelector('.itg.glte');

        if (container) {
          container.innerHTML = imgList.map((e, index) => {
            const date = new Date(dateList[index].innerText);
            let styleForCard = '';
            let unseen = false;
            if (flagDates.length > 0 && flagDates[0].getTime() >= date.getTime()) {
              styleForCard = 'background-color: #e7e47a;';
              unseen = true;
            } 
            if (flagDates.length > 1 && flagDates[1].getTime() >= date.getTime()) {
              styleForCard = 'background-color: #8dd569;';
              unseen = false;
            } else {
              unseen = true;
            }
            
            return `<span style="display: inline-flex; flex-direction: column;">
              <a href="${linkList[index].href}">
                <img src="${e.src}" />
              </a>
              <div style="display: inline-flex; flex-direction: row;">
                <input
                  type="checkbox"
                  id="link-grabber-${index}"
                  name="link-grabber-${index}"
                  class="link-grabber-checkbox ${unseen ? 'link-grabber-checkbox-unseen' : ''}"
                  data-url="${linkList[index].href}"
                  ${this.links.includes(linkList[index].href) ? 'checked="checked"' : ''}
                />
                <label for="link-grabber-${index}" class="checkpoint-label" style="width: 200px; flex: 2;${styleForCard}">
                  <span>${index + 1} | </span>
                  <span class="checkpoint-item">
                    ${dateList[index].innerText}
                  </span> | ${infoList[index].innerText}
                </label>
              </div>
              <!--<button class="btn-copy-url" data-url="${linkList[index].href}">copy url</button>-->
            </span>`;
          }).join('\n');

        }
        // stretch content to full-width
        const contentContainer: HTMLElement | null = document.querySelector('.ido');
        if (contentContainer) {
          contentContainer.style.maxWidth='initial';
        }
        const tableContainer: HTMLElement | null = document.querySelector('table.itg.glte');
        if (tableContainer) {
          tableContainer.style.maxWidth='initial';
        }
        state.toggleApplied = true;

        // now that content is rendered, add click handler to buttons to copy urls
        Array.from(document.querySelectorAll('.btn-copy-url')).forEach((el: Element) => {
          el.addEventListener('click', (event) => {
            const url = (event.target as HTMLElement)?.getAttribute('data-url');
            if (url){
              this.copyUrl(url, el as HTMLElement);
            }
          });
        });
        Array.from(document.querySelectorAll('.link-grabber-checkbox')).forEach((el) => {
          el.addEventListener('click', (event: Event) => {
            const url = (event.target as HTMLElement)?.getAttribute('data-url');
            const cardContainer = (event.target as HTMLInputElement).parentElement?.querySelector('.checkpoint-label') as HTMLSpanElement;
            const evt = event as KeyboardEvent;

            if (!url) {
              return;
            }

            if (!this.links.includes(url)) {
              if (evt.shiftKey) {
                this.links.unshift(url);
                cardContainer.style.backgroundColor = '#ff7deb';
              } else {
                this.links.push(url);
                cardContainer.style.backgroundColor = '#e78c1a';
              }
            } else {
              this.links.splice(this.links.indexOf(url), 1);
              cardContainer.style.backgroundColor = 'transparent';
            }
            this.updateLinkCount();
            this.saveLinksToLocalStorage();
          });
        });
        const cardSelector = document.querySelector('#card-selector') as HTMLInputElement;
        cardSelector.addEventListener('keyup', (event) => {
          if (event.key === 'Enter' && !event.altKey) {
            const index: number = parseInt(cardSelector.value.trim(), 10) - 1;
            const isIndexValid = index >= 0 && index < ehState.linkList.length;
            if (!isIndexValid) {
              return;
            }
            (Array.from(document.querySelectorAll('.link-grabber-checkbox'))[index] as HTMLInputElement).dispatchEvent(new MouseEvent('click', {
              shiftKey: event.shiftKey,
            }));
            cardSelector.value = '';
          }
          if (event.key === 'Enter' && event.altKey) {
            const index: number = parseInt(cardSelector.value.trim(), 10) - 1;
            const url = ehState.linkList[index].href;
            if (!url) {
              return;
            }
            // open link in current tab
            window.location.href = url;
          }
        });
        if (cardSelector) {
          cardSelector.focus();
        }
      }
    };

    const renderCheckpoint = () => {
      // retrieve previous stored checkpoints for this url
      const all = JSON.parse(localStorage.getItem('checkpoint') || '{}');
      const key = new URLSearchParams(window.location.search).get('key') || sessionStorage.getItem('key');
      if (all && key && all[key]) {
        const checkpointList = document.querySelector('#checkpoint-list');
        if (checkpointList) {
          checkpointList.innerHTML = all[key].map(
            (e: string) => `<p>${e}</p>`
          ).join('');
        }
      }
    }

    const checkpoint = () => {
      // retrieve previous stored checkpoints for this url
      const all = JSON.parse(localStorage.getItem('checkpoint') || '{}');
      // obtain checkpoint data from current page
      const dateList = Array.from(document.querySelectorAll('.checkpoint-item'));
      const data = (dateList[0] as HTMLElement).innerText;
      const key = new URLSearchParams(window.location.search).get('key') || sessionStorage.getItem('key');
      if (!key) {
        return;
      }
      // store checkpoint and save it to storage
      if (key && !all[key]) {
        all[key] = [];
      }
      all[key].unshift(data);
      if (all[key].length > 4) {
        all[key].pop();
      }
      // update UI
      const checkpointList = document.querySelector('#checkpoint-list');
      if (checkpointList) {
        checkpointList.innerHTML = all[key].map(
          (e: string) => `<p>${e}</p>`
        ).join('');
      }
      localStorage.setItem('checkpoint', JSON.stringify(all));
      sessionStorage.setItem('key', key);
    };

    const copyLinks = () => {
      const copyLinksButton = document.querySelector('#btn-copy-links');
      if (!copyLinksButton) {
        return;
      }
      this.copyUrl(this.links.join('\n'), copyLinksButton as HTMLElement).then((success) => {
        if (success) {
          this.links = [];
          this.saveLinksToLocalStorage();
          this.updateLinkCount();
        }
      });
    }

    const selectAll = () => {
      const checkboxList: HTMLButtonElement[] = Array.from(document.querySelectorAll('.link-grabber-checkbox-unseen'));
      checkboxList.forEach((e) => {
        e.click();
      });
    }
    
    // add other handlers
    document.querySelector('#btn-toggle-view')?.addEventListener('click', toggleView);
    document.querySelector('#btn-checkpoint')?.addEventListener('click', checkpoint);
    document.querySelector('#btn-select-all')?.addEventListener('click', selectAll);
    document.querySelector('#btn-copy-links')?.addEventListener('click', copyLinks);
    
    // get key from url if present
    const key = new URLSearchParams(window.location.search).get('key');
    if (key) {
      sessionStorage.setItem('key', key);
    }

    document.body.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowRight') {
        (document.querySelector('#dnext') as HTMLButtonElement)?.click();
      }
    });

    // wait to rendering before applying new layout automatically
    setTimeout(renderCheckpoint, 300);
    setTimeout(toggleView, 500);

    // preload next page
    if (document.querySelector('.ptds')){
      const nextPage = document.querySelector('.ptds')?.nextElementSibling?.getElementsByTagName('a')[0].href;
      document.body.innerHTML += `<link rel="prerender" href="${nextPage}">`;
    }
    if (document.querySelector('#next')){
      const nextPage = (document.querySelector('#next') as HTMLAnchorElement)?.href;
      document.body.innerHTML += `<link rel="prerender" href="${nextPage}">`;
    }

    // handlers for carousel
    const carouselMsg: HTMLDivElement | null = document.querySelector('#carousel-msg');
    const playButton: HTMLButtonElement | null = document.querySelector('#btn-play-carousel');
    const stopButton: HTMLButtonElement | null = document.querySelector('#btn-stop-carousel');
    const carouselTimer: HTMLInputElement | null = document.querySelector('#carousel-timer');
    if (playButton) {
      playButton.addEventListener('click', 
        () => {
          const nextPage = () => (document.querySelector('#next') as HTMLButtonElement)?.click();
          const carouselTimerValue = parseInt(carouselTimer?.value || '0', 10) * 1000;
          const recurringCall = (method: Function) => {
            method();
            setTimeout(
              () => {
                if (!state.stopCarousel) {
                  recurringCall(method);
                }
              },
              carouselTimerValue
            );
          }
    
          // save carousel mode state
          
          state.stopCarousel = false;
          if (carouselMsg) {
            carouselMsg.innerHTML = 'Carousel playing';
          }
          playButton.style.display = 'none';
          if (stopButton) {
            stopButton.style.display = 'block';
          }
          localStorage.setItem('carouselMode', 'play');
          setTimeout(() => recurringCall(nextPage), carouselTimerValue);
        }
      );
    }
      
    if (stopButton) {
      stopButton.addEventListener('click', () => {
        state.stopCarousel = true;
        if (carouselMsg) {
          carouselMsg.innerHTML = 'Carousel stopped';
        }
        if (playButton) {
          playButton.style.display = 'block';
        }
        stopButton.style.display = 'none';

        // clear local storage
        localStorage.setItem('carouselMode', '');
        localStorage.setItem('carouselTimer', '8');
      });

      stopButton.style.display = 'none';
    }

    // verify from localStorage if carousel is in playback mode
    if (localStorage.getItem('carouselMode')) {
      if (carouselTimer) {
        carouselTimer.value = localStorage.getItem('carouselTimer') || '8';
      }
      playButton?.click();
    }
  };

  copyLinksToClipboard = (count: number = 100) => {
    const links = (this.getLinksFromLocalStorage() as string[]).slice(0, count);
    if (links.length === 0) {
      console.warn('No links to copy');
      return;
    }
    navigator.clipboard.writeText(links.join('\n')).then(() => {
      console.log(`Copied ${links.length} links to clipboard`);
      const remainingLinks = (this.getLinksFromLocalStorage() as string[]).slice(count);
      this.links = remainingLinks;
      this.saveLinksToLocalStorage();
      this.updateLinkCount();
    }).catch((err) => {
      console.error('Error copying links to clipboard', err);
    });
  }

  init() {
    const selectorToDetectPageToApply = '.itg.glte';
    const pageContainer = document.querySelector(selectorToDetectPageToApply);
    const individualImageContainer = document.querySelector('img#img');
    const secondCheck = document.querySelector('#nb');
    if (secondCheck && (pageContainer || individualImageContainer)) {
      this.injectDiv(this.bannerEH());
      this.registerHandlersForEH();
    }
    this.links = this.getLinksFromLocalStorage();
    this.updateLinkCount();

    const selectorToDetectIndividualPage = '.gt200 a';
    const individualPageContainer = document.querySelector(selectorToDetectIndividualPage) as HTMLAnchorElement;
    if (secondCheck && individualPageContainer) {
      individualPageContainer.focus();
    }
  }
}

export const linkGrabber = new LinkGrabber();