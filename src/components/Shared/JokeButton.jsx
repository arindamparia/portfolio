import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { vibrateLight } from '../../utils/vibration';
import { jokesData } from '../../data/jokes';

/**
 * Developer Pause: a floating robot that opens a programming joke.
 *
 * Motion (see .claude/skills/review-animations/STANDARDS.md):
 * - The launcher never unmounts, so opening never changes the page layout (on phones it sits in
 *   the page flow, and removing it used to make the page jump)
 * - The dialog grows out of the launcher: its transform-origin is measured from the launcher's
 *   position on every open
 * - CSS transitions, so a tap mid-animation reverses smoothly instead of restarting
 * - Asymmetric timing: opening 260ms with a strong ease-out, closing a quicker 160ms
 * - Only transform and opacity animate; reduced motion keeps just the fades
 */

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
    const [origin, setOrigin] = useState('50% 100%');
    const nextJoke = useRef(createJokeBag()).current;
    const launcherRef = useRef(null);
    const dialogRef = useRef(null);
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

    // Grow out of the launcher: point the dialog's transform-origin at the launcher's centre
    // The dialog is centred in the viewport, so its untransformed box comes from its size
    // (getBoundingClientRect would include the current scale and skew the origin)
    const measureOrigin = () => {
        const launcher = launcherRef.current?.getBoundingClientRect();
        const dialog = dialogRef.current;
        if (!launcher || !dialog) return;
        const left = (document.documentElement.clientWidth - dialog.offsetWidth) / 2;
        const top = (window.innerHeight - dialog.offsetHeight) / 2;
        const x = launcher.left + launcher.width / 2 - left;
        const y = launcher.top + launcher.height / 2 - top;
        setOrigin(`${Math.round(x)}px ${Math.round(y)}px`);
    };

    const open = () => {
        vibrateLight();
        setShowBubble(false);
        setJokeIndex(nextJoke());
        measureOrigin();
        setIsOpen(true);
    };

    const close = useCallback(() => {
        vibrateLight();
        setIsOpen(false);
        launcherRef.current?.focus({ preventScroll: true });
    }, []);

    const another = () => {
        vibrateLight();
        setJokeIndex(nextJoke());
    };

    // Keep the origin right if the page scrolls or resizes while the dialog is closing
    useLayoutEffect(() => {
        if (!isOpen) measureOrigin();
    }, [isOpen]);

    // Escape closes; focus the primary action when the dialog opens
    useEffect(() => {
        if (!isOpen) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKeyDown);
        const focusTimer = setTimeout(() => primaryRef.current?.focus({ preventScroll: true }), 120);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            clearTimeout(focusTimer);
        };
    }, [isOpen, close]);

    const joke = jokeIndex === null ? null : jokesData[jokeIndex];

    return (
        <>
            <div className={`joke-backdrop ${isOpen ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />

            <div className={`joke-speech-bubble ${showBubble && !isOpen ? 'is-visible' : ''}`} aria-hidden="true">
                <span className="bubble-text">Take a quick break?</span>
                <div className="bubble-arrow"></div>
            </div>

            <button
                ref={launcherRef}
                type="button"
                className="joke-morphing-button"
                onClick={isOpen ? close : open}
                aria-label="Developer pause: show a programming joke"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span className="robot-emoji">
                    <RobotIcon />
                </span>
            </button>

            <div
                ref={dialogRef}
                className={`joke-morphing-popup ${isOpen ? 'is-open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="joke-title"
                aria-hidden={!isOpen}
                inert={!isOpen}
                style={{ transformOrigin: origin }}
            >
                <div className="joke-popup-content">
                    <button type="button" className="joke-close" onClick={close} aria-label="Close dialog">
                        ✕
                    </button>

                    <div className="joke-header">
                        <span className="joke-icon">
                            <RobotIcon />
                        </span>
                        <h3 id="joke-title">Developer Pause</h3>
                    </div>

                    <div className="joke-content" aria-live="polite">
                        {joke && (
                            <div key={jokeIndex} className="joke-text-container">
                                {joke.text ? (
                                    <p className="joke-single">{joke.text}</p>
                                ) : (
                                    <>
                                        <p className="joke-setup">{joke.setup}</p>
                                        {/* Comic timing: the punchline lands a beat later */}
                                        <p className="joke-delivery">{joke.delivery}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="joke-actions">
                        <button ref={primaryRef} type="button" className="joke-btn joke-btn-primary" onClick={another}>
                            🎲 Another One!
                        </button>
                        <button type="button" className="joke-btn joke-btn-secondary" onClick={close}>
                            Back to work
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JokeButton;
