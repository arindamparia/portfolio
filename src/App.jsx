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
        <div ref={settingsRef} className="theme-switcher-container" style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          title="Theme Settings"
          style={{ 
            cursor: 'pointer', 
            borderRadius: '50%', 
            width: '45px', 
            height: '45px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 0,
            background: 'var(--bg-card, rgba(0,0,0,0.8))',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-medium)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <FaCog size={20} />
        </button>

            <div
              className={`theme-menu ${showSettings ? 'is-open' : ''}`}
              aria-hidden={!showSettings}
              inert={!showSettings}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'var(--bg-card, rgba(0,0,0,0.8))',
                padding: '10px',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }}
            >
              <button
                onClick={() => { changeViewMode('modern'); setShowSettings(false); }}
                style={{ cursor: 'pointer', opacity: viewMode === 'modern' ? 1 : 0.6, fontSize: '0.9rem', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', borderRadius: '8px' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                ✨ Modern
              </button>
              <button
                onClick={() => { changeViewMode('hacker'); setShowSettings(false); }}
                style={{ cursor: 'pointer', opacity: viewMode === 'hacker' ? 1 : 0.6, fontSize: '0.9rem', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', borderRadius: '8px' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                🕶️ Hacker
              </button>
              {isDesktop && (
                <button
                  onClick={() => { changeViewMode('ide'); setShowSettings(false); }}
                  style={{ cursor: 'pointer', opacity: viewMode === 'ide' ? 1 : 0.6, fontSize: '0.9rem', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', borderRadius: '8px' }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  💻 IDE
                </button>
              )}
            </div>
      </div>
      )}
    </div>
  );
}

export default App;
