import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import UniverseParticlesBackground from './UniverseParticlesBackground';
import { GradientBackground, ParticlesBackground, WavesBackground, MeshBackground, AuroraBackground, GeometricBackground } from './Variants';
import './InteractiveBackground.css';

/**
 * Interactive Background Component
 * Creates eye-pleasing animated backgrounds that respond to mouse movement
 *
 * @param {string} variant - Background style variant (gradient, particles, waves, mesh, aurora, geometric)
 * @param {string} colorScheme - Color theme (purple, blue, green, orange, pink, teal)
 * @param {number} intensity - Animation intensity (0-1)
 */
const InteractiveBackground = ({
    variant = 'gradient',
    colorScheme = 'purple',
    intensity = 0.5
}) => {
    // Use MotionValues for high-performance updates without re-renders
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth out the mouse movement - increased damping for "floaty" feel
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 30 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 30 });

    const containerRef = useRef(null);

    useEffect(() => {
        const updateMousePosition = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // Update MotionValues directly
                mouseX.set(Math.max(0, Math.min(1, x)));
                mouseY.set(Math.max(0, Math.min(1, y)));
            }
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, [mouseX, mouseY]);

    // Color schemes
    const colors = {
        purple: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#a855f7',
            light: '#c084fc',
        },
        blue: {
            primary: '#4f46e5',
            secondary: '#06b6d4',
            accent: '#3b82f6',
            light: '#60a5fa',
        },
        green: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#34d399',
            light: '#6ee7b7',
        },
        orange: {
            primary: '#f59e0b',
            secondary: '#f97316',
            accent: '#fb923c',
            light: '#fdba74',
        },
        pink: {
            primary: '#ec4899',
            secondary: '#db2777',
            accent: '#f472b6',
            light: '#f9a8d4',
        },
        teal: {
            primary: '#14b8a6',
            secondary: '#0d9488',
            accent: '#2dd4bf',
            light: '#5eead4',
        }
    };

    const currentColors = colors[colorScheme] || colors.purple;

    // Render different variants
    const renderBackground = () => {
        switch (variant) {
            case 'universe':
                return <UniverseParticlesBackground mouseX={smoothMouseX} mouseY={smoothMouseY} colors={currentColors} intensity={intensity} />;
            case 'particles':
                return <ParticlesBackground mousePosition={{ x: smoothMouseX, y: smoothMouseY }} colors={currentColors} intensity={intensity} />;
            case 'waves':
                return <WavesBackground mousePosition={{ x: smoothMouseX, y: smoothMouseY }} colors={currentColors} intensity={intensity} />;
            case 'mesh':
                return <MeshBackground mousePosition={{ x: smoothMouseX, y: smoothMouseY }} colors={currentColors} intensity={intensity} />;
            case 'aurora':
                return <AuroraBackground mousePosition={{ x: smoothMouseX, y: smoothMouseY }} colors={currentColors} intensity={intensity} />;
            case 'geometric':
                return <GeometricBackground mousePosition={{ x: smoothMouseX, y: smoothMouseY }} colors={currentColors} intensity={intensity} />;
            case 'gradient':
            default:
                return <GradientBackground mousePosition={{ x: smoothMouseX, y: smoothMouseY }} colors={currentColors} intensity={intensity} />;
        }
    };

    // Scroll-based visibility optimization
    const { scrollY } = useScroll();
    // Fade out effect removed to keep background visible on mobile
    // const opacity = useTransform(scrollY, [0, 1000], [1, 0]); 
    const opacity = 1;

    // Disable rendering when fully scrolled away to save resources
    // Increased threshold to ensure it doesn't disappear prematurely on long screens
    const display = useTransform(scrollY, (value) => (value > 1500 ? 'none' : 'block'));

    return (
        <motion.div
            ref={containerRef}
            className="interactive-background"
            style={{ opacity, display }}
        >
            {renderBackground()}
        </motion.div>
    );
};

export default InteractiveBackground;
