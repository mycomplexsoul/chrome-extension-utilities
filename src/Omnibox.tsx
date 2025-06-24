import React, { useState, useRef, useEffect } from 'react'
import { urlRotator } from './utilities/UrlRotator'
import { linkGrabber } from './utilities/LinkGrabber'
import { COMMANDS, doCommand } from './runCommand'

type OmniboxProps = {
  open: boolean
  onClose: () => void
  onCommand: (command: string) => void
}

const Omnibox: React.FC<OmniboxProps> = ({ open, onClose, onCommand }) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // this is the initial render for the omnibox
    // we can initialize other experiences in here
    // like the URL rotator
    const url = window.location.href;
    urlRotator.init(url);
    // or the LinkGrabber
    linkGrabber.init(url);
  }, [])
  
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
