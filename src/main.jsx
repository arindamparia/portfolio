/**
 * Main entry point of the portfolio application
 *
 * This file bootstraps the React application and renders it to the DOM.
 * It uses React 18's createRoot API for concurrent rendering features.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize React root and render the application with StrictMode enabled
// StrictMode helps identify potential problems in the application during development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
