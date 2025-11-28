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
import './styles/themes/modern.css';
import './styles/themes/ide.css';
import App from './App.jsx'

// Initialize React root and render the application with StrictMode enabled
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
