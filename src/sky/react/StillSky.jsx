import React from 'react';
import { useMotionValue } from 'framer-motion';
import UniverseParticlesBackground from '../../components/Shared/InteractiveBackground/UniverseParticlesBackground';

// DOM-based sky for devices without WebGPU or WebGL 2
const StillSky = ({ colors }) => {
    const centre = useMotionValue(0.5);
    return <UniverseParticlesBackground mouseX={centre} mouseY={centre} colors={colors} intensity={0.3} />;
};

export default StillSky;
