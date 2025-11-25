import { getRandomPhoneError } from '../constants/formErrorMessages.js';

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
            error: getRandomPhoneError('required')
        };
    }

    // Check if it contains only digits
    if (!/^\d+$/.test(cleanNumber)) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('invalidCharacters')
        };
    }

    // Check if it's exactly 10 digits
    if (cleanNumber.length !== 10) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('lengthError')
        };
    }

    // Check if it starts with a valid Indian mobile prefix (6-9)
    if (!hasValidIndianPrefix(cleanNumber)) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('invalidPrefix')
        };
    }

    // Format the number as: XXXXX XXXXX
    const formatted = cleanNumber.replace(/(\d{5})(\d{5})/, '$1 $2');

    // Return success with formatted number
    return {
        isValid: true,
        formatted: formatted,
        error: null
    };
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
