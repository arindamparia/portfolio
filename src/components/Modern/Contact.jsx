import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaExclamationTriangle, FaCheckCircle, FaUser, FaPhone, FaBuilding, FaCommentDots } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { personalInfo, socialLinks } from '../../constants/personalInfo';
import { vibrateLight, vibrateError, vibrateSuccess } from '../../utils/vibration';
import { API_BASE_URL } from '../../utils/api';
import { validateIndianPhoneNumber } from '../../utils/phoneValidation';
import { getRandomMessage, getRandomSuccess } from '../../constants/formErrorMessages';
import { FIELD_LIMITS } from '../../utils/contactValidation';
import ToastContainer from './Toast';
import AnimatedEye from '../Shared/AnimatedEye';
import InteractiveBackground from '../Shared/InteractiveBackground';

// Constants
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

const Contact = () => {
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

    // Refs for input fields to track cursor position for animated eyes
    const salutationRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const companyRef = useRef(null);
    const mobileRef = useRef(null);
    const messageRef = useRef(null);

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
        const messageFieldName = getMessageFieldName(name);

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

    // Helper to get border color based on field state
    const getBorderColor = (fieldName) => {
        if (errors[fieldName] && touched[fieldName]) return '#f5576c';
        if (!errors[fieldName] && touched[fieldName] && formData[fieldName]) return '#4ade80';
        if (focusedField === fieldName) return 'var(--accent-primary)';
        return undefined;
    };

    // Common animation props for shake effect on error
    const getShakeAnimation = (fieldName) => ({
        x: errors[fieldName] && touched[fieldName] ? [0, -10, 10, -10, 10, 0] : 0
    });

    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now();
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

            // Always update error state to reflect current validation
            if (errors[name] !== errorMessage) {
                setErrors({
                    ...errors,
                    [name]: errorMessage
                });
            }
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

        // Only update errors if the error value actually changed
        if (errors[name] !== errorMessage) {
            setErrors({
                ...errors,
                [name]: errorMessage
            });
        }
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
                Object.keys(newErrors).forEach(field => {
                    const prevErrorType = errorTypes[field];
                    const currentErrorType = newErrorTypes[field];

                    // Only update message if field doesn't have one OR if error type changed
                    if (!prev[field] || prevErrorType !== currentErrorType) {
                        updatedMessages[field] = newErrors[field];
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

        const deviceInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'direct'
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    ...deviceInfo
                }),
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

    const characterInfo = getCharacterCount();

    const inputIcons = {
        firstName: <FaUser />,
        lastName: <FaUser />,
        email: <FaEnvelope />,
        mobile: <FaPhone />,
        company: <FaBuilding />,
        message: <FaCommentDots />
    };

    return (
        <section id="contact" style={{ paddingBottom: '4rem' }}>
            <InteractiveBackground variant="aurora" colorScheme="blue" intensity={0.5} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="container">
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Get in Touch
                </motion.p>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Contact Me
                </motion.h2>

                <motion.div
                    className="contact-info"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <a href={`mailto:${personalInfo.email}`} className="contact-link">
                        <FaEnvelope /> {personalInfo.email}
                    </a>
                    <a href={`tel:${personalInfo.phone}`} className="contact-link">
                        📱 {personalInfo.phone}
                    </a>
                </motion.div>
                <motion.div
                    className="social-links"
                    style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" className="social-link-button" onClick={vibrateLight}>
                        <FaGithub /> {socialLinks.github.label}
                    </a>
                    <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" className="social-link-button" onClick={vibrateLight}>
                        <FaLinkedin /> {socialLinks.linkedin.label}
                    </a>
                    <a href={socialLinks.leetcode.url} target="_blank" rel="noopener noreferrer" className="social-link-button" onClick={vibrateLight}>
                        <SiLeetcode /> {socialLinks.leetcode.label}
                    </a>
                </motion.div>

                <motion.form
                    className="contact-form"
                    onSubmit={handleSubmit}
                    noValidate
                    style={{ marginTop: '3rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="salutation">
                                Salutation *
                            </label>
                            <motion.select
                                ref={salutationRef}
                                id="salutation"
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('salutation')}
                                className={errors.salutation && touched.salutation ? 'error' : ''}
                                style={{
                                    borderColor:
                                        errors.salutation && touched.salutation ? '#f5576c' :
                                        !errors.salutation && touched.salutation && formData.salutation ? '#4ade80' :
                                        focusedField === 'salutation' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                                animate={{
                                    x: errors.salutation && touched.salutation ? [0, -10, 10, -10, 10, 0] : 0
                                }}
                                transition={{ duration: 0.4 }}
                            >
                                <option value="">--None--</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                            </motion.select>
                            <AnimatePresence>
                                {errors.salutation && touched.salutation && (
                                    <motion.span
                                        className="error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <FaExclamationTriangle /> {displayedMessages.salutation || errors.salutation}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.salutation && touched.salutation && formData.salutation && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> {displayedMessages.salutation || getRandomSuccess('salutation')}
                                </motion.span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {inputIcons.firstName} First Name *
                                <AnimatedEye isOpen={!!formData.firstName} inputRef={firstNameRef} size="1.5rem" />
                            </label>
                            <motion.input
                                ref={firstNameRef}
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('firstName')}
                                maxLength={30}
                                className={errors.firstName && touched.firstName ? 'error' : ''}
                                style={{
                                    borderColor:
                                        errors.firstName && touched.firstName ? '#f5576c' :
                                        !errors.firstName && touched.firstName && formData.firstName ? '#4ade80' :
                                        focusedField === 'firstName' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                                animate={{
                                    x: errors.firstName && touched.firstName ? [0, -10, 10, -10, 10, 0] : 0
                                }}
                                transition={{ duration: 0.4 }}
                            />
                            <AnimatePresence>
                                {errors.firstName && touched.firstName && (
                                    <motion.span
                                        className="error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <FaExclamationTriangle /> {displayedMessages.firstName || errors.firstName}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.firstName && touched.firstName && formData.firstName && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> {displayedMessages.firstName || getRandomSuccess('firstName')}
                                </motion.span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="lastName" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {inputIcons.lastName} Last Name *
                                <AnimatedEye isOpen={!!formData.lastName} inputRef={lastNameRef} size="1.5rem" />
                            </label>
                            <motion.input
                                ref={lastNameRef}
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('lastName')}
                                maxLength={30}
                                className={errors.lastName && touched.lastName ? 'error' : ''}
                                style={{
                                    borderColor:
                                        errors.lastName && touched.lastName ? '#f5576c' :
                                        !errors.lastName && touched.lastName && formData.lastName ? '#4ade80' :
                                        focusedField === 'lastName' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                                animate={{
                                    x: errors.lastName && touched.lastName ? [0, -10, 10, -10, 10, 0] : 0
                                }}
                                transition={{ duration: 0.4 }}
                            />
                            <AnimatePresence>
                                {errors.lastName && touched.lastName && (
                                    <motion.span
                                        className="error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <FaExclamationTriangle /> {displayedMessages.lastName || errors.lastName}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.lastName && touched.lastName && formData.lastName && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> {displayedMessages.lastName || getRandomSuccess('lastName')}
                                </motion.span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {inputIcons.email} Email *
                                <AnimatedEye isOpen={!!formData.email} inputRef={emailRef} size="1.5rem" />
                            </label>
                            <motion.input
                                ref={emailRef}
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('email')}
                                maxLength={80}
                                className={errors.email && touched.email ? 'error' : ''}
                                style={{
                                    borderColor:
                                        errors.email && touched.email ? '#f5576c' :
                                        !errors.email && touched.email && formData.email ? '#4ade80' :
                                        focusedField === 'email' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                                animate={{
                                    x: errors.email && touched.email ? [0, -10, 10, -10, 10, 0] : 0
                                }}
                                transition={{ duration: 0.4 }}
                            />
                            <AnimatePresence>
                                {errors.email && touched.email && (
                                    <motion.span
                                        className="error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <FaExclamationTriangle /> {displayedMessages.email || errors.email}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.email && touched.email && formData.email && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> {displayedMessages.email || getRandomSuccess('email')}
                                </motion.span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="company" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {inputIcons.company} Company
                                <AnimatedEye isOpen={!!formData.company} inputRef={companyRef} size="1.5rem" />
                            </label>
                            <input
                                ref={companyRef}
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                onFocus={() => handleFocus('company')}
                                onBlur={() => setFocusedField('')}
                                maxLength={80}
                                style={{
                                    borderColor: focusedField === 'company' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {inputIcons.mobile} Mobile * (Indian numbers only)
                                <AnimatedEye isOpen={!!formData.mobile} inputRef={mobileRef} size="1.5rem" />
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#888',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }}>
                                    +91
                                </span>
                                <motion.input
                                    ref={mobileRef}
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onFocus={() => handleFocus('mobile')}
                                    className={errors.mobile && touched.mobile ? 'error' : ''}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    style={{
                                        paddingLeft: '3.5rem',
                                        borderColor:
                                            errors.mobile && touched.mobile ? '#f5576c' :
                                            !errors.mobile && touched.mobile && formData.mobile ? '#4ade80' :
                                            focusedField === 'mobile' ? 'var(--accent-primary)' : undefined,
                                        transition: 'all 0.3s ease'
                                    }}
                                    animate={{
                                        x: errors.mobile && touched.mobile ? [0, -10, 10, -10, 10, 0] : 0
                                    }}
                                    transition={{ duration: 0.4 }}
                                />
                            </div>
                            <AnimatePresence>
                                {errors.mobile && touched.mobile && (
                                    <motion.span
                                        className="error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <FaExclamationTriangle /> {displayedMessages.mobile || errors.mobile}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.mobile && touched.mobile && formData.mobile && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> {displayedMessages.mobile || getRandomSuccess('phone')}
                                </motion.span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {inputIcons.message} Message *
                            <AnimatedEye isOpen={!!formData.message} inputRef={messageRef} size="1.5rem" />
                        </label>
                        <motion.textarea
                            ref={messageRef}
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus('message')}
                            className={errors.message && touched.message ? 'error' : ''}
                            placeholder="Tell me about your project, timeline, or how I can help."
                            maxLength={100}
                            style={{
                                borderColor:
                                    errors.message && touched.message ? '#f5576c' :
                                    !errors.message && touched.message && formData.message ? '#4ade80' :
                                    focusedField === 'message' ? 'var(--accent-primary)' : undefined,
                                transition: 'all 0.3s ease'
                            }}
                            animate={{
                                x: errors.message && touched.message ? [0, -10, 10, -10, 10, 0] : 0
                            }}
                            transition={{ duration: 0.4 }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                            <AnimatePresence>
                                {errors.message && touched.message && (
                                    <motion.span
                                        className="error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <FaExclamationTriangle /> {displayedMessages.message || errors.message}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    fontSize: '0.85rem',
                                    color: characterInfo.color,
                                    marginLeft: 'auto',
                                    fontWeight: '500'
                                }}
                            >
                                {characterInfo.text}
                            </motion.span>
                        </div>
                        {!errors.message && touched.message && formData.message && formData.message.length >= 10 && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                            >
                                <FaCheckCircle /> {displayedMessages.message || getRandomSuccess('message')}
                            </motion.span>
                        )}
                    </div>

                    <div className="form-submit">
                        <motion.button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                    >
                                        ⏳
                                    </motion.span>
                                    Sending...
                                </>
                            ) : (
                                'Send Message'
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </section>
    );
};

export default Contact;
