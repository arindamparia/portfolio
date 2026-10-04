import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { vibrateLight } from '../../utils/vibration';
import { jokesData } from '../../data/jokes';

// One spring for the button <-> dialog morph so both directions feel the same
const MORPH = { type: 'spring', stiffness: 380, damping: 34, mass: 0.6 };
const BUBBLE_SEEN_KEY = 'developerPauseBubbleSeen';

// Simple Elegant Robot Icon (eyes blink via CSS)
const RobotIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="4" y="5" width="16" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <g className="robot-eyes">
            <path d="M8 10V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 10V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <path d="M9 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 10H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 10H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Shuffle-bag so jokes don't repeat until every one has been shown
const createJokeBag = () => {
    let bag = [];
    return () => {
        if (bag.length === 0) {
            bag = jokesData.map((_, i) => i).sort(() => Math.random() - 0.5);
        }
        return bag.pop();
    };
};

const readBubbleSeen = () => {
    try {
        return sessionStorage.getItem(BUBBLE_SEEN_KEY) === '1';
    } catch {
        return false;
    }
};

const JokeButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [jokeIndex, setJokeIndex] = useState(null);
    const [showBubble, setShowBubble] = useState(false);
    const nextJoke = useRef(createJokeBag()).current;
    const launcherRef = useRef(null);
    const primaryRef = useRef(null);

    // Show the speech bubble once per session, after the visitor has scrolled past the hero
    useEffect(() => {
        if (readBubbleSeen()) return undefined;

        let hideTimer;
        const reveal = () => {
            if (window.scrollY < window.innerHeight * 0.6) return;
            window.removeEventListener('scroll', reveal);
            setShowBubble(true);
            try {
                sessionStorage.setItem(BUBBLE_SEEN_KEY, '1');
            } catch {
                // Storage unavailable; the bubble just shows again next visit
            }
            hideTimer = setTimeout(() => setShowBubble(false), 6000);
        };

        window.addEventListener('scroll', reveal, { passive: true });
        return () => {
            window.removeEventListener('scroll', reveal);
            clearTimeout(hideTimer);
        };
    }, []);

    const open = () => {
        vibrateLight();
        setShowBubble(false);
        setJokeIndex(nextJoke());
        setIsOpen(true);
    };

    const close = useCallback(() => {
        vibrateLight();
        setIsOpen(false);
        // Return focus to the launcher once it has morphed back
        requestAnimationFrame(() => launcherRef.current?.focus());
    }, []);

    const another = () => {
        vibrateLight();
        setJokeIndex(nextJoke());
    };

    // Escape closes; focus the primary action when the dialog opens
    useEffect(() => {
        if (!isOpen) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKeyDown);
        const focusTimer = setTimeout(() => primaryRef.current?.focus(), 250);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            clearTimeout(focusTimer);
        };
    }, [isOpen, close]);

    const joke = jokeIndex === null ? null : jokesData[jokeIndex];

    return (
        <MotionConfig reducedMotion="user">
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="joke-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={close}
                    />
                )}
            </AnimatePresence>

            {/* Speech bubble */}
            <AnimatePresence>
                {showBubble && !isOpen && (
                    <motion.div
                        className="joke-speech-bubble"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        aria-hidden="true"
                    >
                        <span className="bubble-text">Take a quick break?</span>
                        <div className="bubble-arrow"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Morphing launcher / dialog: the same layoutId, so one box grows into the other */}
            <AnimatePresence initial={false}>
                {!isOpen ? (
                    <motion.button
                        key="launcher"
                        ref={launcherRef}
                        type="button"
                        layoutId="joke-shell"
                        className="joke-morphing-button"
                        onClick={open}
                        aria-label="Developer pause: show a programming joke"
                        style={{ borderRadius: 20 }}
                        transition={MORPH}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                    >
                        <motion.span layoutId="joke-robot" className="robot-emoji" transition={MORPH}>
                            <RobotIcon />
                        </motion.span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="dialog"
                        layoutId="joke-shell"
                        className="joke-morphing-popup"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="joke-title"
                        style={{ borderRadius: 24 }}
                        transition={MORPH}
                    >
                        <motion.div
                            className="joke-popup-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.2 } }}
                            exit={{ opacity: 0, transition: { duration: 0.08 } }}
                        >
                            <button type="button" className="joke-close" onClick={close} aria-label="Close dialog">
                                ✕
                            </button>

                            <div className="joke-header">
                                <motion.span layoutId="joke-robot" className="joke-icon" transition={MORPH}>
                                    <RobotIcon />
                                </motion.span>
                                <h3 id="joke-title">Developer Pause</h3>
                            </div>

                            <div className="joke-content" aria-live="polite">
                                <AnimatePresence mode="wait" initial={false}>
                                    {joke && (
                                        <motion.div
                                            key={jokeIndex}
                                            className="joke-text-container"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {joke.text ? (
                                                <p className="joke-single">{joke.text}</p>
                                            ) : (
                                                <>
                                                    <p className="joke-setup">{joke.setup}</p>
                                                    {/* Comic timing: the punchline lands a beat later */}
                                                    <motion.p
                                                        className="joke-delivery"
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.7, duration: 0.3 }}
                                                    >
                                                        {joke.delivery}
                                                    </motion.p>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="joke-actions">
                                <button ref={primaryRef} type="button" className="joke-btn joke-btn-primary" onClick={another}>
                                    🎲 Another One!
                                </button>
                                <button type="button" className="joke-btn joke-btn-secondary" onClick={close}>
                                    Back to work
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MotionConfig>
    );
};

export default JokeButton;
