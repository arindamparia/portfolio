import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaExclamationTriangle, FaCheckCircle, FaUser, FaPhone, FaBuilding, FaCommentDots } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { personalInfo, socialLinks } from '../../constants/personalInfo';
import { vibrateLight, vibrateError, vibrateSuccess } from '../../utils/vibration';
import { API_BASE_URL } from '../../utils/api';
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

    // Sarcastic error messages
    const sarcasticMessages = {
        firstName: [
            "Your name is required, unless you're a secret agent 🕵️",
            "Come on, even anonymous users have names!",
            "First name? Or should I call you 'User123'?",
            "I promise I won't sell your name... probably 😏"
        ],
        lastName: [
            "Last name too! Don't be shy 😊",
            "One name isn't enough, you're not Madonna!",
            "Surname please? Or are you royalty? 👑",
            "Your last name won't bite, I promise!"
        ],
        email: [
            "Email please! Carrier pigeons are so last century 🐦",
            "How else will I spam... I mean, contact you? 📧",
            "No email = no reply. Simple math! 🤷",
            "Your email address, please? I left my crystal ball at home 🔮"
        ],
        mobile: [
            "Phone number? Don't worry, I won't call at 3 AM... maybe 😈",
            "10 digits please! Your cat's paws won't work here 🐱",
            "A valid number would be nice, unlike my life choices 📱",
            "Mobile number required! Smoke signals don't count 💨"
        ],
        message: [
            "Message field is emptier than my fridge! 🍕",
            "Say something! Anything! Even 'Hi' works! 👋",
            "10 characters minimum. You can do better than 'ok' 💪",
            "Don't leave me hanging! Type something interesting 🎭"
        ],
        nameTooShort: [
            "That's a bit short, isn't it? Are you a spy? 🕶️",
            "3 characters minimum! This isn't Twitter 🐦",
            "Your name is longer than that... right? 🤔"
        ],
        nameInvalid: [
            "Letters only please! Numbers belong in passwords 🔢",
            "Is that really your name? Seems kinda... digital 🤖",
            "Nice try, but emojis aren't names... yet 😅"
        ],
        mobileInvalid: [
            "That doesn't look like a valid Indian number 🇮🇳",
            "10 digits starting with 6, 7, 8, or 9. It's not rocket science! 🚀",
            "Are you sure that's your number? Seems suspicious 🤨"
        ],
        emailInvalid: [
            "That email looks faker than my enthusiasm on Monday mornings ☕",
            "Please enter a REAL email address. I'm begging you 🙏",
            "Email format: something@somewhere.com. You got this! 💡"
        ]
    };

    const getRandomMessage = (type) => {
        const messages = sarcasticMessages[type];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    return getRandomMessage(name);
                }
                if (value.trim().length < 3) {
                    return getRandomMessage('nameTooShort');
                }
                if (!/^[A-Za-z]+$/.test(value)) {
                    return getRandomMessage('nameInvalid');
                }
                return '';
            case 'mobile':
                if (!value.trim()) {
                    return getRandomMessage('mobile');
                }
                const cleanNumber = value.replace(/[\s-]/g, '');
                if (!/^\d{10}$/.test(cleanNumber)) {
                    return "10 digits please! Not 9, not 11... exactly 10! 🔟";
                }
                if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
                    return getRandomMessage('mobileInvalid');
                }
                return '';
            case 'email':
                if (!value.trim()) {
                    return getRandomMessage('email');
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return getRandomMessage('emailInvalid');
                }
                return '';
            case 'message':
                if (!value.trim()) {
                    return getRandomMessage('message');
                }
                if (value.trim().length < 10) {
                    return getRandomMessage('message');
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

        // Prevent spaces in all fields except company and message
        let processedValue = value;
        if (name !== 'company' && name !== 'message') {
            processedValue = value.replace(/\s/g, '');
        }

        setFormData({
            ...formData,
            [name]: processedValue
        });

        if (touched[name]) {
            const error = validateField(name, processedValue);
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
        ['firstName', 'lastName', 'email', 'mobile', 'message'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            message: true
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            vibrateError();
            showToast("Oops! Some fields need your attention 🤦", 'error');
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
                    mobile: `+91${formData.mobile}`,
                    company: formData.company,
                    message: formData.message,
                    ...deviceInfo
                }),
            });

            const data = await response.json();

            if (response.ok) {
                vibrateSuccess();
                showToast("🎉 Success! Your message was sent. I'll get back to you faster than you can say 'JavaScript'!", 'success', 6000);
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
            } else {
                vibrateError();
                showToast(`Uh oh! ${data.error || 'Something went wrong. Even I make mistakes sometimes! 😅'}`, 'error');
            }
        } catch (error) {
            vibrateError();
            console.error('Error submitting form:', error);
            showToast("Network error! Check if the server is running, or if your internet is just playing hide and seek 🙈", 'error', 7000);
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
                    style={{ marginTop: '3rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="salutation">Salutation</label>
                            <select
                                id="salutation"
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleChange}
                                style={{
                                    borderColor: focusedField === 'salutation' ? 'var(--accent-primary)' : undefined,
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={() => handleFocus('salutation')}
                                onBlur={() => setFocusedField('')}
                            >
                                <option value="">--None--</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                            </select>
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
                                        <FaExclamationTriangle /> {errors.firstName}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.firstName && touched.firstName && formData.firstName && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> Perfect!
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
                                        <FaExclamationTriangle /> {errors.lastName}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.lastName && touched.lastName && formData.lastName && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> Awesome!
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
                                        <FaExclamationTriangle /> {errors.email}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.email && touched.email && formData.email && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> Great!
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
                                        <FaExclamationTriangle /> {errors.mobile}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {!errors.mobile && touched.mobile && formData.mobile && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}
                                >
                                    <FaCheckCircle /> Excellent!
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
                                        <FaExclamationTriangle /> {errors.message}
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
                                <FaCheckCircle /> Looking forward to reading this!
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
