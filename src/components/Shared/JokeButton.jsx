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
            {/* Interactive Robot with Speech Bubble */}
            <div className="joke-robot-container">
                {/* Speech Bubble */}
                <motion.div
                    className="joke-speech-bubble"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: [1, 1.05, 1]
                    }}
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

                {/* Robot Button */}
                <motion.button
                    className="joke-robot-button"
                    onClick={handleButtonClick}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                        scale: 1,
                        rotate: 0,
                    }}
                    whileHover={{
                        scale: 1.1,
                        rotate: [0, -10, 10, -10, 0],
                        transition: { rotate: { duration: 0.5 } }
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    aria-label="Get a dev joke from the robot"
                >
                    <span className="robot-emoji">🤖</span>
                </motion.button>
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {showPopup && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="joke-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                        />

                        {/* Popup Content */}
                        <motion.div
                            className="joke-popup"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default JokeButton;
