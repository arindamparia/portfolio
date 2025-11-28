/**
 * Main App Component
 *
 * This is the root component of the portfolio application that manages:
 * - View mode switching between Modern and IDE layouts
 * - Responsive behavior based on screen size
 * - Form data persistence when switching views
 * - Theme management
 *
 * Features:
 * - Modern View: Clean, minimal portfolio layout for all screen sizes
 * - IDE View: VS Code-inspired interface (desktop/tablet only, 1024px+)
 * - Lazy loading for optimal performance
 * - Session storage integration to preserve contact form data
 */

import React, { lazy, Suspense } from 'react';
import DesktopRequired from './components/Shared/DesktopRequired';
import PrivacyBanner from './components/Shared/PrivacyBanner';
import { useViewMode } from './hooks/useViewMode';

// Lazy load layouts for better initial load performance
// These components are code-split and only loaded when needed
const IDELayout = lazy(() => import('./components/Layout/IDELayout'));
const ModernLayout = lazy(() => import('./components/Layout/ModernLayout'));

function App() {
  const { viewMode, setViewMode, isDesktop, toggleView } = useViewMode();

  return (
    // Apply theme-specific CSS class based on current view mode
    <div className={viewMode === 'ide' ? 'theme-ide' : 'theme-modern'}>
      <PrivacyBanner />
      {/* Suspense wrapper for lazy-loaded layouts with loading fallback */}
      <Suspense fallback={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontSize: '1.2rem'
        }}>
          Loading...
        </div>
      }>
        {/* Render appropriate layout based on view mode and screen size */}
        {viewMode === 'ide' ? (
          // IDE view: Show IDELayout on desktop, or fallback screen on mobile
          isDesktop ? <IDELayout /> : <DesktopRequired onSwitchToModern={() => setViewMode('modern')} />
        ) : (
          // Modern view: Works on all screen sizes
          <ModernLayout />
        )}
      </Suspense>

      {/* Floating toggle button to switch between Modern and IDE views */}
      <button
        className="theme-toggle"
        onClick={toggleView}
        title={!isDesktop && viewMode === 'modern' ? 'Click to learn about IDE View' : `Switch to ${viewMode === 'ide' ? 'Modern' : 'IDE'} View`}
        style={{
          cursor: 'pointer'
        }}
      >
        {viewMode === 'ide' ? '🎨 Modern' : '💻 IDE'}
      </button>
    </div>
  );
}

export default App;
