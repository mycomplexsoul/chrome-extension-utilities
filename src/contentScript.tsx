// Este archivo se inyectará como content script y renderizará el Omnibox en la página activa
import React from 'react';
import { createRoot } from 'react-dom/client';
import Omnibox from './Omnibox';

console.log('Inyectando Omnibox en la página activa', { reactVersion: React.version });
const containerId = 'chrome-extension-omnibox-root';

function injectOmnibox() {
  if (document.getElementById(containerId)) return;
  // Crear el contenedor y el shadow root
  const container = document.createElement('div');
  container.id = containerId;
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '2147483647';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  // Shadow DOM para aislar React y estilos
  const shadow = container.attachShadow({ mode: 'open' });
  const shadowRootDiv = document.createElement('div');
  shadow.appendChild(shadowRootDiv);

  // Opcional: inyectar estilos globales dentro del shadow root
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    * { font-family: inherit; }
  `;
  shadow.appendChild(style);

  let omniboxOpen = false;
  const handleClose = () => {
    omniboxOpen = false;
    render();
  };
  const handleCommand = (command: string) => {
    console.log(`Comando ejecutado: ${command}`);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      omniboxOpen = true;
      render();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  function render() {
    // Asegura que el div esté en el shadow DOM antes de renderizar
    if (!shadowRootDiv.isConnected) {
      shadow.appendChild(shadowRootDiv);
    }
    // Renderiza sólo el Omnibox, no el componente App ni nada de main.tsx
    createRoot(shadowRootDiv).render(
      <Omnibox open={omniboxOpen} onClose={handleClose} onCommand={handleCommand} />
    );
    container.style.pointerEvents = omniboxOpen ? 'auto' : 'none';
  }
  render();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  injectOmnibox();
} else {
  window.addEventListener('DOMContentLoaded', injectOmnibox);
}
