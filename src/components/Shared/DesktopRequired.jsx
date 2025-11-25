import React from 'react';

const DesktopRequired = ({ onSwitchToModern }) => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '500px',
                padding: '2rem',
                backgroundColor: '#252526',
                borderRadius: '12px',
                border: '1px solid #3e3e42'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#007acc' }}>
                    Desktop Required
                </h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#858585' }}>
                    The IDE view is optimized for desktop screens. Please open this portfolio on a larger device to experience the VS Code-style interface.
                </p>
                <button
                    onClick={onSwitchToModern}
                    style={{
                        padding: '0.8rem 2rem',
                        backgroundColor: '#007acc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#005a9e'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007acc'}
                >
                    Switch to Modern View
                </button>
            </div>
        </div>
    );
};

export default DesktopRequired;
