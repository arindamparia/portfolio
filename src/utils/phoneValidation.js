import { getRandomPhoneError } from '../constants/formMessages.js';

/**
 * Helper to clean phone number by removing whitespace and dashes
 * @param {string} phoneNumber - The phone number to clean
 * @returns {string} Cleaned phone number
 */
const cleanPhoneNumber = (phoneNumber) => phoneNumber.trim().replace(/[\s-]/g, '');

/**
 * Validates if a phone number is a valid Indian mobile number
 * @param {string} phoneNumber - The phone number to validate (without country code)
 * @returns {Object} - { isValid: boolean, formatted: string | null, error: string | null }
 */
export const validateIndianPhoneNumber = (phoneNumber) => {
    const cleanNumber = cleanPhoneNumber(phoneNumber);

    if (!cleanNumber) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('required')
        };
    }

    if (!/^\d+$/.test(cleanNumber)) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('invalidCharacters')
        };
    }

    if (cleanNumber.length !== 10) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('lengthError')
        };
    }

    if (!/^[6-9]/.test(cleanNumber)) {
        return {
            isValid: false,
            formatted: null,
            error: getRandomPhoneError('invalidPrefix')
        };
    }

    // Format the number as: XXXXX XXXXX
    const formatted = cleanNumber.replace(/(\d{5})(\d{5})/, '$1 $2');

    return {
        isValid: true,
        formatted,
        error: null
    };
};

/**
 * Quick validation to check if a number starts with valid Indian mobile prefixes
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean}
 */
export const hasValidIndianPrefix = (phoneNumber) => /^[6-9]/.test(cleanPhoneNumber(phoneNumber));
