import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaExclamationTriangle, FaCheckCircle, FaUser, FaPhone, FaBuilding, FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { personalInfo, socialLinks } from '../../constants/personalInfo';
import { vibrateLight } from '../../utils/vibration';
import ToastContainer from './Toast';
import AnimatedEye from '../Shared/AnimatedEye';
import { useContactForm } from '../../hooks/useContactForm';

const Contact = () => {
    const {
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
    } = useContactForm();

    // Refs for input fields to track cursor position for animated eyes
    const salutationRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const companyRef = useRef(null);
    const mobileRef = useRef(null);
    const messageRef = useRef(null);

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
                                    <FaCheckCircle /> {displayedMessages.salutation}
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
                                    <FaCheckCircle /> {displayedMessages.firstName}
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
                                    <FaCheckCircle /> {displayedMessages.lastName}
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
                                type="text"
                                inputMode="email"
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
                                    <FaCheckCircle /> {displayedMessages.email}
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
                                onBlur={() => handleFocus('')}
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
                            <div style={{ position: 'relative', width: '100%' }}>
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
                                        width: '100%',
                                        paddingLeft: '3.5rem',
                                        borderColor:
                                            errors.mobile && touched.mobile ? '#f5576c' :
                                                !errors.mobile && touched.mobile && formData.mobile ? '#4ade80' :
                                                    focusedField === 'mobile' ? 'var(--accent-primary)' : undefined,
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
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
                                    <FaCheckCircle /> {displayedMessages.mobile}
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
                            placeholder={messagePlaceholder}
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
                                    fontWeight: '500'
                                }}
                            >
                                {characterInfo.text}
                            </motion.span>
                        </div>
                    </div>

                    <div className="form-submit">
                        <motion.button
                            type="submit"
                            className="btn btn-elegant"
                            whileHover="hover"
                            whileTap="tap"
                            disabled={isSubmitting}
                            style={{
                                opacity: isSubmitting ? 0.8 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <span style={{ position: 'relative', zIndex: 2 }}>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </span>
                            <AnimatePresence>
                                {!isSubmitting && (
                                    <motion.span
                                        key="send-icon"
                                        style={{ display: 'inline-block', marginLeft: '8px', position: 'relative', zIndex: 2 }}
                                        initial={{ opacity: 0, scale: 0.5, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                        exit={{
                                            x: 50,
                                            y: -50,
                                            opacity: 0,
                                            scale: 0.5,
                                            transition: { duration: 0.4, ease: "backIn" }
                                        }}
                                        variants={{
                                            hover: { x: 4, y: -4, opacity: 1 },
                                            tap: { x: 0, y: 0 }
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <FaPaperPlane size={14} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </section>
    );
};

export default Contact;
