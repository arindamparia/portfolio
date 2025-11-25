import React from 'react';
import { VscFiles, VscSearch, VscSourceControl, VscDebugAlt, VscExtensions, VscAccount, VscSettingsGear, VscChevronRight, VscChevronDown } from 'react-icons/vsc';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { ideFiles } from '../../constants/ideFiles.jsx';
import { socialLinks } from '../../constants/personalInfo.js';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const [showDisabledPrompt, setShowDisabledPrompt] = React.useState(false);
    const [disabledFeature, setDisabledFeature] = React.useState('');

    const handleDisabledClick = (featureName) => {
        setDisabledFeature(featureName);
        setShowDisabledPrompt(true);
        // Add vibration feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrate for 50ms
        }
        setTimeout(() => setShowDisabledPrompt(false), 3000);
    };


    return (
        <div className="ide-sidebar-container" style={{ display: 'flex', height: '100%' }}>
            <div className="activity-bar">
                <div className="activity-icon active" style={{ marginBottom: '20px', cursor: 'pointer', borderLeft: '2px solid white', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <VscFiles size={24} color="white" />
                </div>
                <div className="activity-icon" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleDisabledClick('Search')}><VscSearch size={24} color="#858585" /></div>
                <div className="activity-icon" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleDisabledClick('Source Control')}><VscSourceControl size={24} color="#858585" /></div>
                <div className="activity-icon" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleDisabledClick('Debug')}><VscDebugAlt size={24} color="#858585" /></div>
                <div className="activity-icon" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleDisabledClick('Extensions')}><VscExtensions size={24} color="#858585" /></div>

                <div style={{ marginTop: 'auto' }}>
                    <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" className="activity-icon social-icon" style={{ marginBottom: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: '#858585' }} aria-label={socialLinks.github.label}>
                        <FaGithub size={24} />
                    </a>
                    <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" className="activity-icon social-icon" style={{ marginBottom: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: '#858585' }} aria-label={socialLinks.linkedin.label}>
                        <FaLinkedin size={24} />
                    </a>
                    <a href={socialLinks.leetcode.url} target="_blank" rel="noopener noreferrer" className="activity-icon social-icon" style={{ marginBottom: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: '#858585' }} aria-label={socialLinks.leetcode.label}>
                        <SiLeetcode size={24} />
                    </a>
                </div>

                <div className="activity-icon bottom" style={{ marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <VscAccount size={24} color="#858585" />
                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50px',
                            background: '#252526',
                            border: '1px solid #454545',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '200px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                            zIndex: 1000,
                            color: '#cccccc'
                        }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>Arindam Paria</div>
                            <div style={{ fontSize: '0.8rem', marginBottom: '10px', color: '#858585' }}>Software Engineer</div>
                            <div
                                style={{
                                    cursor: 'pointer',
                                    padding: '5px',
                                    background: '#007acc',
                                    color: 'white',
                                    textAlign: 'center',
                                    borderRadius: '3px',
                                    fontSize: '0.9rem'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('contact');
                                    setShowProfileMenu(false);
                                }}
                            >
                                Contact Me
                            </div>
                        </div>
                    )}
                </div>
                <div className="activity-icon bottom" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => handleDisabledClick('Settings')}><VscSettingsGear size={24} color="#858585" /></div>
            </div>
            <div className="sidebar">
                <div className="explorer-title">Explorer</div>
                <div className="explorer-section" style={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                    <div className="explorer-header" style={{ display: 'flex', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', padding: '5px 0' }}>
                        {isOpen ? <VscChevronDown /> : <VscChevronRight />}
                        <span style={{ marginLeft: '5px' }}>PORTFOLIO</span>
                    </div>
                </div>
                {isOpen && (
                    <div className="file-list" style={{ paddingLeft: '10px' }}>
                        {ideFiles.map((file) => (
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
            {showDisabledPrompt && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#1e1e1e',
                    border: '2px solid #007acc',
                    borderRadius: '8px',
                    padding: '20px 30px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                    zIndex: 9999,
                    color: 'white',
                    textAlign: 'center',
                    animation: 'slideIn 0.3s ease-out',
                    minWidth: '300px'
                }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: '#007acc' }}>
                        {disabledFeature}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#cccccc' }}>
                        This feature is currently disabled
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#858585', marginTop: '8px' }}>
                        Portfolio showcase only
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
