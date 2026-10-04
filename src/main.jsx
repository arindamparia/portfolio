/**
 * Main entry point of the portfolio application
 *
 * This file bootstraps the React application and renders it to the DOM.
 * It uses React 18's createRoot API for concurrent rendering features.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/components.css';
import './styles/themes/night.css';
import './styles/themes/hacker.css';
import './styles/themes/ide.css';
import App from './App.jsx'

// Initialize React root and render the application with StrictMode enabled
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service worker (PWA) in production only. In development it would cache Vite's source modules,
// so remove any worker and caches left over from earlier visits.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
    }
  }
}
