import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
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
      case 'waves':
      case 'mesh':
      case 'aurora':
      case 'geometric':
      case 'gradient':
      default:
        // For now, only Universe is optimized. Others will fallback to static or simple animation if needed.
        // Since user is using 'universe', we prioritize that.
        return <UniverseParticlesBackground mouseX={smoothMouseX} mouseY={smoothMouseY} colors={currentColors} intensity={intensity} />;
    }
  };

  // Scroll-based visibility optimization
  const { scrollY } = useScroll();
  // Fade out as user scrolls down (0 to 500px)
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  // Disable rendering when fully scrolled away to save resources
  const display = useTransform(scrollY, (value) => (value > 600 ? 'none' : 'block'));

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

// Gradient Background with flowing colors
const GradientBackground = ({ mousePosition, colors, intensity }) => {
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
const ParticlesBackground = ({ mousePosition, colors, intensity }) => {
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
const WavesBackground = ({ mousePosition, colors, intensity }) => {
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
const MeshBackground = ({ mousePosition, colors, intensity }) => {
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
const AuroraBackground = ({ mousePosition, colors, intensity }) => {
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
const GeometricBackground = ({ mousePosition, colors, intensity }) => {
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

// Separate component for Gradient to use hooks
const SpaceGradient = ({ mouseX, mouseY }) => {
  const x = useTransform(mouseX, [0, 1], ['40%', '60%']);
  const y = useTransform(mouseY, [0, 1], ['40%', '60%']);

  return (
    <motion.div
      className="space-gradient"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: useTransform(
          [x, y],
          ([latestX, latestY]) => `radial-gradient(ellipse at ${latestX} ${latestY}, rgba(20, 25, 60, 0.15) 0%, rgba(10, 15, 35, 0.08) 100%)`
        )
      }}
    />
  );
};

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

// Helper functions for random generation (moved outside components to avoid purity lint errors)
const generateParticles = (count, colors) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 0.5 + 0.3,
    color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
  }));
};

const generateShapes = (colors) => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (i % 4) * 30,
    y: Math.floor(i / 4) * 45,
    size: Math.random() * 50 + 35,
    type: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle',
    color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
  }));
};

const generateStars = (count) => {
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

export default InteractiveBackground;
