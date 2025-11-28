import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { PRIVACY_CONTENT, PRIVACY_CONFIG } from '../../constants/privacy';

const PrivacyBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('privacyConsent');
        const consentTime = localStorage.getItem('privacyConsentTime');

        console.log('🛡️ PrivacyBanner mounted. Consent:', consent);

        // Check if consent has expired
        if (consent && consentTime) {
            const isExpired = (Date.now() - parseInt(consentTime)) > PRIVACY_CONFIG.CONSENT_DURATION;
            if (isExpired) {
                console.log('⌛ Privacy consent expired. Clearing...');
                localStorage.removeItem('privacyConsent');
                localStorage.removeItem('privacyConsentTime');
                // Fall through to show banner
            } else {
                console.log('🛡️ PrivacyBanner hidden (consent valid)');
                return;
            }
        }

        // If no consent or expired
        if (!localStorage.getItem('privacyConsent')) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => {
                console.log('🛡️ PrivacyBanner showing now...');
                setIsVisible(true);
            }, PRIVACY_CONFIG.BANNER_DELAY);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        console.log('✅ Privacy accepted');
        localStorage.setItem('privacyConsent', 'granted');
        localStorage.setItem('privacyConsentTime', Date.now().toString());
        setIsVisible(false);
    };

    const handleDecline = () => {
        console.log('❌ Privacy declined');
        localStorage.setItem('privacyConsent', 'denied');
        localStorage.setItem('privacyConsentTime', Date.now().toString());
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                                transition: 'all 0.2s'
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
                                transition: 'all 0.2s'
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PrivacyBanner;
