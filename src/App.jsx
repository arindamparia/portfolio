import React, { useState, useEffect, lazy, Suspense } from 'react';
import DesktopRequired from './components/Shared/DesktopRequired';

// Lazy load layouts for better initial load performance
const IDELayout = lazy(() => import('./components/Layout/IDELayout'));
const ModernLayout = lazy(() => import('./components/Layout/ModernLayout'));

function App() {
  const [viewMode, setViewMode] = useState('modern');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // If screen becomes small and user is in IDE view, switch to modern
      if (!desktop && viewMode === 'ide') {
        setViewMode('modern');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const toggleView = () => {
    // Only allow switching to IDE view on desktop
    if (!isDesktop && viewMode === 'modern') {
      return; // Do nothing on mobile when trying to switch to IDE
    }
    setViewMode(prev => prev === 'ide' ? 'modern' : 'ide');
  };

  return (
    <div className={viewMode === 'ide' ? 'theme-ide' : 'theme-modern'}>
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
        {viewMode === 'ide' ? (
          isDesktop ? <IDELayout /> : <DesktopRequired onSwitchToModern={() => setViewMode('modern')} />
        ) : (
          <ModernLayout />
        )}
      </Suspense>

      <button
        className="theme-toggle"
        onClick={toggleView}
        title={!isDesktop && viewMode === 'modern' ? 'IDE View requires desktop (1024px+)' : `Switch to ${viewMode === 'ide' ? 'Modern' : 'IDE'} View`}
        disabled={!isDesktop && viewMode === 'modern'}
        style={{
          cursor: !isDesktop && viewMode === 'modern' ? 'not-allowed' : 'pointer'
        }}
      >
        {viewMode === 'ide' ? '🎨 Modern' : '💻 IDE'}
      </button>
    </div>
  );
}

export default App;
