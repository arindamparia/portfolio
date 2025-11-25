import React, { useState, useEffect, lazy, Suspense } from 'react';
import DesktopRequired from './components/Shared/DesktopRequired';
import InteractiveCursor from './components/Shared/InteractiveCursor';

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
      alert('💻 IDE View is available on laptop or tablet!\n\nThe IDE view provides a VS Code-style interface and is optimized for larger screens (1024px+). Please open this portfolio on a laptop or tablet to experience this feature.');
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

      {/* Interactive Custom Cursor */}
      <InteractiveCursor />

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
