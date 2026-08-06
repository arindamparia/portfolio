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
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { FaCog } from 'react-icons/fa';
import DesktopRequired from './components/Shared/DesktopRequired';
import PrivacyBanner from './components/Shared/PrivacyBanner';
import CustomCursor from './components/Shared/CustomCursor';
import { useViewMode } from './hooks/useViewMode';

// Lazy load layouts for better initial load performance
// These components are code-split and only loaded when needed
const IDELayout = lazy(() => import('./components/Layout/IDELayout'));
const ModernLayout = lazy(() => import('./components/Layout/ModernLayout'));
const HackerLayout = lazy(() => import('./components/Layout/HackerLayout'));

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Determine the base classes for the layout
  const getThemeClass = () => {
    if (viewMode === 'ide') return 'theme-ide';
    if (viewMode === 'hacker') return 'theme-hacker';
    return 'theme-modern';
  };

  return (
    // Apply theme-specific CSS class based on current view mode
    <div className={getThemeClass()}>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--modern-accent-primary, #38bdf8), var(--modern-accent-secondary, #818cf8))',
          transformOrigin: '0%',
          scaleX,
          zIndex: 10000
        }}
      />
      <CustomCursor />
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

      {/* Floating Theme Switcher Menu (Top Right) - Hidden in Hacker Mode */}
      {viewMode !== 'hacker' && (
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

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
