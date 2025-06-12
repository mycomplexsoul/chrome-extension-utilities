import { textToSpeech } from './TextToSpeech'
import { extractProductsFromPage } from './commands/read-product-hunt'
import { urlRotator } from './utilities/UrlRotator'
import { extractCoin360, extractFeedly, extractGBM, extractPiQ, extractTelegram, extractTweets } from './commands/extract-content-from-page'

const COMMANDS = [
  {
    name: "copy-url",
    description: "Copies the current URL to the clipboard."
  },
  {
    name: "Agregar a listado para copia",
    description: "Adds the entered text to the list to copy later."
  },
  {
    name: "Copiar listado a portapapeles",
    description: "Copies the entire accumulated list to the clipboard."
  },
  {
    name: "test-voice",
    description: "Speaks 'hola desde la extensión' using a Spanish voice with the SpeechSynthesis API."
  },
  {
    name: "read-product-hunt",
    description: "Reads the name and description of products on the Product Hunt homepage."
  },
  {
    name: "copy-product-hunt",
    description: "Copies the name and description of products on the Product Hunt homepage."
  },
  {
    name: "read-feedly",
    description: "Reads articles loaded on the Feedly page."
  },
  {
    name: "rotation-start",
    description: "Starts the URL rotation."
  },
  {
    name: "rotation-stop",
    description: "Stops the URL rotation."
  },
  {
    name: "rotation-next",
    description: "Jumps to the next URL in the rotation."
  },
  {
    name: "rotation-show-controls",
    description: "Shows the URL rotation controls."
  },
  {
    name: "rotation-hide-controls",
    description: "Hides the URL rotation controls."
  },
  {
    name: "read-tweets",
    description: "Reads the Twitter posts loaded on the current page."
  },
  {
    name: "copy-tweets",
    description: "Copies the Twitter posts loaded on the current page."
  },
  {
    name: "read-gbm-newsletter",
    description: "Reads the content of the GBM (Grupo Bursátil Mexicano) newsletter if available on the current page."
  },
  {
    name: "copy-gbm-newsletter",
    description: "Copies the content of the GBM (Grupo Bursátil Mexicano) newsletter if available on the current page."
  },
  {
    name: "copy-piq",
    description: "Copies the news content from PiQ if available on the current page."
  },
  {
    name: "copy-coin360",
    description: "Copies the news content from coin360.com if available on the current page."
  },
  {
    name: "copy-feedly",
    description: "Copies the article content from Feedly if available on the current page."
  },
  {
    name: "copy-telegram",
    description: "Copies the messages content from Telegram if available on the current page."
  },
];

const doCommand = async (command: string) => {
  const commandName: string = command.split(' ')[0];
  const commandArgs: string[] = command.split(' ').slice(1);

  switch (commandName) {
    case "copy-url": {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        console.log(`URL copiada: ${url}`);
      }).catch(err => {
        console.error('Error al copiar la URL: ', err);
      });
      break;
    }
    case 'add-to-list-1': {
      const list1 = commandArgs.join(' ');
      console.log(`Agregado a lista 1: ${list1}`);
      break;
    }
    case "test-voice": {
      await textToSpeech.textToSpeechVoice('hola, si escuchas esto entonces todo funciona bien', 'es-US', 1, 0.6);
      break;
    }
    case "read-product-hunt": {
      const items = extractProductsFromPage();
      await textToSpeech.textToSpeechVoice(`Leyendo ${items.length} productos`, 'es-US', 1, 0.6);
      for (const item of items) {
        await textToSpeech.textToSpeechVoice(item, 'es-US', 1, 0.6);
      }
      break;
    }
    case "copy-product-hunt": {
      const items = extractProductsFromPage();
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} artículos al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
    case "read-feedly": {
      const items = extractFeedly();
      await textToSpeech.textToSpeechVoice(`Leyendo ${items.length} artículos`, 'es-US', 1, 0.6);
      for (const item of items) {
        await textToSpeech.textToSpeechVoice(item, 'es-US', 1, 0.6);
      }
      break;
    }
    case "rotation-show-controls": {
      urlRotator.showUI();
      break;
    }
    case "rotation-hide-controls": {
      urlRotator.closeUI();
      break;
    }
    case "rotation-start": {
      urlRotator.startRotation();
      break;
    }
    case "rotation-stop": {
      urlRotator.stopRotation();
      break;
    }
    case "rotation-next": {
      urlRotator.nextRotation();
      break;
    }
    case "read-tweets": {
      const items = extractTweets();
      await textToSpeech.textToSpeechVoice(`Leyendo ${items.length} posts`, 'es-US', 1, 0.6);
      for (const item of items) {
        await textToSpeech.textToSpeechVoice(item, 'es-US', 1, 0.6);
      }
      break;
    }
    case "copy-tweets": {
      const items = extractTweets();
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} posts al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
    case "read-gbm-newsletter": {
      const items = extractGBM();
      try {
        await textToSpeech.textToSpeechVoice(`Leyendo ${items.length} artículos`, 'es-US', 1, 0.6);
        
        for (const item of items) {
          await textToSpeech.textToSpeechVoice(item, 'es-US', 1, 0.6);
        }
      } catch (error) {
        console.error('Error al leer el boletín de noticias de GBM:', error);
      }
      break;
    }
    case "copy-gbm-newsletter": {
      const items = extractGBM();
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} artículos al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
    case "copy-piq": {
      const items = extractPiQ().slice(0, 20);
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} artículos al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
    case "copy-coin360": {
      const items = extractCoin360().slice(76).slice(0, 20);
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} artículos al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
    case "copy-feedly": {
      const items = extractFeedly();
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} artículos al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
    case "copy-telegram": {
      const items = extractTelegram();
      await navigator.clipboard.writeText(items.join('\n'))
      await textToSpeech.textToSpeechVoice(`Copiados ${items.length} mensajes al portapapeles`, 'es-US', 1, 0.6);
      break;
    }
  }
}

export {
  COMMANDS,
  doCommand,
}