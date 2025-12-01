/**
 * Environment and browser detection utilities
 */

/**
 * Checks if running on localhost
 * @returns {boolean}
 */
export const isLocalhost = () => {
    return window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.');
};

/**
 * Checks if running in production
 * @returns {boolean}
 */
export const isProduction = () => {
    return !isLocalhost();
};

/**
 * Gets the current environment name
 * @returns {string} 'development' or 'production'
 */
export const getEnvironment = () => {
    return isLocalhost() ? 'development' : 'production';
};

/**
 * Checks if browser supports a specific API
 * @param {string} api - The API name to check (e.g., 'localStorage', 'navigator.vibrate')
 * @returns {boolean}
 */
export const isAPISupported = (api) => {
    try {
        switch (api) {
            case 'localStorage':
                return typeof localStorage !== 'undefined';
            case 'vibrate':
                return 'vibrate' in navigator;
            case 'geolocation':
                return 'geolocation' in navigator;
            default:
                return false;
        }
    } catch {
        return false;
    }
};
