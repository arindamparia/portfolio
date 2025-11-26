import React from 'react';
import { motion, useTransform } from 'framer-motion';

// Separate component for each Star to use hooks - Memoized for performance
const StarItem = React.memo(({ star, mouseX, mouseY, colors, intensity }) => {
    // Calculate parallax movement based on mouse position
    // Reduced intensity for subtle movement
    const movementFactor = star.speed * 30 * intensity;

    // Calculate parallax offset in pixels
    // Range: -movementFactor to +movementFactor (e.g., -30px to +30px)
    const x = useTransform(mouseX, [0, 1], [-movementFactor, movementFactor]);
    const y = useTransform(mouseY, [0, 1], [-movementFactor, movementFactor]);

    if (star.type === 'nebula') {
        return (
            <motion.div
                key={star.id}
                className="nebula"
                style={{
                    x, y,
                    willChange: 'transform',
                    position: 'absolute',
                    left: `${star.x}%`, // Base position
                    top: `${star.y}%`,  // Base position
                    width: star.size * 30 + 40,
                    height: star.size * 30 + 40,
                    background: `radial-gradient(circle, ${colors.primary}70, ${colors.accent}40, transparent)`,
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                }}
                animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    opacity: { duration: 8, repeat: Infinity, delay: star.twinkleDelay },
                    scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
                }}
            />
        );
    } else if (star.type === 'planet') {
        return (
            <motion.div
                key={star.id}
                className="planet"
                style={{
                    x, y,
                    willChange: 'transform',
                    position: 'absolute',
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size * 5 + 6,
                    height: star.size * 5 + 6,
                    background: `radial-gradient(circle at 30% 30%, ${colors.light}, ${colors.secondary})`,
                    borderRadius: '50%',
                    boxShadow: `0 0 ${star.size * 4}px ${colors.accent}, 0 0 ${star.size * 2}px ${colors.light}`,
                }}
                animate={{
                    rotate: 360,
                }}
                transition={{
                    rotate: { duration: star.orbitSpeed * 20, repeat: Infinity, ease: 'linear' }
                }}
            />
        );
    } else {
        return (
            <motion.div
                key={star.id}
                className="star"
                style={{
                    x, y,
                    willChange: 'transform',
                    position: 'absolute',
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                    background: '#ffffff',
                    borderRadius: '50%',
                    boxShadow: `0 0 ${star.size * 3}px #ffffff, 0 0 ${star.size * 5}px rgba(255, 255, 255, 0.5)`,
                    filter: 'blur(0.3px)',
                }}
                animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.9, 1.3, 0.9],
                }}
                transition={{
                    opacity: { duration: star.speed * 3, repeat: Infinity, delay: star.twinkleDelay },
                    scale: { duration: star.speed * 3, repeat: Infinity, delay: star.twinkleDelay }
                }}
            />
        );
    }
});

export default StarItem;
