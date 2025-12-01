/**
 * Browser detection and API support utilities
 */

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
