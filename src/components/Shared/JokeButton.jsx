import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vibrateLight } from '../../utils/vibration';

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
            {!showPopup && (
                <motion.div
                    className="joke-speech-bubble"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: [1, 1.05, 1]
                    }}
                    exit={{ opacity: 0 }}
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
                    <span className="bubble-text">Tap me for a dev joke!</span>
                    <div className="bubble-arrow"></div>
                </motion.div>
            )}

            {/* Morphing Button/Popup - Single Element */}
            <motion.div
                layout
                className={showPopup ? "joke-morphing-popup" : "joke-morphing-button"}
                onClick={!showPopup ? handleButtonClick : undefined}
                initial={false}
                animate={{
                    borderRadius: showPopup ? "20px" : "50%",
                }}
                transition={{
                    layout: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                    },
                    borderRadius: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                    }
                }}
            >
                <AnimatePresence mode="wait">
                    {!showPopup ? (
                        // Button State
                        <motion.div
                            key="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="joke-button-content"
                        >
                            <span className="robot-emoji">🤖</span>
                        </motion.div>
                    ) : (
                        // Popup State
                        <motion.div
                            key="popup"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="joke-popup-content"
                        >
                            <button className="joke-close" onClick={handleClose} aria-label="Close">
                                ✕
                            </button>

                            <div className="joke-header">
                                <span className="joke-icon">😂</span>
                                <h3>Developer Humor</h3>
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
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default JokeButton;
