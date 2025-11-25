// Framer Motion animation presets to reduce duplication across components

/**
 * Standard fade-in from bottom animation
 */
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

/**
 * Fade-in from bottom with custom delay
 * @param {number} delay - Delay in seconds
 */
export const fadeInUpWithDelay = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay }
});

/**
 * Standard fade-in animation (no vertical movement)
 */
export const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

/**
 * Fade-in with custom delay
 * @param {number} delay - Delay in seconds
 */
export const fadeInWithDelay = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.5, delay }
});

/**
 * Slide in from left animation
 */
export const slideInFromLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

/**
 * Slide in from right animation
 */
export const slideInFromRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

/**
 * Container animation for staggered children
 */
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

/**
 * Item animation for use with containerVariants
 */
export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

/**
 * Scale animation for cards/elements
 */
export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.5 }
};

/**
 * Hover scale effect for interactive elements
 */
export const hoverScale = {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 }
};

/**
 * Hover lift effect for cards
 */
export const hoverLift = {
    whileHover: { y: -5 },
    transition: { duration: 0.2 }
};
