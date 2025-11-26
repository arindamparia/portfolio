import React, { useState, useEffect, useMemo } from 'react';
import { useScroll } from 'framer-motion';
import { generateStars } from './utils';
import StarItem from './StarItem';
import ShootingStarSystem from './ShootingStarSystem';
import SpaceGradient from './SpaceGradient';

// Universe Particles Background - Space/Galaxy Theme
const UniverseParticlesBackground = ({ mouseX, mouseY, colors, intensity }) => {
    const starCount = 80; // Reduced from 120 for better performance
    const [loadedCount, setLoadedCount] = useState(10); // Stars loaded via time
    const [scrollLimit, setScrollLimit] = useState(starCount); // Stars allowed via scroll

    // Memoize stars to prevent recalculation on every render
    const stars = useMemo(() => generateStars(starCount), [starCount]);

    // 1. Gradually increase loaded stars on mount (Checkpoint: stops at starCount)
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadedCount(prev => {
                if (prev >= starCount) {
                    clearInterval(interval);
                    return starCount;
                }
                return prev + 10; // Add 10 stars every 100ms
            });
        }, 100);

        return () => clearInterval(interval);
    }, [starCount]);

    // 2. Decrease/Increase stars based on scroll position
    const { scrollY } = useScroll();

    useEffect(() => {
        // Subscribe to scroll changes
        const unsubscribe = scrollY.on("change", (latest) => {
            // Map scroll (0-600px) to count (80-0)
            // 0px = 80 stars
            // 300px = 40 stars
            // 600px = 0 stars
            const newLimit = Math.max(0, Math.floor(starCount - (latest / 600) * starCount));

            // Only update if changed significantly to avoid thrashing
            setScrollLimit(prev => {
                if (Math.abs(prev - newLimit) >= 5) return newLimit;
                return prev;
            });
        });

        return () => unsubscribe();
    }, [scrollY, starCount]);

    // The actual number of stars to render is the minimum of both constraints
    const finalVisibleCount = Math.min(loadedCount, scrollLimit);

    return (
        <div className="universe-bg">
            {/* Lighter space background with subtle gradient */}
            <SpaceGradient mouseX={mouseX} mouseY={mouseY} />

            {/* Render stars, planets, and nebulae - staggered loading + scroll reduction */}
            {stars.slice(0, finalVisibleCount).map((star) => (
                <StarItem
                    key={star.id}
                    star={star}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    colors={colors}
                    intensity={intensity}
                />
            ))}

            {/* Dynamic Shooting Stars System */}
            <ShootingStarSystem />
        </div>
    );
};

export default UniverseParticlesBackground;
