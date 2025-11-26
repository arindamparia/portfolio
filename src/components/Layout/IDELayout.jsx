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

import React, { useState, lazy, Suspense } from 'react';
import Sidebar from '../IDE/Sidebar';
import Tabs from '../IDE/Tabs';
import StatusBar from '../IDE/StatusBar';
import Home from '../IDE/Home';

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
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
        </div>
    );
};

export default IDELayout;
