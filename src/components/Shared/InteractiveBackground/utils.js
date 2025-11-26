// Helper functions for random generation

export const generateParticles = (count, colors) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.3,
        color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
    }));
};

export const generateShapes = (colors) => {
    return Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (i % 4) * 30,
        y: Math.floor(i / 4) * 45,
        size: Math.random() * 50 + 35,
        type: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle',
        color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
    }));
};

export const generateStars = (count) => {
    const gridSize = Math.ceil(Math.sqrt(count));
    const cellWidth = 100 / gridSize;
    const cellHeight = 100 / gridSize;

    return Array.from({ length: count }, (_, i) => {
        const gridX = i % gridSize;
        const gridY = Math.floor(i / gridSize);

        // Add randomization within each grid cell for natural look
        let x = gridX * cellWidth + Math.random() * cellWidth;
        let y = gridY * cellHeight + Math.random() * cellHeight;

        // Exclusion zone for profile image
        // Profile image is roughly centered or slightly left-center
        // We'll define a circular exclusion zone around the center
        const centerX = 35; // Shifted slightly left for desktop layout
        const centerY = 50;
        const exclusionRadiusX = 20; // 20% width radius
        const exclusionRadiusY = 25; // 25% height radius

        // Check if point is inside ellipse
        const normalizedDist = Math.pow((x - centerX) / exclusionRadiusX, 2) +
            Math.pow((y - centerY) / exclusionRadiusY, 2);

        if (normalizedDist < 1) {
            // If inside exclusion zone, push it out
            // Determine direction to push
            if (x < centerX) {
                x = Math.max(2, x - exclusionRadiusX);
            } else {
                x = Math.min(98, x + exclusionRadiusX);
            }
        }

        return {
            id: i,
            x: Math.min(x, 98), // Keep within bounds
            y: Math.min(y, 98),
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 0.6 + 0.2,
            twinkleDelay: Math.random() * 4,
            orbitRadius: Math.random() * 40 + 15,
            orbitSpeed: Math.random() * 1.5 + 0.8,
            type: i % 15 === 0 ? 'nebula' : i % 20 === 0 ? 'planet' : 'star' // Adjusted ratios for higher count
        };
    });
};
