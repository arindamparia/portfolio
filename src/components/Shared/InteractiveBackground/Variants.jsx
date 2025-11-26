import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateParticles, generateShapes } from './utils';

// Gradient Background with flowing colors
export const GradientBackground = ({ mousePosition, colors, intensity }) => {
    const offsetX = (mousePosition.x - 0.5) * 100 * intensity;
    const offsetY = (mousePosition.y - 0.5) * 100 * intensity;

    return (
        <motion.div
            className="gradient-bg"
            animate={{
                background: `radial-gradient(circle at ${50 + offsetX}% ${50 + offsetY}%, ${colors.primary}15, transparent 70%),
                     radial-gradient(circle at ${30 - offsetX * 0.5}% ${70 - offsetY * 0.5}%, ${colors.secondary}10, transparent 60%),
                     radial-gradient(circle at ${70 + offsetX * 0.7}% ${30 + offsetY * 0.7}%, ${colors.accent}12, transparent 65%)`
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
    );
};

// Floating Particles Background
export const ParticlesBackground = ({ mousePosition, colors, intensity }) => {
    const particleCount = 12;
    const particles = useMemo(() => generateParticles(particleCount, colors), [particleCount, colors]);

    return (
        <div className="particles-bg">
            {particles.map((particle) => {
                const offsetX = (mousePosition.x - 0.5) * particle.speed * 80 * intensity;
                const offsetY = (mousePosition.y - 0.5) * particle.speed * 80 * intensity;

                return (
                    <motion.div
                        key={particle.id}
                        className="particle"
                        animate={{
                            x: `calc(${particle.initialX}% + ${offsetX}px)`,
                            y: `calc(${particle.initialY}% + ${offsetY}px)`,
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            x: { type: 'spring', stiffness: 30, damping: 15 },
                            y: { type: 'spring', stiffness: 30, damping: 15 },
                            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                        }}
                        style={{
                            width: particle.size,
                            height: particle.size,
                            background: particle.color,
                            position: 'absolute',
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                        }}
                    />
                );
            })}
        </div>
    );
};

// Animated Waves Background
export const WavesBackground = ({ mousePosition, colors, intensity }) => {
    const waveOffset = (mousePosition.x - 0.5) * 50 * intensity;
    const waveHeight = (mousePosition.y - 0.5) * 30 * intensity;

    return (
        <div className="waves-bg">
            <motion.svg
                viewBox="0 0 1200 600"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%' }}
            >
                <motion.path
                    d={`M0,${300 + waveHeight} Q${300 + waveOffset},${200 + waveHeight} ${600},${300 + waveHeight} T1200,${300 + waveHeight} L1200,600 L0,600 Z`}
                    fill={`${colors.primary}15`}
                    animate={{
                        d: `M0,${300 + waveHeight} Q${300 + waveOffset},${200 + waveHeight} ${600},${300 + waveHeight} T1200,${300 + waveHeight} L1200,600 L0,600 Z`
                    }}
                    transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                />
                <motion.path
                    d={`M0,${350 - waveHeight} Q${400 - waveOffset},${250 - waveHeight} ${600},${350 - waveHeight} T1200,${350 - waveHeight} L1200,600 L0,600 Z`}
                    fill={`${colors.secondary}10`}
                    animate={{
                        d: `M0,${350 - waveHeight} Q${400 - waveOffset},${250 - waveHeight} ${600},${350 - waveHeight} T1200,${350 - waveHeight} L1200,600 L0,600 Z`
                    }}
                    transition={{ type: 'spring', stiffness: 35, damping: 18 }}
                />
                <motion.path
                    d={`M0,${400 + waveHeight * 0.5} Q${500 + waveOffset * 0.7},${300 + waveHeight * 0.5} ${600},${400 + waveHeight * 0.5} T1200,${400 + waveHeight * 0.5} L1200,600 L0,600 Z`}
                    fill={`${colors.accent}08`}
                    animate={{
                        d: `M0,${400 + waveHeight * 0.5} Q${500 + waveOffset * 0.7},${300 + waveHeight * 0.5} ${600},${400 + waveHeight * 0.5} T1200,${400 + waveHeight * 0.5} L1200,600 L0,600 Z`
                    }}
                    transition={{ type: 'spring', stiffness: 30, damping: 20 }}
                />
            </motion.svg>
        </div>
    );
};

// Mesh Gradient Background
export const MeshBackground = ({ mousePosition, colors, intensity }) => {
    const offsetX = (mousePosition.x - 0.5) * 200 * intensity;
    const offsetY = (mousePosition.y - 0.5) * 200 * intensity;

    return (
        <div className="mesh-bg">
            <motion.div
                className="mesh-blob mesh-blob-1"
                animate={{
                    x: offsetX,
                    y: offsetY,
                }}
                transition={{ type: 'spring', stiffness: 30, damping: 15 }}
                style={{ background: `radial-gradient(circle, ${colors.primary}40, ${colors.primary}10)` }}
            />
            <motion.div
                className="mesh-blob mesh-blob-2"
                animate={{
                    x: -offsetX * 0.7,
                    y: offsetY * 0.8,
                }}
                transition={{ type: 'spring', stiffness: 25, damping: 18 }}
                style={{ background: `radial-gradient(circle, ${colors.secondary}35, ${colors.secondary}08)` }}
            />
            <motion.div
                className="mesh-blob mesh-blob-3"
                animate={{
                    x: offsetX * 0.5,
                    y: -offsetY * 0.6,
                }}
                transition={{ type: 'spring', stiffness: 35, damping: 20 }}
                style={{ background: `radial-gradient(circle, ${colors.accent}30, ${colors.accent}05)` }}
            />
            <div className="mesh-blur" />
        </div>
    );
};

// Aurora Borealis Effect
export const AuroraBackground = ({ mousePosition, colors, intensity }) => {
    const offsetX = (mousePosition.x - 0.5) * 150 * intensity;
    const offsetY = (mousePosition.y - 0.5) * 150 * intensity;

    return (
        <div className="aurora-bg">
            <motion.div
                className="aurora-strip aurora-strip-1"
                animate={{
                    x: offsetX,
                    y: offsetY * 0.5,
                    rotate: offsetX * 0.1,
                }}
                transition={{ type: 'spring', stiffness: 20, damping: 25 }}
                style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}40, ${colors.light}30, transparent)` }}
            />
            <motion.div
                className="aurora-strip aurora-strip-2"
                animate={{
                    x: -offsetX * 0.7,
                    y: offsetY,
                    rotate: -offsetX * 0.08,
                }}
                transition={{ type: 'spring', stiffness: 18, damping: 28 }}
                style={{ background: `linear-gradient(110deg, transparent, ${colors.secondary}35, ${colors.accent}25, transparent)` }}
            />
            <motion.div
                className="aurora-strip aurora-strip-3"
                animate={{
                    x: offsetX * 0.4,
                    y: -offsetY * 0.8,
                    rotate: offsetX * 0.05,
                }}
                transition={{ type: 'spring', stiffness: 22, damping: 22 }}
                style={{ background: `linear-gradient(70deg, transparent, ${colors.accent}30, ${colors.primary}20, transparent)` }}
            />
        </div>
    );
};

// Geometric Patterns Background
export const GeometricBackground = ({ mousePosition, colors, intensity }) => {
    const offsetX = (mousePosition.x - 0.5) * 100 * intensity;
    const offsetY = (mousePosition.y - 0.5) * 100 * intensity;
    const rotation = (mousePosition.x - 0.5) * 20 * intensity;

    const shapes = useMemo(() => generateShapes(colors), [colors]);

    return (
        <div className="geometric-bg">
            {shapes.map((shape) => (
                <motion.div
                    key={shape.id}
                    className={`geo-shape geo-${shape.type}`}
                    animate={{
                        x: `calc(${shape.x}% + ${offsetX * (shape.id % 2 === 0 ? 1 : -1) * 0.5}px)`,
                        y: `calc(${shape.y}% + ${offsetY * (shape.id % 2 === 0 ? 1 : -1) * 0.5}px)`,
                        rotate: rotation * (shape.id % 2 === 0 ? 1 : -1),
                    }}
                    transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                    style={{
                        width: shape.size,
                        height: shape.size,
                        background: `${shape.color}15`,
                        border: `2px solid ${shape.color}25`,
                    }}
                />
            ))}
        </div>
    );
};
