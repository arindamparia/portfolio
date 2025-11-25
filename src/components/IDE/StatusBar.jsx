import React from 'react';
import { VscSourceControl, VscError, VscWarning, VscBell, VscCheck } from 'react-icons/vsc';

const StatusBar = () => {
    return (
        <div className="status-bar">
            <div className="status-bar-left" style={{ display: 'flex' }}>
                <div className="status-item git-branch" style={{ background: '#007acc', padding: '0 10px', marginRight: 0 }}>
                    <VscSourceControl /> main*
                </div>
                <div className="status-item problems" style={{ marginLeft: '10px' }}>
                    <VscError /> 0 <VscWarning /> 0
                </div>
            </div>
            <div className="status-bar-right" style={{ display: 'flex' }}>
                <div className="status-item cursor-position">
                    Ln 12, Col 45
                </div>
                <div className="status-item encoding">
                    UTF-8
                </div>
                <div className="status-item language">
                    JavaScript JSX
                </div>
                <div className="status-item formatter">
                    <VscCheck /> Prettier
                </div>
                <div className="status-item notifications">
                    <VscBell />
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
