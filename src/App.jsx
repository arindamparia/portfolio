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

import React, { useState, useEffect, lazy, Suspense } from 'react';
import DesktopRequired from './components/Shared/DesktopRequired';

// Lazy load layouts for better initial load performance
// These components are code-split and only loaded when needed
const IDELayout = lazy(() => import('./components/Layout/IDELayout'));
const ModernLayout = lazy(() => import('./components/Layout/ModernLayout'));

function App() {
  // State: 'modern' for standard portfolio view, 'ide' for VS Code-style view
  const [viewMode, setViewMode] = useState('modern');

  // Track whether the user is on a desktop-sized screen (1024px+)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  /**
   * Handle window resize and automatically switch to Modern view on small screens
   * This ensures IDE view is only shown on devices that can properly display it
   */
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // Auto-switch to Modern view if screen becomes too small while in IDE view
      // This prevents broken layouts on mobile devices
      if (!desktop && viewMode === 'ide') {
        setViewMode('modern');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  /**
   * Toggle between Modern and IDE view modes
   * Includes safeguards for:
   * - Screen size validation (IDE only on 1024px+)
   * - Unsaved form data warnings
   * - SessionStorage preservation
   */
  const toggleView = () => {
    // Prevent switching to IDE view on mobile/small screens
    if (!isDesktop && viewMode === 'modern') {
      alert('💻 IDE View is available on laptop or tablet!\n\nThe IDE view provides a VS Code-style interface and is optimized for larger screens (1024px+). Please open this portfolio on a laptop or tablet to experience this feature.');
      return;
    }

    // Warn user about unsaved form data when switching from Modern view
    // Form data is preserved in sessionStorage and will be restored on return
    if (viewMode === 'modern') {
      try {
        const savedFormData = sessionStorage.getItem('contactFormData');
        if (savedFormData) {
          const formData = JSON.parse(savedFormData);
          // Check if any field has actual data
          const hasData = Object.values(formData).some(value => value && value.trim() !== '');

          if (hasData) {
            const confirmed = window.confirm(
              '📝 You have unsaved form data!\n\n' +
              'Your contact form will be preserved and restored when you return to Modern view.\n\n' +
              'Click OK to switch to IDE view, or Cancel to stay.'
            );
            if (!confirmed) {
              return; // User chose to stay, cancel view switch
            }
          }
        }
      } catch (error) {
        console.error('Error checking form data:', error);
      }
    }

    // Toggle between the two view modes
    setViewMode(prev => prev === 'ide' ? 'modern' : 'ide');
  };

  return (
    // Apply theme-specific CSS class based on current view mode
    <div className={viewMode === 'ide' ? 'theme-ide' : 'theme-modern'}>
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
