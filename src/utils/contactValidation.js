// Shared validation utilities for contact form
// Used by both server.js and Netlify functions

/**
 * Validation result structure
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [error] - Error message if validation failed
 */

/**
 * Validates contact form data
 * @param {Object} data - Contact form data
 * @returns {ValidationResult}
 */
export function validateContactData(data) {
    const { salutation, firstName, lastName, email, mobile, message } = data;

    // Validate required fields
    if (!salutation || !firstName || !lastName || !email || !mobile || !message) {
        return {
            valid: false,
            error: 'Salutation, first name, last name, email, mobile, and message are required'
        };
    }

    // Validate field lengths
    if (firstName.trim().length < 3) {
        return {
            valid: false,
            error: 'First name must be at least 3 characters'
        };
    }

    if (lastName.trim().length < 3) {
        return {
            valid: false,
            error: 'Last name must be at least 3 characters'
        };
    }

    if (message.trim().length < 10) {
        return {
            valid: false,
            error: 'Message must be at least 10 characters'
        };
    }

    // Validate only letters in names (allows spaces for middle names, etc.)
    if (!/^[A-Za-z\s]+$/.test(firstName) || !/^[A-Za-z\s]+$/.test(lastName)) {
        return {
            valid: false,
            error: 'Names should only contain letters'
        };
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            valid: false,
            error: 'Please enter a valid email address'
        };
    }

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
        return {
            valid: false,
            error: 'Please enter a valid 10-digit mobile number'
        };
    }

    return { valid: true };
}

/**
 * Parse user agent to extract browser, OS, and device information
 * @param {UAParser} parser - Initialized UAParser instance
 * @returns {Object} Parsed user agent data
 */
export function parseUserAgent(parser) {
    const uaResult = parser.getResult();

    const browser = uaResult.browser.name
        ? `${uaResult.browser.name} ${uaResult.browser.version || ''}`.trim()
        : 'Unknown';

    const os = uaResult.os.name
        ? `${uaResult.os.name} ${uaResult.os.version || ''}`.trim()
        : 'Unknown';

    const deviceType = uaResult.device.type || 'desktop';

    return { browser, os, deviceType };
}

/**
 * Sanitize and prepare contact data for database insertion
 * @param {Object} data - Raw contact form data
 * @returns {Object} Sanitized data ready for database
 */
export function sanitizeContactData(data) {
    return {
        salutation: data.salutation || null,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        mobile: data.mobile.trim(),
        company: data.company?.trim() || null,
        message: data.message.trim(),
        userAgent: data.userAgent || null,
        language: data.language || null,
        screenResolution: data.screenResolution || null,
        timezone: data.timezone || null,
        referrer: data.referrer || null
    };
}
