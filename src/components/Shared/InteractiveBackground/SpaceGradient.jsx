import React from 'react';
import { motion, useTransform } from 'framer-motion';

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

export default SpaceGradient;
