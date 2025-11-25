import React, { useState } from 'react';
import IDELayout from './components/Layout/IDELayout';
import ModernLayout from './components/Layout/ModernLayout';

function App() {
  const [viewMode, setViewMode] = useState('ide'); // 'ide' or 'modern'

  const toggleView = () => {
    setViewMode(prev => prev === 'ide' ? 'modern' : 'ide');
  };

  return (
    <div className={viewMode === 'ide' ? 'theme-ide' : 'theme-modern'}>
      {viewMode === 'ide' ? <IDELayout /> : <ModernLayout />}

      <button className="theme-toggle" onClick={toggleView}>
        Switch to {viewMode === 'ide' ? 'Modern' : 'IDE'} View
      </button>
    </div>
  );
}

export default App;
