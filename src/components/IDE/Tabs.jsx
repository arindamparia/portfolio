import React from 'react';
import { FaReact, FaJs, FaHtml5, FaCss3, FaMarkdown } from 'react-icons/fa';
import { SiJson } from 'react-icons/si';
import { VscClose } from 'react-icons/vsc';

const Tabs = ({ activeTab, setActiveTab }) => {
    const files = [
        { name: 'home.jsx', icon: <FaReact color="#61DAFB" />, id: 'home' },
        { name: 'projects.js', icon: <FaJs color="#F7DF1E" />, id: 'projects' },
        { name: 'experience.json', icon: <SiJson color="#F7DF1E" />, id: 'experience' },
        { name: 'skills.json', icon: <SiJson color="#F7DF1E" />, id: 'skills' },
        { name: 'education.md', icon: <FaMarkdown color="#42A5F5" />, id: 'education' },
        { name: 'certifications.json', icon: <SiJson color="#F7DF1E" />, id: 'certifications' },
        { name: 'contact.css', icon: <FaCss3 color="#42A5F5" />, id: 'contact' },
    ];

    return (
        <div className="tabs-bar">
            {files.map((file) => (
                <div
                    key={file.id}
                    className={`tab ${activeTab === file.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(file.id)}
                >
                    <span className="tab-icon">{file.icon}</span>
                    {file.name}
                    {activeTab === file.id && <VscClose style={{ marginLeft: 'auto', fontSize: '14px' }} />}
                </div>
            ))}
        </div>
    );
};

export default Tabs;
