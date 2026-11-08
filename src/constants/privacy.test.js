import { describe, expect, it, afterEach } from 'vitest';
import { isConsentPopupEnabled } from './privacy';

describe('privacy consent banner configuration', () => {
    const originalEnv = { ...import.meta.env };

    afterEach(() => {
        // Restore import.meta.env
        Object.keys(import.meta.env).forEach((key) => {
            if (!(key in originalEnv)) {
                delete import.meta.env[key];
            }
        });
        Object.assign(import.meta.env, originalEnv);
    });

    it('is disabled by default when env variable is not set or empty', () => {
        delete import.meta.env.VITE_ENABLE_CONSENT_POPUP;
        delete import.meta.env.VITE_ENABLE_PRIVACY_BANNER;
        expect(isConsentPopupEnabled()).toBe(false);
    });

    it('is disabled when env variable is set to false', () => {
        import.meta.env.VITE_ENABLE_CONSENT_POPUP = 'false';
        expect(isConsentPopupEnabled()).toBe(false);
    });

    it('is enabled when VITE_ENABLE_CONSENT_POPUP is set to true', () => {
        import.meta.env.VITE_ENABLE_CONSENT_POPUP = 'true';
        expect(isConsentPopupEnabled()).toBe(true);
    });

    it('is enabled when VITE_ENABLE_PRIVACY_BANNER is set to true', () => {
        delete import.meta.env.VITE_ENABLE_CONSENT_POPUP;
        import.meta.env.VITE_ENABLE_PRIVACY_BANNER = 'true';
        expect(isConsentPopupEnabled()).toBe(true);
    });
});
