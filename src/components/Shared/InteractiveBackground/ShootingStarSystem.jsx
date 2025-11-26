import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Shooting Star System Component
const ShootingStarSystem = () => {
    const [shootingStar, setShootingStar] = useState(null);

    useEffect(() => {
        const scheduleNextStar = () => {
            // Random delay between 2 and 3 seconds
            const delay = Math.random() * 1000 + 2000;

            const timeoutId = setTimeout(() => {
                // Spawn from top area
                const startX = Math.random() * 100; // 0-100% width
                const startY = -10 - Math.random() * 20; // Start above screen (-10% to -30%)

                // Steeper angle: 60 to 80 degrees (where 90 is straight down)
                // Or -60 to -80 for falling left? Let's stick to falling right for now or randomize slightly
                // Let's do falling down-right (positive angle) and down-left (negative angle)
                // Actually, standard angle 0 is right. 90 is down.
                // So 45 was down-right. 
                // User wants "falling down" more than "left to right".
                // So we want closer to 90. Say 70-85 degrees.
                const angle = 65 + Math.random() * 20; // 65 to 85 degrees

                setShootingStar({
                    id: Date.now(),
                    x: startX,
                    y: startY,
                    angle: angle,
                    distance: 600 + Math.random() * 300 // Longer trails
                });

                // Clear star after animation
                setTimeout(() => {
                    setShootingStar(null);
                    scheduleNextStar();
                }, 1500);
            }, delay);

            return timeoutId;
        };

        const timer = scheduleNextStar();
        return () => clearTimeout(timer);
    }, []);

    if (!shootingStar) return null;

    const angleRad = (shootingStar.angle * Math.PI) / 180;
    const moveX = Math.cos(angleRad) * shootingStar.distance;
    const moveY = Math.sin(angleRad) * shootingStar.distance;

    return (
        <motion.div
            key={shootingStar.id}
            className="shooting-star"
            initial={{
                left: `${shootingStar.x}%`,
                top: `${shootingStar.y}%`,
                opacity: 0,
                scale: 0.5
            }}
            animate={{
                left: `calc(${shootingStar.x}% + ${moveX}px)`,
                top: `calc(${shootingStar.y}% + ${moveY}px)`,
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 0.5]
            }}
            transition={{
                duration: 1.2, // Faster
                ease: "easeOut"
            }}
            style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(100, 100, 255, 0.4)',
                zIndex: 0
            }}
        />
    );
};

export default ShootingStarSystem;
