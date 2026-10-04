/**
 * Sky palette
 *
 * The "time accent": the sky's colour follows the visitor's real time of day
 * (from useSunCycle). Used by the 3D sky and exposed to CSS as --accent.
 */

export const SCHEMES = {
    purple: { primary: '#667eea', secondary: '#764ba2', accent: '#a855f7', light: '#c084fc' },
    blue: { primary: '#4f46e5', secondary: '#06b6d4', accent: '#3b82f6', light: '#60a5fa' },
    orange: { primary: '#f59e0b', secondary: '#f97316', accent: '#fb923c', light: '#fdba74' },
    pink: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6', light: '#f9a8d4' },
    teal: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf', light: '#5eead4' },
};

// Signal gold: only ever means "the algorithm is working on this right now"
export const SIGNAL = '#f2c46d';

export const schemeForCycle = (cycle) => {
    switch (cycle) {
        case 'dawn':
        case 'early-morning':
            return 'pink';
        case 'day':
        case 'morning':
        case 'late-morning':
        case 'noon':
        case 'early-afternoon':
            return 'blue';
        case 'afternoon':
        case 'late-afternoon':
        case 'dusk':
            return 'orange';
        case 'blue-hour':
        case 'blue-hour-morning':
            return 'teal';
        default:
            return 'purple';
    }
};
