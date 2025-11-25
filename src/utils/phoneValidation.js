import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Validates if a phone number is a valid Indian mobile number
 * @param {string} phoneNumber - The phone number to validate (without country code)
 * @returns {Object} - { isValid: boolean, formatted: string | null, error: string | null }
 */
export const validateIndianPhoneNumber = (phoneNumber) => {
    // Remove any whitespace or dashes
    const cleanNumber = phoneNumber.trim().replace(/[\s-]/g, '');

    // Check if the number is empty
    if (!cleanNumber) {
        return {
            isValid: false,
            formatted: null,
            error: 'Phone number is required'
        };
    }

    // Check if it contains only digits
    if (!/^\d+$/.test(cleanNumber)) {
        return {
            isValid: false,
            formatted: null,
            error: 'Phone number should contain only digits'
        };
    }

    // Check if it's exactly 10 digits
    if (cleanNumber.length !== 10) {
        return {
            isValid: false,
            formatted: null,
            error: '10 digits please! Not 9, not 11... exactly 10! 🔟'
        };
    }

    // Check if it starts with a valid Indian mobile prefix (6-9)
    if (!hasValidIndianPrefix(cleanNumber)) {
        return {
            isValid: false,
            formatted: null,
            error: 'Indian mobile numbers start with 6, 7, 8, or 9 📱'
        };
    }

    try {
        // Add +91 country code for Indian numbers
        const phoneWithCountryCode = `+91${cleanNumber}`;

        // Check if the number is valid for India (IN)
        const isValid = isValidPhoneNumber(phoneWithCountryCode, 'IN');

        if (!isValid) {
            return {
                isValid: false,
                formatted: null,
                error: 'That doesn\'t look like a valid Indian number 🇮🇳'
            };
        }

        // Parse the phone number to get more details
        const phoneNumberObj = parsePhoneNumber(phoneWithCountryCode, 'IN');

        // Check if it's a mobile number (not landline)
        // Note: getType() may return 'MOBILE', 'FIXED_LINE_OR_MOBILE', or undefined for Indian numbers
        // We accept MOBILE and FIXED_LINE_OR_MOBILE, but reject FIXED_LINE
        const phoneType = phoneNumberObj.getType();
        if (phoneType === 'FIXED_LINE') {
            return {
                isValid: false,
                formatted: null,
                error: 'Please enter a mobile number, not a landline 📱'
            };
        }

        // Return success with formatted number
        return {
            isValid: true,
            formatted: phoneNumberObj.formatNational(),
            error: null
        };
    } catch (error) {
        // If parsing fails, return error
        return {
            isValid: false,
            formatted: null,
            error: 'Invalid phone number format'
        };
    }
};

/**
 * Quick validation to check if a number starts with valid Indian mobile prefixes
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean}
 */
export const hasValidIndianPrefix = (phoneNumber) => {
    const cleanNumber = phoneNumber.trim().replace(/[\s-]/g, '');
    return /^[6-9]/.test(cleanNumber);
};
