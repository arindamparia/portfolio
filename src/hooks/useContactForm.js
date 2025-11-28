import { useState, useEffect } from 'react';
import { vibrateError, vibrateSuccess } from '../utils/vibration';
import { API_BASE_URL } from '../utils/api';
import { validateIndianPhoneNumber } from '../utils/phoneValidation';
import { getRandomMessage, getRandomSuccess, getRandomPlaceholder } from '../constants/formMessages';
import { FIELD_LIMITS } from '../utils/contactValidation';

const EMPTY_FORM_DATA = {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    mobile: '',
    message: ''
};

const REQUIRED_FIELDS = ['salutation', 'firstName', 'lastName', 'email', 'mobile', 'message'];

export const useContactForm = () => {
    // Initialize form data from sessionStorage if available
    const getInitialFormData = () => {
        try {
            const savedData = sessionStorage.getItem('contactFormData');
            if (savedData) {
                return JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error loading form data from sessionStorage:', error);
        }
        return { ...EMPTY_FORM_DATA };
    };

    const [formData, setFormData] = useState(getInitialFormData);
    const [errors, setErrors] = useState({});
    const [errorTypes, setErrorTypes] = useState({});
    const [touched, setTouched] = useState({});
    const [focusedField, setFocusedField] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [displayedMessages, setDisplayedMessages] = useState({});
    const [messagePlaceholder, setMessagePlaceholder] = useState('');

    // Set random placeholder on mount
    useEffect(() => {
        setMessagePlaceholder(getRandomPlaceholder());
    }, []);

    // Save form data to sessionStorage whenever it changes
    useEffect(() => {
        try {
            sessionStorage.setItem('contactFormData', JSON.stringify(formData));
        } catch (error) {
            console.error('Error saving form data to sessionStorage:', error);
        }
    }, [formData]);

    // Helper to get the correct message field name
    const getMessageFieldName = (fieldName) => {
        return fieldName === 'mobile' ? 'phone' : fieldName;
    };

    // Consolidated validation - returns both error type and error message
    const validateField = (name, value) => {
        switch (name) {
            case 'salutation':
                if (!value || value.trim() === '') {
                    return { errorType: 'required', errorMessage: getRandomMessage('salutation', 'required') };
                }
                return { errorType: '', errorMessage: '' };

            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    return { errorType: 'required', errorMessage: getRandomMessage(name, 'required') };
                }
                if (value.trim().length < 3) {
                    return { errorType: 'tooShort', errorMessage: getRandomMessage(name, 'tooShort') };
                }
                if (!/^[A-Za-z]+$/.test(value)) {
                    return { errorType: 'invalid', errorMessage: getRandomMessage(name, 'invalid') };
                }
                return { errorType: '', errorMessage: '' };

            case 'mobile':
                if (!value.trim()) {
                    return { errorType: 'required', errorMessage: getRandomMessage('phone', 'required') };
                }
                const validation = validateIndianPhoneNumber(value);
                if (!validation.isValid) {
                    // Extract error type from validation error
                    const errorType = validation.error.includes('required') ? 'required' :
                        validation.error.includes('character') ? 'invalidCharacters' :
                            validation.error.includes('10') ? 'lengthError' : 'invalidPrefix';
                    return { errorType, errorMessage: validation.error };
                }
                return { errorType: '', errorMessage: '' };

            case 'email':
                if (!value.trim()) {
                    return { errorType: 'required', errorMessage: getRandomMessage('email', 'required') };
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return { errorType: 'invalid', errorMessage: getRandomMessage('email', 'invalid') };
                }
                return { errorType: '', errorMessage: '' };

            case 'message':
                if (!value.trim()) {
                    return { errorType: 'required', errorMessage: getRandomMessage('message', 'required') };
                }
                if (value.trim().length < 10) {
                    return { errorType: 'tooShort', errorMessage: getRandomMessage('message', 'tooShort') };
                }
                return { errorType: '', errorMessage: '' };

            default:
                return { errorType: '', errorMessage: '' };
        }
    };

    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now() + Math.random(); // Ensure unique ID even for rapid clicks
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Apply field-specific character restrictions
        let processedValue = value;
        if (name === 'firstName' || name === 'lastName') {
            processedValue = value.replace(/[^a-zA-Z]/g, '');
        } else if (name === 'mobile') {
            processedValue = value.replace(/[^0-9]/g, '');
        } else if (name !== 'company' && name !== 'message') {
            processedValue = value.replace(/\s/g, '');
        }

        // Enforce maximum length limits - prevent typing beyond database limits
        const maxLength = FIELD_LIMITS[name];
        if (maxLength && processedValue.length > maxLength) {
            processedValue = processedValue.substring(0, maxLength);
        }

        setFormData({
            ...formData,
            [name]: processedValue
        });

        if (touched[name]) {
            const { errorType, errorMessage } = validateField(name, processedValue);
            const prevErrorType = errorTypes[name];

            // Only update message when error type changes (not when same type generates different random message)
            if (prevErrorType !== errorType) {
                const messageFieldName = getMessageFieldName(name);
                setDisplayedMessages(prev => ({
                    ...prev,
                    [name]: errorMessage || getRandomSuccess(messageFieldName)
                }));

                setErrorTypes({
                    ...errorTypes,
                    [name]: errorType
                });
            }

            // Update error state - remove key if no error, add if error exists
            setErrors(prev => {
                const newErrors = { ...prev };
                if (errorMessage) {
                    newErrors[name] = errorMessage;
                } else {
                    delete newErrors[name];
                }
                return newErrors;
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const wasAlreadyTouched = touched[name];

        setTouched({
            ...touched,
            [name]: true
        });
        setFocusedField('');

        const { errorType, errorMessage } = validateField(name, value);

        // Only set the message on FIRST blur (when field wasn't already touched)
        if (!wasAlreadyTouched) {
            const messageFieldName = getMessageFieldName(name);
            setDisplayedMessages(prev => ({
                ...prev,
                [name]: errorMessage || getRandomSuccess(messageFieldName)
            }));
            setErrorTypes({
                ...errorTypes,
                [name]: errorType
            });
        }

        // Update error state - remove key if no error, add if error exists
        setErrors(prev => {
            const newErrors = { ...prev };
            if (errorMessage) {
                newErrors[name] = errorMessage;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    const handleFocus = (name) => {
        setFocusedField(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions while already processing
        if (isSubmitting) {
            return;
        }

        // Validate all fields
        const newErrors = {};
        const newErrorTypes = {};
        REQUIRED_FIELDS.forEach(field => {
            const { errorType, errorMessage } = validateField(field, formData[field]);
            if (errorMessage) {
                newErrors[field] = errorMessage;
                newErrorTypes[field] = errorType;
            }
        });

        // Mark all required fields as touched
        const allTouched = REQUIRED_FIELDS.reduce((acc, field) => ({ ...acc, [field]: true }), {});
        setTouched(allTouched);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Update displayed messages and error types based on whether type changed
            setDisplayedMessages(prev => {
                const updatedMessages = { ...prev };
                REQUIRED_FIELDS.forEach(field => {
                    const prevErrorType = errorTypes[field];
                    const currentErrorType = newErrorTypes[field];

                    if (newErrors[field]) {
                        // Only update error message if error type changed or no message existed
                        if (!prev[field] || prevErrorType !== currentErrorType) {
                            updatedMessages[field] = newErrors[field];
                        }
                    } else {
                        // If field is valid, ensure it has a success message (only if it didn't have one or was previously an error)
                        if (!prev[field] || prevErrorType) {
                            const messageFieldName = getMessageFieldName(field);
                            updatedMessages[field] = getRandomSuccess(messageFieldName);
                        }
                    }
                });
                return updatedMessages;
            });

            // Update error types for all fields with errors
            setErrorTypes(prev => ({
                ...prev,
                ...newErrorTypes
            }));

            vibrateError();
            showToast(getRandomMessage('form', 'submitError'), 'error');
            return;
        }

        setIsSubmitting(true);

        const consent = localStorage.getItem('privacyConsent');

        const baseData = {
            ...formData
        };

        // Only attach device info if consent is explicitly granted
        if (consent === 'granted') {
            let locationTimezone = null;
            let locationName = '';
            try {
                const cachedLocation = localStorage.getItem('userLocation');
                if (cachedLocation) {
                    const parsed = JSON.parse(cachedLocation);
                    locationTimezone = parsed.timezone;
                    if (parsed.city && parsed.country_name) {
                        locationName = ` (${parsed.city}, ${parsed.country_name})`;
                    }
                }
            } catch (e) {
                console.error('Error reading location for timezone:', e);
            }

            const finalTimezone = locationTimezone
                ? `${locationTimezone}${locationName}`
                : Intl.DateTimeFormat().resolvedOptions().timeZone;

            const deviceInfo = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                timezone: finalTimezone,
                referrer: document.referrer || 'direct'
            };
            Object.assign(baseData, deviceInfo);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(baseData),
            });

            const data = await response.json();

            if (response.ok) {
                vibrateSuccess();
                showToast(getRandomMessage('form', 'submitSuccess'), 'success', 6000);

                // Clear form data
                setFormData({ ...EMPTY_FORM_DATA });

                // Clear sessionStorage
                try {
                    sessionStorage.removeItem('contactFormData');
                } catch (error) {
                    console.error('Error clearing form data from sessionStorage:', error);
                }

                setTouched({});
                setErrors({});
                setErrorTypes({});
                setDisplayedMessages({});
            } else {
                vibrateError();
                showToast(`Uh oh! ${data.error || 'Something went wrong. Even I make mistakes sometimes! 😅'}`, 'error');
            }
        } catch (error) {
            vibrateError();
            console.error('Error submitting form:', error);
            showToast(getRandomMessage('form', 'networkError'), 'error', 7000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCharacterCount = () => {
        const count = formData.message.length;
        const min = 10;
        const max = 100;

        if (count === 0) return { text: "Start typing your epic message! ✍️", color: '#888' };
        if (count < min) return { text: `${min - count} more characters needed. You're almost there! 💪`, color: '#f5576c' };
        if (count >= max) return { text: `Whoa! Maximum reached. Keep it concise! 🎯`, color: '#f5576c' };
        return { text: `${count} characters. Looking good! 👍`, color: '#667eea' };
    };

    return {
        formData,
        errors,
        touched,
        focusedField,
        isSubmitting,
        toasts,
        displayedMessages,
        messagePlaceholder,
        handleChange,
        handleBlur,
        handleFocus,
        handleSubmit,
        removeToast,
        getCharacterCount
    };
};
