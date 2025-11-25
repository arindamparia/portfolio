/**
 * Vibration utility for providing haptic feedback
 * Checks if the Vibration API is supported before attempting to vibrate
 */

/**
 * Triggers a vibration pattern
 * @param {number|number[]} pattern - Duration in ms or array of durations [vibrate, pause, vibrate, ...]
 * @returns {boolean} - Whether vibration was triggered successfully
 */
export const vibrate = (pattern = 50) => {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
            return true;
        } catch (error) {
            console.warn('Vibration failed:', error);
            return false;
        }
    }
    return false;
};

/**
 * Predefined vibration patterns for common interactions
 */
export const vibrationPatterns = {
    // Light tap for buttons and links
    light: 30,

    // Medium vibration for navigation
    medium: 50,

    // Strong vibration for important actions
    strong: 100,

    // Double tap pattern
    doubleTap: [50, 50, 50],

    // Success pattern
    success: [30, 50, 30],

    // Error pattern
    error: [100, 50, 100],

    // Subtle feedback
    subtle: 20
};

/**
 * Convenience functions for common vibrations
 */
export const vibrateLight = () => vibrate(vibrationPatterns.light);
export const vibrateMedium = () => vibrate(vibrationPatterns.medium);
export const vibrateStrong = () => vibrate(vibrationPatterns.strong);
export const vibrateDoubleTap = () => vibrate(vibrationPatterns.doubleTap);
export const vibrateSuccess = () => vibrate(vibrationPatterns.success);
export const vibrateError = () => vibrate(vibrationPatterns.error);
export const vibrateSubtle = () => vibrate(vibrationPatterns.subtle);
