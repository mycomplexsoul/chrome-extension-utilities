// This file will be injected as a content script and will render the Omnibox in the active page
import React from 'react';
import { createRoot } from 'react-dom/client';
import Omnibox from './Omnibox';
import { doCommand } from './runCommand';

declare global {
  interface Window {
    doCommand: typeof doCommand;
  }
}

console.log('Injecting Omnibox in the active page', { reactVersion: React.version });
const containerId = 'chrome-extension-omnibox-root';

function injectOmnibox() {
  window.doCommand = (command: string) => doCommand(command);
  console.log('Omnibox registered doCommand on console', { command: window.doCommand });

  if (document.getElementById(containerId)) return;
  // Create the container and the shadow root
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

  // Shadow DOM to isolate React and styles
  const shadow = container.attachShadow({ mode: 'open' });
  const shadowRootDiv = document.createElement('div');
  shadow.appendChild(shadowRootDiv);

  // Optional: inject global styles inside the shadow root
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    * { font-family: inherit; }
  `;
  shadow.appendChild(style);

  let omniboxOpen = false;
  let root: ReturnType<typeof createRoot> | null = null;
  const handleClose = () => {
    omniboxOpen = false;
    render();
  };
  const handleCommand = (command: string) => {
    console.log(`Command executed: ${command}`);
  };
  // Register keydown, keyup, and keypress events on window in capture mode for maximum compatibility
  const keyHandler = (e: KeyboardEvent) => {
    console.log('keydown/keyup/keypress event', e.type, e.ctrlKey, e.shiftKey, e.altKey, e.key);
    // Try a less common combination to avoid conflicts
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      omniboxOpen = true;
      render();
    }
  };
  window.addEventListener('keydown', keyHandler, true);

  function render() {
    // Ensure the div is in the shadow DOM before rendering
    if (!shadowRootDiv.isConnected) {
      shadow.appendChild(shadowRootDiv);
    }
    // Use a persistent root to avoid issues with React concurrent rendering
    if (!root) {
      root = createRoot(shadowRootDiv);
    }
    root.render(
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
