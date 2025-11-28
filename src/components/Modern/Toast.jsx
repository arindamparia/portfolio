import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes, FaInfoCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
    // Use ref to store the latest onClose callback to avoid resetting timer on re-renders
    const onCloseRef = React.useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onCloseRef.current();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]); // Removed onClose from dependencies

    const icons = {
        success: <FaCheckCircle size={20} />,
        error: <FaExclamationCircle size={20} />,
        info: <FaInfoCircle size={20} />
    };

    const styles = {
        success: {
            iconColor: '#4ade80',
            progressColor: '#4ade80',
            gradient: 'linear-gradient(to right, rgba(74, 222, 128, 0.1), transparent)'
        },
        error: {
            iconColor: '#f87171',
            progressColor: '#f87171',
            gradient: 'linear-gradient(to right, rgba(248, 113, 113, 0.1), transparent)'
        },
        info: {
            iconColor: '#60a5fa',
            progressColor: '#60a5fa',
            gradient: 'linear-gradient(to right, rgba(96, 165, 250, 0.1), transparent)'
        }
    };

    const currentStyle = styles[type] || styles.success;

    return ReactDOM.createPortal(
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                zIndex: 99999,
                pointerEvents: 'auto',
            }}
        >
            <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '320px',
                maxWidth: '400px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Background Gradient */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: currentStyle.gradient,
                    opacity: 0.5,
                    zIndex: -1
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                        color: currentStyle.iconColor,
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icons[type] || icons.success}
                    </div>

                    <div style={{ flex: 1 }}>
                        <p style={{
                            margin: 0,
                            color: '#1f2937',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            lineHeight: '1.4'
                        }}>
                            {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}
                        </p>
                        <p style={{
                            margin: '4px 0 0 0',
                            color: '#4b5563',
                            fontSize: '0.875rem',
                            lineHeight: '1.4'
                        }}>
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                            e.currentTarget.style.color = '#4b5563';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#9ca3af';
                        }}
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Progress Bar */}
                {duration > 0 && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '3px',
                        width: '100%',
                        background: 'rgba(0,0,0,0.05)'
                    }}>
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                            style={{
                                height: '100%',
                                background: currentStyle.progressColor,
                            }}
                        />
                    </div>
                )}
            </div>
        </motion.div>,
        document.body
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <AnimatePresence mode="sync">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                />
            ))}
        </AnimatePresence>
    );
};

export default React.memo(ToastContainer);
