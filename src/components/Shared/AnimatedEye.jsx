import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AnimatedEye Component
 *
 * An interactive eye component that:
 * - Closes when the associated input is empty
 * - Opens when the input has content
 * - Tracks the text cursor (caret) position within the input field
 *
 * @param {boolean} isOpen - Whether the eye should be open (has content) or closed (empty)
 * @param {Object} inputRef - Reference to the input element to track text cursor position
 * @param {string} size - Size of the eye (default: '2rem')
 */
const AnimatedEye = ({ isOpen, inputRef, size = '2rem' }) => {
    const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
    const eyeRef = useRef(null);

    /**
     * Calculate the pixel position of the text cursor within an input/textarea
     */
    const getCaretCoordinates = (element) => {
        const { selectionStart, value, tagName } = element;

        if (selectionStart === null || selectionStart === undefined) {
            return null;
        }

        // Create a mirror div to measure text
        const mirror = document.createElement('div');
        const computed = window.getComputedStyle(element);

        // Copy relevant styles
        mirror.style.position = 'absolute';
        mirror.style.visibility = 'hidden';
        mirror.style.whiteSpace = tagName === 'TEXTAREA' ? 'pre-wrap' : 'pre';
        mirror.style.wordWrap = 'break-word';
        mirror.style.font = computed.font;
        mirror.style.fontSize = computed.fontSize;
        mirror.style.fontFamily = computed.fontFamily;
        mirror.style.fontWeight = computed.fontWeight;
        mirror.style.letterSpacing = computed.letterSpacing;
        mirror.style.padding = computed.padding;
        mirror.style.border = computed.border;
        mirror.style.boxSizing = computed.boxSizing;
        mirror.style.width = computed.width;

        // Get text up to cursor
        const textBeforeCursor = value.substring(0, selectionStart);
        mirror.textContent = textBeforeCursor;

        // Add a span to measure the exact cursor position
        const span = document.createElement('span');
        span.textContent = '|';
        mirror.appendChild(span);

        document.body.appendChild(mirror);

        const spanRect = span.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();

        const x = spanRect.left - mirrorRect.left;
        const y = spanRect.top - mirrorRect.top + (spanRect.height / 2);

        document.body.removeChild(mirror);

        return { x, y };
    };

    const updatePupilPosition = () => {
        if (!eyeRef.current || !inputRef.current) return;

        const caretPos = getCaretCoordinates(inputRef.current);
        if (!caretPos) {
            setPupilPosition({ x: 0, y: 0 });
            return;
        }

        // Get the bounding rectangles
        const eyeRect = eyeRef.current.getBoundingClientRect();
        const inputRect = inputRef.current.getBoundingClientRect();

        // Calculate the absolute position of the caret
        const caretX = inputRect.left + caretPos.x;
        const caretY = inputRect.top + caretPos.y;

        // Calculate the center of the eye
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        // Get caret position relative to eye center
        let deltaX = caretX - eyeCenterX;
        let deltaY = caretY - eyeCenterY;

        // Calculate angle for direction
        const angle = Math.atan2(deltaY, deltaX);

        // Calculate distance but constrain pupil to stay within eye boundaries
        // Eye dimensions: rx=45, ry=38; Iris radius=20
        // Maximum movement to keep iris within eye white
        const maxMoveX = 25; // 45 - 20 = 25
        const maxMoveY = 18; // 38 - 20 = 18

        // Calculate desired position
        const rawDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 8;
        let newX = Math.cos(angle) * rawDistance;
        let newY = Math.sin(angle) * rawDistance;

        // Constrain to elliptical boundary
        const scale = Math.sqrt((newX * newX) / (maxMoveX * maxMoveX) + (newY * newY) / (maxMoveY * maxMoveY));
        if (scale > 1) {
            newX /= scale;
            newY /= scale;
        }

        setPupilPosition({ x: newX, y: newY });
    };

    useEffect(() => {
        if (!isOpen || !inputRef?.current) {
            setPupilPosition({ x: 0, y: 0 });
            return;
        }

        const inputElement = inputRef.current;

        // Update pupil position on various events
        const handleUpdate = () => {
            // Small delay to ensure DOM has updated
            requestAnimationFrame(updatePupilPosition);
        };

        // Listen for input changes, cursor movement, and focus
        inputElement.addEventListener('input', handleUpdate);
        inputElement.addEventListener('click', handleUpdate);
        inputElement.addEventListener('keyup', handleUpdate);
        inputElement.addEventListener('focus', handleUpdate);
        inputElement.addEventListener('select', handleUpdate);

        // Initial update
        handleUpdate();

        return () => {
            inputElement.removeEventListener('input', handleUpdate);
            inputElement.removeEventListener('click', handleUpdate);
            inputElement.removeEventListener('keyup', handleUpdate);
            inputElement.removeEventListener('focus', handleUpdate);
            inputElement.removeEventListener('select', handleUpdate);
        };
    }, [isOpen, inputRef]);

    return (
        <div
            ref={eyeRef}
            style={{
                width: size,
                height: size,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                userSelect: 'none',
                pointerEvents: 'none'
            }}
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="open-eye"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transformOrigin: 'center'
                        }}
                    >
                        {/* Eye SVG */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                            style={{ position: 'absolute' }}
                        >
                            <defs>
                                {/* Iris gradient for realistic depth */}
                                <radialGradient id="irisGradient">
                                    <stop offset="0%" stopColor="#64b5f6" />
                                    <stop offset="50%" stopColor="#2196f3" />
                                    <stop offset="100%" stopColor="#1565c0" />
                                </radialGradient>

                                {/* Pupil gradient for depth */}
                                <radialGradient id="pupilGradient">
                                    <stop offset="0%" stopColor="#0d0d0d" />
                                    <stop offset="100%" stopColor="#000000" />
                                </radialGradient>

                                {/* Eye shadow */}
                                <filter id="eyeShadow">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                                    <feOffset dx="0" dy="1" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Eye white background with subtle shadow */}
                            <ellipse
                                cx="50"
                                cy="50"
                                rx="45"
                                ry="38"
                                fill="#ffffff"
                                stroke="#d0d0d0"
                                strokeWidth="1.5"
                                filter="url(#eyeShadow)"
                            />

                            {/* Subtle eye veins for realism */}
                            <path
                                d="M 20 45 Q 35 42, 50 45"
                                stroke="#ffcccc"
                                strokeWidth="0.5"
                                fill="none"
                                opacity="0.3"
                            />
                            <path
                                d="M 50 45 Q 65 42, 80 45"
                                stroke="#ffcccc"
                                strokeWidth="0.5"
                                fill="none"
                                opacity="0.3"
                            />

                            {/* Iris and Pupil Group - moves together */}
                            <motion.g
                                animate={{
                                    x: pupilPosition.x,
                                    y: pupilPosition.y
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20
                                }}
                            >
                                {/* Iris outer ring */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="20"
                                    fill="url(#irisGradient)"
                                    opacity="0.95"
                                />

                                {/* Iris texture lines for detail */}
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i * 30 * Math.PI) / 180;
                                    const x1 = 50 + Math.cos(angle) * 12;
                                    const y1 = 50 + Math.sin(angle) * 12;
                                    const x2 = 50 + Math.cos(angle) * 20;
                                    const y2 = 50 + Math.sin(angle) * 20;
                                    return (
                                        <line
                                            key={i}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="#1565c0"
                                            strokeWidth="0.5"
                                            opacity="0.4"
                                        />
                                    );
                                })}

                                {/* Pupil with gradient */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="11"
                                    fill="url(#pupilGradient)"
                                />

                                {/* Main light reflection - top left */}
                                <circle
                                    cx="44"
                                    cy="44"
                                    r="4.5"
                                    fill="white"
                                    opacity="0.9"
                                />

                                {/* Secondary smaller reflection */}
                                <circle
                                    cx="56"
                                    cy="48"
                                    r="2"
                                    fill="white"
                                    opacity="0.5"
                                />
                            </motion.g>

                            {/* Upper eyelid - more realistic curve */}
                            <path
                                d="M 5 50 Q 50 8, 95 50"
                                fill="none"
                                stroke="#8b7355"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />

                            {/* Lower eyelid - gentler curve */}
                            <path
                                d="M 5 50 Q 50 88, 95 50"
                                fill="none"
                                stroke="#8b7355"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />

                            {/* Upper eyelashes */}
                            {[15, 25, 35, 45, 50, 55, 65, 75, 85].map((x, index) => {
                                const y = 50 - Math.pow((x - 50) / 45, 2) * 42;
                                const lashLength = index === 4 ? 8 : 6;
                                const angle = Math.atan2(50 - y, x - 50);
                                return (
                                    <line
                                        key={`upper-${index}`}
                                        x1={x}
                                        y1={y}
                                        x2={x + Math.sin(angle) * lashLength}
                                        y2={y - Math.cos(angle) * lashLength}
                                        stroke="#2c2c2c"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        opacity="0.8"
                                    />
                                );
                            })}
                        </svg>
                    </motion.div>
                ) : (
                    <motion.div
                        key="closed-eye"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transformOrigin: 'center'
                        }}
                    >
                        {/* Closed eye with realistic eyelids */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                        >
                            <defs>
                                {/* Gradient for eyelid depth */}
                                <linearGradient id="eyelidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#a0826d" />
                                    <stop offset="50%" stopColor="#8b7355" />
                                    <stop offset="100%" stopColor="#6d5d4f" />
                                </linearGradient>
                            </defs>

                            {/* Upper eyelid skin - filled curve */}
                            <path
                                d="M 10 50 Q 50 30, 90 50 Q 50 54, 10 50 Z"
                                fill="url(#eyelidGradient)"
                                stroke="#6d5d4f"
                                strokeWidth="1"
                            />

                            {/* Lower eyelid skin - subtle */}
                            <path
                                d="M 10 50 Q 50 54, 90 50 Q 50 58, 10 50 Z"
                                fill="#9b8270"
                                stroke="#7a6a5a"
                                strokeWidth="0.5"
                            />

                            {/* Eyelid crease line for realism */}
                            <path
                                d="M 15 48 Q 50 28, 85 48"
                                fill="none"
                                stroke="#6d5d4f"
                                strokeWidth="1"
                                opacity="0.6"
                                strokeLinecap="round"
                            />

                            {/* Main eyelid line (where eyelids meet) */}
                            <path
                                d="M 10 50 Q 50 52, 90 50"
                                fill="none"
                                stroke="#2c2c2c"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />

                            {/* Upper eyelashes - more prominent when closed */}
                            {[15, 22, 30, 38, 45, 50, 55, 62, 70, 78, 85].map((x, index) => {
                                const y = 50 - Math.pow((x - 50) / 40, 2) * 2;
                                const lashLength = index === 5 ? 9 : 7;
                                const curve = (x - 50) * 0.15;
                                return (
                                    <line
                                        key={`lash-${index}`}
                                        x1={x}
                                        y1={y}
                                        x2={x + curve}
                                        y2={y - lashLength}
                                        stroke="#2c2c2c"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        opacity="0.85"
                                    />
                                );
                            })}

                            {/* Subtle lower lashes */}
                            {[25, 40, 50, 60, 75].map((x, index) => {
                                const y = 50 + Math.pow((x - 50) / 40, 2) * 2;
                                return (
                                    <line
                                        key={`lower-lash-${index}`}
                                        x1={x}
                                        y1={y}
                                        x2={x}
                                        y2={y + 4}
                                        stroke="#2c2c2c"
                                        strokeWidth="0.8"
                                        strokeLinecap="round"
                                        opacity="0.5"
                                    />
                                );
                            })}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedEye;
