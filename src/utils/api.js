// Get API base URL based on environment
export const getApiUrl = () => {
    // In production (Netlify), API calls will be relative
    // In development, use localhost:3001
    if (import.meta.env.PROD) {
        // Production - use relative URL (will be handled by Netlify redirects)
        return '';
    }
    // Development - use local Express server
    return 'http://localhost:3001';
};

export const API_BASE_URL = getApiUrl();
