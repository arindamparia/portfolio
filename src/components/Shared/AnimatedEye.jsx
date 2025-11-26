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

        // Calculate angle and limit distance for pupil movement
        const angle = Math.atan2(deltaY, deltaX);
        const maxDistance = 8; // Maximum pixels the pupil can move from center
        const distance = Math.min(maxDistance, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 10);

        // Calculate new pupil position
        const newX = Math.cos(angle) * distance;
        const newY = Math.sin(angle) * distance;

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
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}
                    >
                        {/* White of the eye */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                            style={{ position: 'absolute' }}
                        >
                            {/* Eye background */}
                            <ellipse
                                cx="50"
                                cy="50"
                                rx="45"
                                ry="40"
                                fill="white"
                                stroke="#333"
                                strokeWidth="2"
                            />

                            {/* Iris */}
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
                                {/* Iris circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="18"
                                    fill="#4a90e2"
                                />

                                {/* Pupil */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="10"
                                    fill="#1a1a1a"
                                />

                                {/* Light reflection */}
                                <circle
                                    cx="45"
                                    cy="45"
                                    r="4"
                                    fill="white"
                                    opacity="0.8"
                                />
                            </motion.g>

                            {/* Top eyelid */}
                            <motion.path
                                d="M 5 50 Q 50 10, 95 50"
                                fill="none"
                                stroke="#333"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            {/* Bottom eyelid */}
                            <motion.path
                                d="M 5 50 Q 50 90, 95 50"
                                fill="none"
                                stroke="#333"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </motion.div>
                ) : (
                    <motion.div
                        key="closed-eye"
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Closed eye */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                        >
                            {/* Closed eyelid - curved line */}
                            <motion.path
                                d="M 10 50 Q 50 70, 90 50"
                                fill="none"
                                stroke="#333"
                                strokeWidth="3"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Eyelashes */}
                            {[20, 35, 50, 65, 80].map((x, index) => (
                                <motion.line
                                    key={index}
                                    x1={x}
                                    y1={50 + (x - 50) * 0.4}
                                    x2={x}
                                    y2={50 + (x - 50) * 0.4 + 8}
                                    stroke="#333"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                />
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedEye;
