const dateOnly = (base: Date) => {
  if (base) {
    return new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      0,
      0,
      0
    );
  }
  let newDate = new Date();
  return new Date(
    newDate.getFullYear(),
    newDate.getMonth(),
    newDate.getDate(),
    0,
    0,
    0
  );
}

const elapsedTime = (date1: Date, date2: Date) => {
  // return diff in seconds
  if (date1 && date2) {
    return Math.floor((date1.getTime() - date2.getTime()) / 1000);
  }
  return 0;
}

const elapsedDays = (date1: Date, date2: Date) => {
  return Math.floor(
    elapsedTime(dateOnly(date1), dateOnly(date2)) /
      (60 * 60 * 24)
  );
}

type TLink = {
  lnk_id: string;
  lnk_url: string;
  lnk_id_user: string;
  lnk_title: string;
  lnk_tags: string;
  lnk_date_add: string;
  lnk_date_mod: string;
};

class SaveLink {
  private savedLink: TLink | null = null;
  private html = `
    <div id="lnk-banner" style="position: fixed;z-index: 99999999;top: 100px; left: 10px; background-color: #fff; border: 1px dotted #000; padding: 10px; color: black; display: none;">
      <div>
        <label for="tags">
            Tags
        </label>
        <input type="text" id="tags-input" value="rating-0" style="color: black; background-color: white; border: 1px solid black;" />
      </div>
      <div>
        <input type="checkbox" id="lnk-copy" name="lnk-copy" checked="true" />
        <label for="lnk-copy">Copy url after save</label>
      </div>
      <button type="button" id="lnk-save-button" style="border: 1px solid black;">save</button>
      <button type="button" id="lnk-close-button" style="border: 1px solid black;">close</button>
      <div id="links-message"></div>
    </div>
  `;

  injectDiv(divHtml: string) {
    const body = document.getElementsByTagName('body')[0];
    const div = document.createElement('div');
    div.innerHTML = divHtml;
    body.appendChild(div);
  };

  storeLink(link: TLink) {
    this.savedLink = link;
  }

  isAlreadySaved(url: string) {
    const messageInput: HTMLDivElement | null = document.getElementById('links-message') as HTMLDivElement;
    const endpoint = `http://localhost:8001/api/external/links/verify?lnk_url=${url}`;

    if (!messageInput) {
      console.error('links-message element not found');
      return;
    }

    /**
     * TODO: update tags on save if already exists
     */

    fetch(endpoint, {
      method: 'GET',
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response && response.links.length > 0) {
        messageInput.innerHTML = `saved ${response.links.length} times<br/>
        tags: ${response.links[0].lnk_tags}<br/>
        date: ${response.links[0].lnk_date_mod}<br/>
        elapsed days: ${elapsedDays(new Date(), new Date(response.links[0].lnk_date_mod))}
        `;

        // put existing tags in the input
        const tagsInput: HTMLInputElement | null = document.querySelector('#tags-input');
        if (!tagsInput) {
          console.error('tags-input element not found');
          return;
        }
        tagsInput.value = response.links[0].lnk_tags;

        this.storeLink(response.links[0]);
        this.showUI();
      } else {
        messageInput.innerHTML = `not saved`;
      }
      // show counter for today's date
      messageInput.innerHTML += `<br/><br/>Today's added count: ${response.added_counter.length && response.added_counter[0].counter}`;
      messageInput.innerHTML += `<br/>Today's modified count: ${response.modified_counter.length && response.modified_counter[0].counter}`;
      console.log(response);
    }).catch(err => {
      messageInput.innerHTML = 'could not determine if it was saved before';
      console.log(err);
    });
  };

  saveUrl() {
    // gets tags from page
    const tagsInput: HTMLInputElement | null = document.querySelector('#tags-input');
    const lnk_tags = tagsInput?.value || '';
    const messageInput: HTMLDivElement | null = document.getElementById('links-message') as HTMLDivElement;
    const copyInput = (document.getElementById('lnk-copy') as HTMLInputElement)?.checked || false;
    let url = window.location.href;
    let saveType = 'save';

    if (!messageInput) {
      console.error('links-message element not found');
      return;
    }

    // if twitter and ends with /media, trim /media to point directly to user
    if (url.includes('twitter.com/') && url.endsWith('/media')) {
      url = url.replace('/media', '');
    }

    let serviceURL = 'http://localhost:8001/api/external/links';
    if (messageInput?.innerHTML !== 'not saved' && this.savedLink !== null) {
      // Update, becasue it already exists
      serviceURL += `/${this.savedLink.lnk_id}`;
      saveType = 'update';
    }

    fetch(serviceURL, {
      method: 'POST',
      // mode: 'no-cors',
      body: JSON.stringify({
        lnk_id: this.savedLink ? this.savedLink.lnk_id : undefined,
        lnk_url: url,
        lnk_id_user: 'mycomplexsoul',
        lnk_title: document.title,
        lnk_tags,
        lnk_date_add: this.savedLink ? this.savedLink.lnk_date_add : undefined
      }),
      headers: {
        'Content-Type': 'application/json'
      }}).then((response) => {
        if (saveType === 'save') {
          messageInput.innerHTML = 'saved!';
        } else {
          messageInput.innerHTML = 'updated!';
        }
        
        // copy if enabled
        if (copyInput) {
          navigator.clipboard.writeText(url).then(() => {
            messageInput.innerHTML += ' and copied!';
          }).catch(e => {
            messageInput.innerHTML += ` and error trying to copy: ${e}`;
          });
        }

        console.log(response);
      }).catch(err => {
        if (saveType === 'save') {
          messageInput.innerHTML = 'error saving';
        } else {
          messageInput.innerHTML = 'error updating';
        }
        console.log(err);
      });
  }

  showUI() {
    const linkBanner: HTMLDivElement | null = document.getElementById('lnk-banner') as HTMLDivElement;
    if (!linkBanner) {
      console.error('lnk-banner element not found');
      return;
    }
    linkBanner.style.display = 'block';
  }

  hideUI() {
    const linkBanner: HTMLDivElement | null = document.getElementById('lnk-banner') as HTMLDivElement;
    if (!linkBanner) {
      console.error('lnk-banner element not found');
      return;
    }
    linkBanner.style.display = 'none';
  }

  registerHandlers() {
    const saveLinkButton = document.querySelector('#lnk-save-button');
    const closeButton = document.querySelector('#lnk-close-button');
    const tagsInput = document.querySelector('#tags-input');
    if (!saveLinkButton || !closeButton || !tagsInput) {
      console.error('One or more elements not found: saveLinkButton, closeButton, tagsInput');
      return;
    }
    saveLinkButton.addEventListener('click', this.saveUrl);
    closeButton.addEventListener('click', this.hideUI);
    tagsInput.addEventListener('keydown', (e: Event) => {
      const event = e as KeyboardEvent;
      if (event.key === 'Enter') {
        this.saveUrl();
      }
      if (event.key === 'Escape') {
        document.body.focus();
      }
      return false;
    });
    document.body.addEventListener("keydown", (event) => {
      if (event.key === 'Escape') {
        const tagsInput: HTMLInputElement | null = document.querySelector('#tags-input');
        if (tagsInput) {
          tagsInput.focus();
        }
      }
    })
  };
  
  init(url: string) {
    const whitelist = /x.com/gi;
    if (whitelist.test(url)){
      this.injectDiv(this.html);
      this.isAlreadySaved(url);
      this.registerHandlers();
    }
  }
}

export const saveLink = new SaveLink();
