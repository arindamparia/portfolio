import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
        }
      });
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

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
      case 'particles':
        return <ParticlesBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
      case 'universe':
        return <UniverseParticlesBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
      case 'waves':
        return <WavesBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
      case 'mesh':
        return <MeshBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
      case 'aurora':
        return <AuroraBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
      case 'geometric':
        return <GeometricBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
      case 'gradient':
      default:
        return <GradientBackground mousePosition={mousePosition} colors={currentColors} intensity={intensity} />;
    }
  };

  return (
    <div ref={containerRef} className="interactive-background">
      {renderBackground()}
    </div>
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
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 0.5 + 0.3,
    color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
  }));

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

  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (i % 4) * 30,
    y: Math.floor(i / 4) * 45,
    size: Math.random() * 50 + 35,
    type: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle',
    color: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
  }));

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
const UniverseParticlesBackground = ({ mousePosition, colors, intensity }) => {
  const starCount = 60;

  // Generate stars with better distribution across the entire section
  // Use a grid-based approach with randomization for even distribution
  const gridSize = Math.ceil(Math.sqrt(starCount));
  const cellWidth = 100 / gridSize;
  const cellHeight = 100 / gridSize;

  const stars = Array.from({ length: starCount }, (_, i) => {
    const gridX = i % gridSize;
    const gridY = Math.floor(i / gridSize);

    // Add randomization within each grid cell for natural look
    const x = gridX * cellWidth + Math.random() * cellWidth;
    const y = gridY * cellHeight + Math.random() * cellHeight;

    return {
      id: i,
      x: Math.min(x, 98), // Keep within bounds
      y: Math.min(y, 98),
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.6 + 0.2,
      twinkleDelay: Math.random() * 4,
      orbitRadius: Math.random() * 40 + 15,
      orbitSpeed: Math.random() * 1.5 + 0.8,
      type: i % 8 === 0 ? 'nebula' : i % 6 === 0 ? 'planet' : 'star'
    };
  });

  return (
    <div className="universe-bg">
      {/* Lighter space background with subtle gradient */}
      <div className="space-gradient" style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `radial-gradient(ellipse at ${50 + (mousePosition.x - 0.5) * 30}% ${50 + (mousePosition.y - 0.5) * 30}%, rgba(20, 25, 60, 0.15) 0%, rgba(10, 15, 35, 0.08) 100%)`,
        transition: 'background 0.5s ease'
      }} />

      {/* Render stars, planets, and nebulae */}
      {stars.map((star) => {
        const offsetX = (mousePosition.x - 0.5) * star.speed * 100 * intensity;
        const offsetY = (mousePosition.y - 0.5) * star.speed * 100 * intensity;

        if (star.type === 'nebula') {
          // Render colorful nebula clouds
          return (
            <motion.div
              key={star.id}
              className="nebula"
              animate={{
                x: `calc(${star.x}% + ${offsetX * 0.3}px)`,
                y: `calc(${star.y}% + ${offsetY * 0.3}px)`,
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                x: { type: 'spring', stiffness: 20, damping: 15 },
                y: { type: 'spring', stiffness: 20, damping: 15 },
                opacity: { duration: 8, repeat: Infinity, delay: star.twinkleDelay },
                scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{
                position: 'absolute',
                width: star.size * 30 + 40,
                height: star.size * 30 + 40,
                background: `radial-gradient(circle, ${colors.primary}70, ${colors.accent}40, transparent)`,
                borderRadius: '50%',
                filter: 'blur(20px)',
              }}
            />
          );
        } else if (star.type === 'planet') {
          // Render small planets
          return (
            <motion.div
              key={star.id}
              className="planet"
              animate={{
                x: `calc(${star.x}% + ${offsetX * 0.5}px)`,
                y: `calc(${star.y}% + ${offsetY * 0.5}px)`,
                rotate: 360,
              }}
              transition={{
                x: { type: 'spring', stiffness: 25, damping: 15 },
                y: { type: 'spring', stiffness: 25, damping: 15 },
                rotate: { duration: star.orbitSpeed * 20, repeat: Infinity, ease: 'linear' }
              }}
              style={{
                position: 'absolute',
                width: star.size * 5 + 6,
                height: star.size * 5 + 6,
                background: `radial-gradient(circle at 30% 30%, ${colors.light}, ${colors.secondary})`,
                borderRadius: '50%',
                boxShadow: `0 0 ${star.size * 4}px ${colors.accent}, 0 0 ${star.size * 2}px ${colors.light}`,
              }}
            />
          );
        } else {
          // Render twinkling stars
          return (
            <motion.div
              key={star.id}
              className="star"
              animate={{
                x: `calc(${star.x}% + ${offsetX}px)`,
                y: `calc(${star.y}% + ${offsetY}px)`,
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.3, 0.9],
              }}
              transition={{
                x: { type: 'spring', stiffness: 30, damping: 15 },
                y: { type: 'spring', stiffness: 30, damping: 15 },
                opacity: { duration: star.speed * 3, repeat: Infinity, delay: star.twinkleDelay },
                scale: { duration: star.speed * 3, repeat: Infinity, delay: star.twinkleDelay }
              }}
              style={{
                position: 'absolute',
                width: star.size,
                height: star.size,
                background: '#ffffff',
                borderRadius: '50%',
                boxShadow: `0 0 ${star.size * 3}px #ffffff, 0 0 ${star.size * 5}px rgba(255, 255, 255, 0.5)`,
                filter: 'blur(0.3px)',
              }}
            />
          );
        }
      })}

      {/* Add shooting stars */}
      <motion.div
        className="shooting-star"
        animate={{
          x: ['0%', '100%'],
          y: ['0%', '50%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'easeOut'
        }}
        style={{
          position: 'absolute',
          width: '2px',
          height: '2px',
          background: 'white',
          boxShadow: '0 0 10px white, 0 0 20px white, -100px 0 20px white',
        }}
      />
    </div>
  );
};

export default InteractiveBackground;
