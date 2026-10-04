import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin scroll-progress bar for the IDE and hacker views (loaded lazily, so the Modern view
 * never downloads Framer Motion for it).
 */
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--modern-accent-primary, #38bdf8), var(--modern-accent-secondary, #818cf8))',
                transformOrigin: '0%',
                scaleX,
                zIndex: 10000,
            }}
        />
    );
};

export default ScrollProgress;
