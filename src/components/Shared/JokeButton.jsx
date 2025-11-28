import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vibrateLight } from '../../utils/vibration';

// Simple Elegant Robot Icon
const RobotIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="5" width="16" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 10V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 10H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 10H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const JokeButton = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchJoke = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single,twopart');
            const data = await response.json();

            if (data.type === 'single') {
                setJoke({ text: data.joke, type: 'single' });
            } else {
                setJoke({ setup: data.setup, delivery: data.delivery, type: 'twopart' });
            }
        } catch (error) {
            setJoke({
                text: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
                type: 'single'
            });
        }
        setLoading(false);
    };

    const handleButtonClick = () => {
        vibrateLight();
        setShowPopup(true);
        if (!joke) {
            fetchJoke();
        }
    };

    const handleClose = () => {
        vibrateLight();
        setShowPopup(false);
    };

    const handleGetAnother = () => {
        vibrateLight();
        fetchJoke();
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className="joke-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />
                )}
            </AnimatePresence>

            {/* Speech Bubble - Only show when closed */}
            <AnimatePresence>
                {!showPopup && (
                    <motion.div
                        className="joke-speech-bubble"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: [1, 1.05, 1]
                        }}
                        exit={{ opacity: 0, y: 5, transition: { duration: 0.2 } }}
                        transition={{
                            opacity: { duration: 0.5, delay: 0.5 },
                            y: { duration: 0.5, delay: 0.5 },
                            scale: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1
                            }
                        }}
                    >
                        <span className="bubble-text">Take a quick break?</span>
                        <div className="bubble-arrow"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Morphing Button/Popup */}
            <AnimatePresence>
                {!showPopup ? (
                    <motion.div
                        key="button"
                        layoutId="joke-container"
                        className="joke-morphing-button"
                        onClick={handleButtonClick}
                        initial={{ borderRadius: "20px" }}
                        animate={{ borderRadius: "20px" }}
                        exit={{ borderRadius: "24px" }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            mass: 0.2
                        }}
                    >
                        <motion.div
                            className="joke-button-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.span
                                className="robot-emoji"
                                layoutId="robot-icon"
                                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.2 }}
                            >
                                <RobotIcon />
                            </motion.span>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="popup"
                        layoutId="joke-container"
                        className="joke-morphing-popup"
                        initial={{ borderRadius: "24px" }}
                        animate={{ borderRadius: "24px" }}
                        exit={{ borderRadius: "20px" }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            mass: 0.2
                        }}
                    >
                        <motion.div
                            className="joke-popup-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.1 } }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                        >
                            <button className="joke-close" onClick={handleClose} aria-label="Close">
                                ✕
                            </button>

                            <div className="joke-header">
                                <span className="joke-icon">
                                    <motion.span
                                        layoutId="robot-icon"
                                        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.2 }}
                                    >
                                        <RobotIcon />
                                    </motion.span>
                                </span>
                                <motion.h3
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Developer Pause
                                </motion.h3>
                            </div>

                            <div className="joke-content">
                                {loading ? (
                                    <div className="joke-loading">
                                        <div className="spinner"></div>
                                        <p>Fetching a fresh joke...</p>
                                    </div>
                                ) : joke ? (
                                    <div className="joke-text-container">
                                        {joke.type === 'single' ? (
                                            <p className="joke-single">{joke.text}</p>
                                        ) : (
                                            <>
                                                <p className="joke-setup">{joke.setup}</p>
                                                <p className="joke-delivery">{joke.delivery}</p>
                                            </>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            <div className="joke-actions">
                                <button
                                    className="joke-btn joke-btn-primary"
                                    onClick={handleGetAnother}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : '🎲 Another One!'}
                                </button>
                                <button
                                    className="joke-btn joke-btn-secondary"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default JokeButton;
