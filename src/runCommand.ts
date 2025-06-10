import { textToSpeech } from './TextToSpeech'
import { extractProductsFromPage } from './commands/read-product-hunt'
import { urlRotator } from './utilities/UrlRotator'
import { extractCoin360, extractFeedly, extractGBM, extractPiQ, extractTweets } from './commands/extract-content-from-page'

const COMMANDS = [
  {
    name: "copy-url",
    description: "Copia la URL actual al portapapeles."
  },
  {
    name: "Agregar a listado para copia",
    description: "Agrega el texto ingresado al listado para copiar más tarde."
  },
  {
    name: "Copiar listado a portapapeles",
    description: "Copia todo el listado acumulado al portapapeles."
  },
  {
    name: "test-voice",
    description: "Pronuncia 'hola desde la extensión' usando la voz en español con la API SpeechSynthesis."
  },
  {
    name: "read-product-hunt",
    description: "Lee el nombre y descripción de los productos en la página de inicio de Product Hunt."
  },
  {
    name: "copy-product-hunt",
    description: "Copia el nombre y descripción de los productos en la página de inicio de Product Hunt."
  },
  {
    name: "read-feedly",
    description: "Lee artículos cargados en la página de Feedly."
  },
  {
    name: "rotation-start",
    description: "Inicia la rotación de URLs."
  },
  {
    name: "rotation-stop",
    description: "Detiene la rotación de URLs."
  },
  {
    name: "rotation-next",
    description: "Salta a la siguiente URL en la rotación."
  },
  {
    name: "rotation-show-controls",
    description: "Muestra los controles de rotación de URLs."
  },
  {
    name: "rotation-hide-controls",
    description: "Oculta los controles de rotación de URLs."
  },
  {
    name: "read-tweets",
    description: "Lee los posts de Twitter cargados en la página actual."
  },
  {
    name: "read-gbm-newsletter",
    description: "Lee el contenido del boletín de noticias de GBM (Grupo Bursátil Mexicano) si está disponible en la página actual."
  },
  {
    name: "copy-gbm-newsletter",
    description: "Copia el contenido del boletín de noticias de GBM (Grupo Bursátil Mexicano) si está disponible en la página actual."
  },
  {
    name: "copy-piq",
    description: "Copia el contenido de noticias de PiQ si está disponible en la página actual."
  },
  {
    name: "copy-coin360",
    description: "Copia el contenido de noticias de coin360.com si está disponible en la página actual."
  },
  {
    name: "copy-feedly",
    description: "Copia el contenido de artículos de Feedly si está disponible en la página actual."
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
  }
}

export {
  COMMANDS,
  doCommand,
}