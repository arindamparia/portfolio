import React from 'react';
import { VscSourceControl, VscError, VscWarning, VscBell, VscCheck } from 'react-icons/vsc';

const StatusBar = () => {
    return (
        <div className="status-bar">
            <div style={{ display: 'flex' }}>
                <div className="status-item" style={{ background: '#007acc', padding: '0 10px', marginRight: 0 }}>
                    <VscSourceControl /> main*
                </div>
                <div className="status-item" style={{ marginLeft: '10px' }}>
                    <VscError /> 0 <VscWarning /> 0
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div className="status-item">
                    Ln 12, Col 45
                </div>
                <div className="status-item">
                    UTF-8
                </div>
                <div className="status-item">
                    JavaScript JSX
                </div>
                <div className="status-item">
                    <VscCheck /> Prettier
                </div>
                <div className="status-item">
                    <VscBell />
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
