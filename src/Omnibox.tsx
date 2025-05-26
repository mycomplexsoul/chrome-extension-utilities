import React, { useState, useRef, useEffect } from 'react'
import { textToSpeech } from './TextToSpeech'
import { extractItemsFromPage } from './commands/read-product-hunt'

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
  }
]

type OmniboxProps = {
  open: boolean
  onClose: () => void
  onCommand: (command: string) => void
}

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
      const items = extractItemsFromPage();
      if (items.length > 0) {
        for (const item of items) {
          await textToSpeech.textToSpeechVoice(item, 'es-US', 1, 0.6);
        }
      }
      break;
    }
  }
}

const Omnibox: React.FC<OmniboxProps> = ({ open, onClose, onCommand }) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
    if (!open) setInput('')
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCommand(input)
      doCommand(input)
      setInput('')
      onClose()
    } else if (e.key === 'Escape') {
      setInput('')
      onClose()
    }
  }

  // Buscar la descripción del comando ingresado
  const matchedCommand = COMMANDS.find(cmd => input.startsWith(cmd.name))

  if (!open) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        minWidth: 320,
        boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'transparent',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: '#888'
          }}
          aria-label="Cerrar Omnibox"
        >
          ×
        </button>
        <input
          ref={inputRef}
          list="omnibox-commands"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un comando..."
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
        <datalist id="omnibox-commands">
          {COMMANDS.map(cmd => (
            <option key={cmd.name} value={cmd.name} />
          ))}
        </datalist>
        {matchedCommand && (
          <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>
            {matchedCommand.description}
          </div>
        )}
      </div>
    </div>
  )
}

export default Omnibox
