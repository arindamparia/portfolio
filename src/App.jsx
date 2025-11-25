import React, { useState, useEffect } from 'react';
import IDELayout from './components/Layout/IDELayout';
import ModernLayout from './components/Layout/ModernLayout';
import DesktopRequired from './components/Shared/DesktopRequired';

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
      {viewMode === 'ide' ? (
        isDesktop ? <IDELayout /> : <DesktopRequired onSwitchToModern={() => setViewMode('modern')} />
      ) : (
        <ModernLayout />
      )}

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
