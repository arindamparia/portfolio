import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { personalInfo, socialLinks } from '../../constants/personalInfo';
import { vibrateLight, vibrateError, vibrateSuccess } from '../../utils/vibration';

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

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
                }
                if (value.trim().length < 3) {
                    return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 3 characters`;
                }
                if (!/^[A-Za-z\s]+$/.test(value)) {
                    return `${name === 'firstName' ? 'First' : 'Last'} name should only contain letters`;
                }
                return '';
            case 'mobile':
                if (!value.trim()) {
                    return 'Mobile number is required';
                }
                // Remove any spaces or hyphens for validation
                const cleanNumber = value.replace(/[\s-]/g, '');
                if (!/^\d{10}$/.test(cleanNumber)) {
                    return 'Mobile number must be exactly 10 digits';
                }
                // Indian mobile numbers start with 6, 7, 8, or 9
                if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
                    return 'Please enter a valid Indian mobile number';
                }
                return '';
            case 'email':
                if (!value.trim()) {
                    return 'Email is required';
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Please enter a valid email address';
                }
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
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

        const error = validateField(name, value);
        setErrors({
            ...errors,
            [name]: error
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        ['firstName', 'lastName', 'email', 'mobile'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        // Mark all required fields as touched
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            mobile: true
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            vibrateError();
            return;
        }

        // Form is valid
        vibrateSuccess();
        console.log('Form submitted:', formData);
        // Add form submission logic here
    };

    return (
        <section id="contact">
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
                            >
                                <option value="">--None--</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.firstName && touched.firstName ? 'error' : ''}
                            />
                            {errors.firstName && touched.firstName && (
                                <span className="error-message">{errors.firstName}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.lastName && touched.lastName ? 'error' : ''}
                            />
                            {errors.lastName && touched.lastName && (
                                <span className="error-message">{errors.lastName}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.email && touched.email ? 'error' : ''}
                            />
                            {errors.email && touched.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="company">Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile *</label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.mobile && touched.mobile ? 'error' : ''}
                                placeholder="10-digit Indian mobile number"
                            />
                            {errors.mobile && touched.mobile && (
                                <span className="error-message">{errors.mobile}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me about your project, timeline, or how I can help."
                        />
                    </div>

                    <div className="form-submit">
                        <button type="submit" className="btn">Send Message</button>
                    </div>
                </motion.form>
            </div>
        </section>
    );
};

export default Contact;
