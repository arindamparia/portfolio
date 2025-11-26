import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AnimatedEye Component
 *
 * An interactive eye component that:
 * - Closes when the associated input is empty
 * - Opens when the input has content
 * - Tracks the cursor position within the input field
 *
 * @param {boolean} isOpen - Whether the eye should be open (has content) or closed (empty)
 * @param {Object} inputRef - Reference to the input element to track cursor position
 * @param {string} size - Size of the eye (default: '2rem')
 */
const AnimatedEye = ({ isOpen, inputRef, size = '2rem' }) => {
    const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
    const eyeRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !inputRef?.current) return;

        const handleMouseMove = (e) => {
            if (!eyeRef.current || !inputRef.current) return;

            // Get the bounding rectangles
            const eyeRect = eyeRef.current.getBoundingClientRect();
            const inputRect = inputRef.current.getBoundingClientRect();

            // Check if mouse is over the input field
            const isOverInput = e.clientX >= inputRect.left &&
                              e.clientX <= inputRect.right &&
                              e.clientY >= inputRect.top &&
                              e.clientY <= inputRect.bottom;

            if (!isOverInput) {
                // Reset pupil to center when not over input
                setPupilPosition({ x: 0, y: 0 });
                return;
            }

            // Calculate the center of the eye
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;

            // Get mouse position relative to eye center
            let deltaX = e.clientX - eyeCenterX;
            let deltaY = e.clientY - eyeCenterY;

            // Calculate angle and limit distance for pupil movement
            const angle = Math.atan2(deltaY, deltaX);
            const maxDistance = 8; // Maximum pixels the pupil can move from center
            const distance = Math.min(maxDistance, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 10);

            // Calculate new pupil position
            const newX = Math.cos(angle) * distance;
            const newY = Math.sin(angle) * distance;

            setPupilPosition({ x: newX, y: newY });
        };

        const handleFocus = () => {
            // Reset pupil to center on focus
            setPupilPosition({ x: 0, y: 0 });
        };

        const inputElement = inputRef.current;

        // Add event listeners to window for reliable mouse tracking
        window.addEventListener('mousemove', handleMouseMove);
        inputElement.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            inputElement.removeEventListener('focus', handleFocus);
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
