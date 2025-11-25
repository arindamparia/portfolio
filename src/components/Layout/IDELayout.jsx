import React, { useState, lazy, Suspense } from 'react';
import Sidebar from '../IDE/Sidebar';
import Tabs from '../IDE/Tabs';
import StatusBar from '../IDE/StatusBar';
import Home from '../IDE/Home';

// Lazy load tab components since they're conditionally rendered
const Projects = lazy(() => import('../IDE/Projects'));
const Experience = lazy(() => import('../IDE/Experience'));
const Skills = lazy(() => import('../IDE/Skills'));
const Education = lazy(() => import('../IDE/Education'));
const Certifications = lazy(() => import('../IDE/Certifications'));
const Contact = lazy(() => import('../IDE/Contact'));

const IDELayout = () => {
    const [activeTab, setActiveTab] = useState('home');

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
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="main-editor">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="editor-content">
                    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'var(--font-code)', color: '#6a9955' }}>// Loading...</div>}>
                        {renderContent()}
                    </Suspense>
                </div>
            </div>
            <StatusBar />
        </div>
    );
};

export default IDELayout;
