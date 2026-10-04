import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { PRIVACY_CONTENT, PRIVACY_CONFIG } from '../../constants/privacy';
import { waitForCurtain } from '../../utils/curtain';

// Leaving takes a little less time than arriving (see the .privacy-banner transitions)
const EXIT_MS = 180;

const needsConsent = () => {
    try {
        const consent = localStorage.getItem('privacyConsent');
        const consentTime = localStorage.getItem('privacyConsentTime');
        if (consent && consentTime) {
            const expired = Date.now() - parseInt(consentTime, 10) > PRIVACY_CONFIG.CONSENT_DURATION;
            if (!expired) return false;
            localStorage.removeItem('privacyConsent');
            localStorage.removeItem('privacyConsentTime');
        }
        return !localStorage.getItem('privacyConsent');
    } catch {
        return false;
    }
};

/**
 * Privacy banner. Plain CSS animation (no Framer Motion), so it ships with the page and appears
 * as soon as the page is shown, instead of popping in later.
 */
const PrivacyBanner = () => {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!needsConsent()) return undefined;
        let cancelled = false;
        waitForCurtain().then(() => {
            if (cancelled) return;
            setMounted(true);
            // Next frame, so the entry transition runs from the hidden state
            requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && setIsVisible(true)));
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const dismiss = (value) => {
        try {
            localStorage.setItem('privacyConsent', value);
            localStorage.setItem('privacyConsentTime', Date.now().toString());
        } catch {
            // Storage unavailable: the banner returns next visit
        }
        setIsVisible(false);
        setTimeout(() => setMounted(false), EXIT_MS);
    };

    const handleAccept = () => dismiss('granted');
    const handleDecline = () => dismiss('denied');

    if (!mounted) return null;

    return (
                <div
                    className={`privacy-banner ${isVisible ? 'is-visible' : ''}`}
                    role="region"
                    aria-label={PRIVACY_CONTENT.TITLE}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        right: '20px',
                        maxWidth: '600px',
                        margin: '0 auto',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        zIndex: 10002,
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        color: '#fff'
                    }}
                >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            padding: '10px',
                            borderRadius: '12px',
                            color: '#818cf8'
                        }}>
                            <FaShieldAlt size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {PRIVACY_CONTENT.TITLE}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                                {PRIVACY_CONTENT.DESCRIPTION}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button
                            onClick={handleDecline}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            <FaTimes size={12} /> {PRIVACY_CONTENT.BUTTON_DECLINE}
                        </button>
                        <button
                            onClick={handleAccept}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                color: '#fff',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                            }}
                        >
                            <FaCheck size={12} /> {PRIVACY_CONTENT.BUTTON_ACCEPT}
                        </button>
                    </div>
                </div>
    );
};

export default PrivacyBanner;
