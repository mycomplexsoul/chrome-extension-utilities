import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './contentScript'

console.log('Inyectando App en la página activa', { reactVersion: React.version })
// Elimina la inicialización automática de React en el root para evitar que el bundle intente montar la app en la página
if (
  window.location.pathname === '/' ||
  window.location.pathname === '/index.html'
) {
  const root = document.getElementById('omnibox-root');
  if (root) {
    ReactDOM.createRoot(root).render(<App />);
  }
}
