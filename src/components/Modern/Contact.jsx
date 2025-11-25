import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaExclamationTriangle, FaCheckCircle, FaUser, FaPhone, FaBuilding, FaCommentDots } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { personalInfo, socialLinks } from '../../constants/personalInfo';
import { vibrateLight, vibrateError, vibrateSuccess } from '../../utils/vibration';
import { API_BASE_URL } from '../../utils/api';
import { validateIndianPhoneNumber } from '../../utils/phoneValidation';
import { getRandomMessage, getRandomSuccess } from '../../constants/formErrorMessages';
import ToastContainer from './Toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        salutation: '',
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        mobile: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [focusedField, setFocusedField] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [displayedMessages, setDisplayedMessages] = useState({});

    // Helper to get the correct message field name
    const getMessageFieldName = (fieldName) => {
        return fieldName === 'mobile' ? 'phone' : fieldName;
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'salutation':
                if (!value || value.trim() === '') {
                    return getRandomMessage('salutation', 'required');
                }
                return '';
            case 'firstName':
            case 'lastName':
                const fieldName = name === 'firstName' ? 'firstName' : 'lastName';
                if (!value.trim()) {
                    return getRandomMessage(fieldName, 'required');
                }
                if (value.trim().length < 3) {
                    return getRandomMessage(fieldName, 'tooShort');
                }
                if (!/^[A-Za-z]+$/.test(value)) {
                    return getRandomMessage(fieldName, 'invalid');
                }
                return '';
            case 'mobile':
                if (!value.trim()) {
                    return getRandomMessage('phone', 'required');
                }
                const validation = validateIndianPhoneNumber(value);
                if (!validation.isValid) {
                    return validation.error;
                }
                return '';
            case 'email':
                if (!value.trim()) {
                    return getRandomMessage('email', 'required');
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return getRandomMessage('email', 'invalid');
                }
                return '';
            case 'message':
                if (!value.trim()) {
                    return getRandomMessage('message', 'required');
                }
                if (value.trim().length < 10) {
                    return getRandomMessage('message', 'tooShort');
                }
                return '';
            default:
                return '';
        }
    };

    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let processedValue = value;

        // Apply field-specific character restrictions
        if (name === 'firstName' || name === 'lastName') {
            // Only allow a-z and A-Z in name fields
            processedValue = value.replace(/[^a-zA-Z]/g, '');
        } else if (name === 'mobile') {
            // Only allow digits in mobile field
            processedValue = value.replace(/[^0-9]/g, '');
        } else if (name !== 'company' && name !== 'message') {
            // Prevent spaces in all other fields except company and message
            processedValue = value.replace(/\s/g, '');
        }

        setFormData({
            ...formData,
            [name]: processedValue
        });

        if (touched[name]) {
            const error = validateField(name, processedValue);
            const prevError = errors[name];

            // Only update message if validation state changed
            if ((prevError && !error) || (!prevError && error)) {
                const messageFieldName = getMessageFieldName(name);
                setDisplayedMessages(prev => ({
                    ...prev,
                    [name]: error || getRandomSuccess(messageFieldName)
                }));
            }

            setErrors({
                ...errors,
                [name]: error
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({
            ...touched,
            [name]: true
        });
        setFocusedField('');

        const error = validateField(name, value);
        const messageFieldName = getMessageFieldName(name);

        // Set the message on blur (first time field is touched)
        setDisplayedMessages(prev => ({
            ...prev,
            [name]: error || getRandomSuccess(messageFieldName)
        }));

        setErrors({
            ...errors,
            [name]: error
        });
    };

    const handleFocus = (name) => {
        setFocusedField(name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        ['salutation', 'firstName', 'lastName', 'email', 'mobile', 'message'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setTouched({
            salutation: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            message: true
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Generate displayed messages for all fields with errors
            const newDisplayedMessages = {};
            Object.keys(newErrors).forEach(field => {
                newDisplayedMessages[field] = newErrors[field];
            });
            setDisplayedMessages(newDisplayedMessages);

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
                    salutation: formData.salutation,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    mobile: formData.mobile,
                    company: formData.company,
                    message: formData.message,
                    ...deviceInfo
                }),
            });

            const data = await response.json();

            if (response.ok) {
                vibrateSuccess();
                showToast(getRandomMessage('form', 'submitSuccess'), 'success', 6000);
                setFormData({
                    salutation: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    company: '',
                    mobile: '',
                    message: ''
                });
                setTouched({});
                setErrors({});
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
        const max = 1000;

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
                            <label htmlFor="salutation">Salutation *</label>
                            <motion.select
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
                            <label htmlFor="firstName">
                                {inputIcons.firstName} First Name *
                            </label>
                            <motion.input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('firstName')}
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
                            <label htmlFor="lastName">
                                {inputIcons.lastName} Last Name *
                            </label>
                            <motion.input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('lastName')}
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
                            <label htmlFor="email">
                                {inputIcons.email} Email *
                            </label>
                            <motion.input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={() => handleFocus('email')}
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
                            <label htmlFor="company">
                                {inputIcons.company} Company
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                onFocus={() => handleFocus('company')}
                                onBlur={() => setFocusedField('')}
                                style={{
                                    borderColor: focusedField === 'company' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">
                                {inputIcons.mobile} Mobile * (Indian numbers only)
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
                        <label htmlFor="message">
                            {inputIcons.message} Message *
                        </label>
                        <motion.textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => handleFocus('message')}
                            className={errors.message && touched.message ? 'error' : ''}
                            placeholder="Tell me about your project, timeline, or how I can help."
                            maxLength={1000}
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
