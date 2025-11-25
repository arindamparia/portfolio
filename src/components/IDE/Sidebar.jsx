import React from 'react';
import { VscFiles, VscSearch, VscSourceControl, VscDebugAlt, VscExtensions, VscAccount, VscSettingsGear, VscChevronRight, VscChevronDown } from 'react-icons/vsc';
import { FaReact, FaJs, FaHtml5, FaCss3, FaMarkdown, FaEnvelope, FaCode } from 'react-icons/fa';
import { SiJson } from 'react-icons/si';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const files = [
        { name: 'home.jsx', icon: <FaReact color="#61DAFB" />, id: 'home' },
        { name: 'projects.js', icon: <FaJs color="#F7DF1E" />, id: 'projects' },
        { name: 'experience.json', icon: <SiJson color="#F7DF1E" />, id: 'experience' },
        { name: 'skills.json', icon: <SiJson color="#F7DF1E" />, id: 'skills' },
        { name: 'education.md', icon: <FaMarkdown color="#42A5F5" />, id: 'education' },
        { name: 'contact.css', icon: <FaCss3 color="#42A5F5" />, id: 'contact' },
    ];

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div className="activity-bar">
                <div style={{ marginBottom: '20px', cursor: 'pointer', borderLeft: '2px solid white', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <VscFiles size={24} color="white" />
                </div>
                <div style={{ marginBottom: '20px', cursor: 'pointer' }}><VscSearch size={24} color="#858585" /></div>
                <div style={{ marginBottom: '20px', cursor: 'pointer' }}><VscSourceControl size={24} color="#858585" /></div>
                <div style={{ marginBottom: '20px', cursor: 'pointer' }}><VscDebugAlt size={24} color="#858585" /></div>
                <div style={{ marginBottom: '20px', cursor: 'pointer' }}><VscExtensions size={24} color="#858585" /></div>
                <div style={{ marginTop: 'auto', marginBottom: '20px', cursor: 'pointer' }}><VscAccount size={24} color="#858585" /></div>
                <div style={{ marginBottom: '20px', cursor: 'pointer' }}><VscSettingsGear size={24} color="#858585" /></div>
            </div>
            <div className="sidebar">
                <div className="explorer-title">Explorer</div>
                <div style={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', padding: '5px 0' }}>
                        {isOpen ? <VscChevronDown /> : <VscChevronRight />}
                        <span style={{ marginLeft: '5px' }}>PORTFOLIO</span>
                    </div>
                </div>
                {isOpen && (
                    <div style={{ paddingLeft: '10px' }}>
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className={`file-item ${activeTab === file.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(file.id)}
                            >
                                <span className="file-icon">{file.icon}</span>
                                {file.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
