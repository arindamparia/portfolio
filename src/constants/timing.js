/**
 * Centralized timing constants for the application
 * All time values are in milliseconds
 */

export const TIMING = {
    // Clock updates
    CLOCK_UPDATE_INTERVAL: 1000, // 1 second

    // Sun cycle updates
    SUN_CYCLE_UPDATE_INTERVAL: 60 * 1000, // 1 minute
    SUN_CYCLE_FETCH_INTERVAL: 5 * 60 * 1000, // 5 minutes

    // Toast notifications
    TOAST_AUTO_DISMISS: 5000, // 5 seconds
    TOAST_ANIMATION_DURATION: 300, // 0.3 seconds

    // Privacy banner
    PRIVACY_BANNER_DELAY: 2000, // 2 seconds

    // View mode toggle
    VIEW_MODE_DEBOUNCE: 300, // 0.3 seconds

    // Interactive backgrounds
    STAR_TWINKLE_INTERVAL: 3000, // 3 seconds
    SHOOTING_STAR_INTERVAL: 5000, // 5 seconds
};

export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
};

export const DEBOUNCE_DELAY = {
    SHORT: 150,
    MEDIUM: 300,
    LONG: 500,
};
