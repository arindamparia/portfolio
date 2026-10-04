import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes, FaInfoCircle } from 'react-icons/fa';

/**
 * Toasts for the contact form: dark glass cards stacked under the nav bar, each with a hairline
 * that runs down until it closes itself. Several toasts stack instead of covering each other.
 */

const ICONS = {
    success: <FaCheckCircle aria-hidden="true" />,
    error: <FaExclamationCircle aria-hidden="true" />,
    info: <FaInfoCircle aria-hidden="true" />,
};

const TITLES = { success: 'Sent', error: 'Not sent', info: 'Note' };

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
    // Keep the latest onClose without restarting the timer on every render
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!duration) return undefined;
        const timer = setTimeout(() => onCloseRef.current(), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const tone = ICONS[type] ? type : 'success';

    return (
        <motion.div
            layout
            className={`toast toast-${tone}`}
            role={tone === 'error' ? 'alert' : 'status'}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.15, ease: 'easeIn' } }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
        >
            <span className="toast-icon">{ICONS[tone]}</span>
            <div className="toast-body">
                <p className="toast-title">{TITLES[tone]}</p>
                <p className="toast-message">{message}</p>
            </div>
            <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
                <FaTimes aria-hidden="true" />
            </button>
            {duration > 0 && <span className="toast-timer" style={{ animationDuration: `${duration}ms` }} aria-hidden="true" />}
        </motion.div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => ReactDOM.createPortal(
    <div className="toast-stack">
        <AnimatePresence initial={false}>
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
    </div>,
    document.body
);

export default React.memo(ToastContainer);
