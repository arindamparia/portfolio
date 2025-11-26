// Shared validation utilities for contact form
// Used by both server.js and Netlify functions

/**
 * Field length limits matching database schema
 */
export const FIELD_LIMITS = {
    salutation: 3,
    firstName: 30,
    lastName: 30,
    email: 80,
    mobile: 20,
    company: 80,
    message: 500,
    userAgent: 200,
    browser: 30,
    operatingSystem: 30,
    deviceType: 10,
    screenResolution: 15,
    language: 5,
    timezone: 40,
    referrer: 200
};

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

    // Validate field lengths (minimum)
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

    // Validate field lengths (maximum)
    if (firstName.length > FIELD_LIMITS.firstName) {
        return {
            valid: false,
            error: `First name must not exceed ${FIELD_LIMITS.firstName} characters`
        };
    }

    if (lastName.length > FIELD_LIMITS.lastName) {
        return {
            valid: false,
            error: `Last name must not exceed ${FIELD_LIMITS.lastName} characters`
        };
    }

    if (email.length > FIELD_LIMITS.email) {
        return {
            valid: false,
            error: `Email must not exceed ${FIELD_LIMITS.email} characters`
        };
    }

    if (mobile.length > FIELD_LIMITS.mobile) {
        return {
            valid: false,
            error: `Mobile must not exceed ${FIELD_LIMITS.mobile} characters`
        };
    }

    if (message.length > FIELD_LIMITS.message) {
        return {
            valid: false,
            error: `Message must not exceed ${FIELD_LIMITS.message} characters`
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
 * Truncate a string to a maximum length
 * @param {string} value - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
function truncate(value, maxLength) {
    if (!value) return value;
    return value.length > maxLength ? value.substring(0, maxLength) : value;
}

/**
 * Sanitize and prepare contact data for database insertion
 * Truncates fields to match database VARCHAR limits to prevent errors
 * @param {Object} data - Raw contact form data
 * @returns {Object} Sanitized data ready for database
 */
export function sanitizeContactData(data) {
    return {
        salutation: truncate(data.salutation || null, FIELD_LIMITS.salutation),
        firstName: truncate(data.firstName.trim(), FIELD_LIMITS.firstName),
        lastName: truncate(data.lastName.trim(), FIELD_LIMITS.lastName),
        email: truncate(data.email.trim(), FIELD_LIMITS.email),
        mobile: truncate(data.mobile.trim(), FIELD_LIMITS.mobile),
        company: truncate(data.company?.trim() || null, FIELD_LIMITS.company),
        message: truncate(data.message.trim(), FIELD_LIMITS.message),
        userAgent: truncate(data.userAgent || null, FIELD_LIMITS.userAgent),
        language: truncate(data.language || null, FIELD_LIMITS.language),
        screenResolution: truncate(data.screenResolution || null, FIELD_LIMITS.screenResolution),
        timezone: truncate(data.timezone || null, FIELD_LIMITS.timezone),
        referrer: truncate(data.referrer || null, FIELD_LIMITS.referrer)
    };
}
