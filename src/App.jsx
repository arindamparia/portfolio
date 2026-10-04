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

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { FaCog } from 'react-icons/fa';
import DesktopRequired from './components/Shared/DesktopRequired';
import ModernLayout from './components/Layout/ModernLayout';
import PrivacyBanner from './components/Shared/PrivacyBanner';
import { useViewMode } from './hooks/useViewMode';
import { liftCurtain } from './utils/curtain';

// Lazy load layouts for better initial load performance
// IDE and hacker views are code-split; the Modern view is the default, so it ships with the app
const IDELayout = lazy(() => import('./components/Layout/IDELayout'));

const HackerLayout = lazy(() => import('./components/Layout/HackerLayout'));

// Not needed for the first paint: loaded afterwards so Framer Motion stays off the critical path
const CustomCursor = lazy(() => import('./components/Shared/CustomCursor'));
const ScrollProgress = lazy(() => import('./components/Shared/ScrollProgress'));

function App() {
  const { viewMode, changeViewMode, isDesktop } = useViewMode();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // The Modern view lifts the curtain once its hero is ready; other views have no intro to wait for
  useEffect(() => {
    if (viewMode !== 'modern') liftCurtain();
  }, [viewMode]);

  // Determine the base classes for the layout
  const getThemeClass = () => {
    if (viewMode === 'ide') return 'theme-ide';
    if (viewMode === 'hacker') return 'theme-hacker';
    return 'theme-modern';
  };

  return (
    // Apply theme-specific CSS class based on current view mode
    <div className={getThemeClass()}>
      {/* Scroll progress bar and custom cursor belong to the IDE/hacker looks; the Modern view keeps the native cursor */}
      <Suspense fallback={null}>
        {viewMode !== 'modern' && <ScrollProgress />}
        {viewMode !== 'modern' && <CustomCursor />}
      </Suspense>
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
          isDesktop ? <IDELayout /> : <DesktopRequired onSwitchToModern={() => changeViewMode('modern')} />
        ) : viewMode === 'hacker' ? (
          <HackerLayout changeTheme={changeViewMode} />
        ) : (
          <ModernLayout />
        )}
      </Suspense>

      {/* Floating Theme Switcher Menu (Top Right) - Hidden in Hacker Mode and Mobile */}
      {viewMode !== 'hacker' && isDesktop && (
        <div ref={settingsRef} className="theme-switcher-container">
          <button
            type="button"
            className="theme-switcher-button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Choose a look"
            aria-expanded={showSettings}
            title="Choose a look"
          >
            <FaCog size={18} aria-hidden="true" />
          </button>

          <div
            className={`theme-menu ${showSettings ? 'is-open' : ''}`}
            aria-hidden={!showSettings}
            inert={!showSettings}
          >
            {[
              { mode: 'modern', label: '✨ Modern' },
              { mode: 'hacker', label: '🕶️ Hacker' },
              { mode: 'ide', label: '💻 IDE' },
            ].map((item) => (
              <button
                key={item.mode}
                type="button"
                className="theme-menu-item"
                aria-current={viewMode === item.mode ? 'true' : undefined}
                onClick={() => { changeViewMode(item.mode); setShowSettings(false); }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
