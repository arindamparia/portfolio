import React from 'react';
import { useSky } from '../../sky/react/SkyContext';
import { personalInfo } from '../../constants/personalInfo';

const Footer = () => {
    const { paused, setPaused, status, reducedMotion } = useSky();

    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <div className="footer-meta">
                    {status === 'ready' && !reducedMotion && (
                        <button
                            type="button"
                            className="sky-toggle"
                            aria-pressed={paused}
                            onClick={() => setPaused(!paused)}
                        >
                            {paused ? 'Resume the sky' : 'Pause the sky'}
                        </button>
                    )}
                    {status === 'ready' && <p>The sky is drawn with Three.js on WebGPU, and every demo runs the real algorithm.</p>}
                    <p>© {new Date().getFullYear()} {personalInfo.name.full}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
