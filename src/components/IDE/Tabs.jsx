import React from 'react';
import { VscClose } from 'react-icons/vsc';
import { ideFiles } from '../../constants/ideFiles.js';

const Tabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="tabs-bar">
            {ideFiles.map((file) => (
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
