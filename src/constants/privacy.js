export const PRIVACY_CONTENT = {
    TITLE: 'Privacy & Experience',
    DESCRIPTION: 'This site processes your IP address client-side (without storage) to ensure an optimal page experience. I also request permission to collect device information to improve communication services. Do you consent to the additional part?',
    BUTTON_ACCEPT: 'Accept',
    BUTTON_DECLINE: 'Decline'
};

export const PRIVACY_CONFIG = {
    CONSENT_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
    BANNER_DELAY: 1500 // 1.5 seconds
};

/**
 * Checks whether the privacy consent popup is enabled via environment variable.
 * Disabled by default. Set VITE_ENABLE_CONSENT_POPUP=true in .env to enable it.
 * Also supports VITE_ENABLE_PRIVACY_BANNER=true for backwards compatibility.
 *
 * @returns {boolean}
 */
export const isConsentPopupEnabled = () => {
    const env = import.meta.env;
    return env?.VITE_ENABLE_CONSENT_POPUP === 'true' || env?.VITE_ENABLE_PRIVACY_BANNER === 'true';
};
