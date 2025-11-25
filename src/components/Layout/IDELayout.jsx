import React, { useState } from 'react';
import Sidebar from '../IDE/Sidebar';
import Tabs from '../IDE/Tabs';
import StatusBar from '../IDE/StatusBar';
import Home from '../IDE/Home';
import Projects from '../IDE/Projects';
import Experience from '../IDE/Experience';
import Skills from '../IDE/Skills';
import Education from '../IDE/Education';
import Contact from '../IDE/Contact';

const IDELayout = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Home />;
            case 'projects': return <Projects />;
            case 'experience': return <Experience />;
            case 'skills': return <Skills />;
            case 'education': return <Education />;
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
                    {renderContent()}
                </div>
            </div>
            <StatusBar />
        </div>
    );
};

export default IDELayout;
