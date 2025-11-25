import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <FaCheckCircle size={24} />,
        error: <FaExclamationCircle size={24} />
    };

    const colors = {
        success: {
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '#667eea'
        },
        error: {
            bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            border: '#f5576c'
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                background: colors[type].bg,
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 10000,
                minWidth: '300px',
                maxWidth: '500px',
                border: `2px solid ${colors[type].border}`,
            }}
        >
            <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
                {icons[type]}
            </motion.div>
            <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500' }}>
                {message}
            </div>
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FaTimes size={18} />
            </motion.button>
        </motion.div>
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

export default ToastContainer;
