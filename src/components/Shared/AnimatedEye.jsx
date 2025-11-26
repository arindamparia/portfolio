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

    const updatePupilPosition = React.useCallback(() => {
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
    }, [inputRef]);

    useEffect(() => {
        // We want to track pupil even if closed, so it's ready when opened? 
        // Or just reset when closed. 
        // The user wants smooth transition, so keeping it tracking might be cool, 
        // but usually eyes don't track when closed.
        // Let's keep the listener active but maybe dampen it?
        // For now, existing logic is fine.

        if (!inputRef?.current) return;

        const inputElement = inputRef.current;

        // Update pupil position on various events
        const handleUpdate = () => {
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
    }, [inputRef, updatePupilPosition]); // Removed isOpen dependency to allow tracking while closing/opening

    // Eyelid Animation Variants
    // We animate the 'd' attribute (path definition) to smoothly morph between open and closed shapes.
    // Open: Arched curve (Q 50 5)
    // Closed: Flat/Slightly curved down (Q 50 50)
    const upperEyelidVariants = {
        open: { d: "M 0 0 L 100 0 L 100 50 L 95 50 Q 50 5 5 50 L 0 50 Z" },
        closed: { d: "M 0 0 L 100 0 L 100 50 L 95 50 Q 50 50 5 50 L 0 50 Z" }
    };

    const lowerEyelidVariants = {
        open: { d: "M 0 100 L 100 100 L 100 50 L 95 50 Q 50 95 5 50 L 0 50 Z" },
        closed: { d: "M 0 100 L 100 100 L 100 50 L 95 50 Q 50 50 5 50 L 0 50 Z" }
    };

    const lashesVariants = {
        open: { y: 0, opacity: 1, scaleY: 1 },
        closed: { y: 15, opacity: 0, scaleY: 0.5 } // Fade out open lashes as they move down
    };

    const closedLashesVariants = {
        open: { opacity: 0, scaleY: 0.5 },
        closed: { opacity: 1, scaleY: 1 }
    };

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
                pointerEvents: 'none',
                backgroundColor: 'transparent', // Ensure no background
                border: 'none', // Ensure no border
                outline: 'none' // Ensure no outline
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                style={{ overflow: 'visible', backgroundColor: 'transparent' }} // Allow lashes to stick out if needed
            >
                <defs>
                    {/* Iris gradient */}
                    <radialGradient id="irisGradient">
                        <stop offset="0%" stopColor="#64b5f6" />
                        <stop offset="50%" stopColor="#2196f3" />
                        <stop offset="100%" stopColor="#1565c0" />
                    </radialGradient>

                    {/* Pupil gradient */}
                    <radialGradient id="pupilGradient">
                        <stop offset="0%" stopColor="#0d0d0d" />
                        <stop offset="100%" stopColor="#000000" />
                    </radialGradient>

                    {/* Eyelid gradient - Updated to match page background (white) */}
                    <linearGradient id="eyelidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f8f9fa" /> {/* Subtle shift to secondary bg color */}
                    </linearGradient>

                    {/* Eye Shadow Filter */}
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

                    {/* Clip Path for Pupil - Matches the Eye White shape */}
                    <clipPath id="eyeClip">
                        <ellipse cx="50" cy="50" rx="45" ry="38" />
                    </clipPath>
                </defs>

                {/* --- EYE BALL LAYER --- */}

                {/* Eye white background - Eye pleasing white */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="45"
                    ry="38"
                    fill="#F8F5FA"
                    stroke="#d0d0d0"
                    strokeWidth="1.5"
                    filter="url(#eyeShadow)"
                />

                {/* Veins */}
                <path d="M 20 45 Q 35 42, 50 45" stroke="#ffcccc" strokeWidth="0.5" fill="none" opacity="0.3" />
                <path d="M 50 45 Q 65 42, 80 45" stroke="#ffcccc" strokeWidth="0.5" fill="none" opacity="0.3" />

                {/* 
                    Iris and Pupil Group
                    Wrapped in a clipPath to ensure the pupil/iris never bleeds outside the eye white
                    when looking at extreme angles.
                */}
                <g clipPath="url(#eyeClip)">
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
                        {/* Iris */}
                        <circle cx="50" cy="50" r="20" fill="url(#irisGradient)" opacity="0.95" />

                        {/* Iris texture */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const x1 = 50 + Math.cos(angle) * 12;
                            const y1 = 50 + Math.sin(angle) * 12;
                            const x2 = 50 + Math.cos(angle) * 20;
                            const y2 = 50 + Math.sin(angle) * 20;
                            return (
                                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1565c0" strokeWidth="0.5" opacity="0.4" />
                            );
                        })}

                        {/* Pupil */}
                        <circle cx="50" cy="50" r="11" fill="url(#pupilGradient)" />

                        {/* Reflections */}
                        <circle cx="44" cy="44" r="4.5" fill="white" opacity="0.9" />
                        <circle cx="56" cy="48" r="2" fill="white" opacity="0.5" />
                    </motion.g>
                </g>

                {/* --- EYELID LAYER --- */}

                {/* Upper Eyelid Skin */}
                <motion.path
                    variants={upperEyelidVariants}
                    initial={isOpen ? "open" : "closed"}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    fill="url(#eyelidGradient)"
                />

                {/* Lower Eyelid Skin */}
                <motion.path
                    variants={lowerEyelidVariants}
                    initial={isOpen ? "open" : "closed"}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    fill="url(#eyelidGradient)"
                />

                {/* Eyelid Crease (Only visible when open/semi-open) */}
                <motion.path
                    d="M 15 40 Q 50 20, 85 40"
                    initial={{
                        d: isOpen ? "M 15 35 Q 50 15, 85 35" : "M 15 48 Q 50 28, 85 48",
                        opacity: isOpen ? 0.3 : 0.6
                    }}
                    animate={{
                        d: isOpen ? "M 15 35 Q 50 15, 85 35" : "M 15 48 Q 50 28, 85 48",
                        opacity: isOpen ? 0.3 : 0.6
                    }}
                    transition={{ duration: 0.3 }}
                    fill="none"
                    stroke="#a0a0a0"
                    strokeWidth="1"
                    strokeLinecap="round"
                />

                {/* 
                    Upper Lashes Generation
                    
                    We use Quadratic Bezier Curve mathematics to ensure lashes are attached exactly to the eyelid curve.
                    The eyelid curve is defined as: M 5 50 Q 50 8, 95 50
                    This corresponds to control points:
                    P0 = (5, 50)  -> Start point
                    P1 = (50, 8)  -> Control point (defines the peak of the arch)
                    P2 = (95, 50) -> End point
                */}
                <motion.g
                    variants={lashesVariants}
                    initial={isOpen ? "open" : "closed"}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                >
                    {/* Iterate t from 0.1 to 0.9 to distribute lashes along the curve (avoiding extreme corners) */}
                    {[0.1, 0.18, 0.26, 0.34, 0.42, 0.5, 0.58, 0.66, 0.74, 0.82, 0.9].map((t, index) => {
                        // Quadratic Bezier Formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
                        const p0 = { x: 5, y: 50 };
                        const p1 = { x: 50, y: 8 };
                        const p2 = { x: 95, y: 50 };

                        const oneMinusT = 1 - t;

                        // Calculate exact (x, y) position on the curve for this t value
                        const x = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
                        const y = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y;

                        // Calculate the derivative (tangent) to find the normal angle
                        // B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
                        const dx = 2 * oneMinusT * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
                        const dy = 2 * oneMinusT * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);

                        // The normal vector is perpendicular to the tangent.
                        // atan2(dy, dx) gives the tangent angle.
                        // Subtracting PI/2 (90 degrees) rotates it to point outwards/upwards.
                        const angle = Math.atan2(dy, dx) - Math.PI / 2;

                        // Make central lashes slightly longer for a natural look
                        const lashLength = (index >= 4 && index <= 6) ? 12 : 9;

                        return (
                            <line
                                key={`upper-${index}`}
                                x1={x}
                                y1={y}
                                x2={x + Math.cos(angle) * lashLength}
                                y2={y + Math.sin(angle) * lashLength}
                                stroke="#1565c0" // Blue lashes when open
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                opacity="0.9"
                            />
                        );
                    })}
                </motion.g>

                {/* Closed Lashes (Fade in when closed) */}
                <motion.g
                    variants={closedLashesVariants}
                    initial={isOpen ? "open" : "closed"}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                >
                    {[15, 22, 30, 38, 45, 50, 55, 62, 70, 78, 85].map((x, index) => {
                        const y = 50 - Math.pow((x - 50) / 40, 2) * 2;
                        const lashLength = index === 5 ? 9 : 7;
                        const curve = (x - 50) * 0.15;
                        return (
                            <line
                                key={`closed-lash-${index}`}
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
                </motion.g>

                {/* Eyelid Line (The meeting point) */}
                <motion.path
                    initial={{
                        d: isOpen ? "M 5 50 Q 50 8, 95 50" : "M 10 50 Q 50 52, 90 50",
                        strokeWidth: isOpen ? 2.5 : 2.5
                    }}
                    animate={{
                        d: isOpen ? "M 5 50 Q 50 8, 95 50" : "M 10 50 Q 50 52, 90 50",
                        strokeWidth: isOpen ? 2.5 : 2.5
                    }}
                    transition={{ duration: 0.3 }}
                    fill="none"
                    stroke="#333333" // Dark grey for definition
                    strokeLinecap="round"
                />
                {/* Lower Eyelid Line */}
                <motion.path
                    initial={{
                        d: isOpen ? "M 5 50 Q 50 88, 95 50" : "M 10 50 Q 50 52, 90 50"
                    }}
                    animate={{
                        d: isOpen ? "M 5 50 Q 50 88, 95 50" : "M 10 50 Q 50 52, 90 50",
                    }}
                    transition={{ duration: 0.3 }}
                    fill="none"
                    stroke="#333333"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />

            </svg>
        </div>
    );
};

export default AnimatedEye;
