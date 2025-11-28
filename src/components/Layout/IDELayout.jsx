/**
 * IDE Layout Component
 *
 * Mimics a VS Code-style interface with:
 * - Activity bar (left sidebar with icons)
 * - File explorer sidebar
 * - Tab bar for open files
 * - Main editor area for content
 * - Status bar at the bottom
 *
 * This layout is only shown on desktop/tablet (1024px+) screens.
 * Components are lazy loaded to improve initial page load performance.
 */

import React, { useState, lazy, Suspense, useEffect } from 'react';
import Sidebar from '../IDE/Sidebar';
import Tabs from '../IDE/Tabs';
import StatusBar from '../IDE/StatusBar';
import Home from '../IDE/Home';
import FileSearchModal from '../IDE/FileSearchModal';

// Lazy load tab components since they're conditionally rendered based on activeTab
// This reduces initial bundle size by only loading components when user navigates to them
const Projects = lazy(() => import('../IDE/Projects'));
const Experience = lazy(() => import('../IDE/Experience'));
const Skills = lazy(() => import('../IDE/Skills'));
const Education = lazy(() => import('../IDE/Education'));
const Certifications = lazy(() => import('../IDE/Certifications'));
const Contact = lazy(() => import('../IDE/Contact'));

const IDELayout = () => {
    // Track which tab/file is currently active in the editor
    const [activeTab, setActiveTab] = useState('home');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check for Cmd+P (Mac) or Ctrl+P (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    /**
     * Render the appropriate component based on the active tab
     * Each tab represents a different "file" in the IDE interface
     */
    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Home setActiveTab={setActiveTab} />;
            case 'projects': return <Projects />;
            case 'experience': return <Experience />;
            case 'skills': return <Skills />;
            case 'education': return <Education />;
            case 'certifications': return <Certifications />;
            case 'contact': return <Contact />;
            default: return <Home />;
        }
    };

    return (
        <div className="app-container">
            {/* Left sidebar with activity bar and file explorer */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Main editor area */}
            <div className="main-editor">
                {/* Tab bar showing open files */}
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Editor content area with lazy loading */}
                <div className="editor-content">
                    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'var(--font-code)', color: '#6a9955' }}>// Loading...</div>}>
                        {renderContent()}
                    </Suspense>
                </div>
            </div>

            {/* Bottom status bar (like VS Code) */}
            <StatusBar />

            {/* File Search Modal */}
            <FileSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectFile={setActiveTab}
            />
        </div>
    );
};

export default IDELayout;
