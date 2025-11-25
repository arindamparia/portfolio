import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <section id="contact">
            <div className="container">
                <motion.div
                    className="contact-content"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">Get In Touch</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    <a href="mailto:arindamparia321@gmail.com" className="btn">Say Hello</a>

                    <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                        <a href="tel:+919064175719" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📱</span> +91 9064175719
                        </a>
                    </div>

                    <div className="social-links">
                        <a href="https://github.com/arindamparia" target="_blank" rel="noopener noreferrer" className="social-link">
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/arindam-paria-557170191/" target="_blank" rel="noopener noreferrer" className="social-link">
                            LinkedIn
                        </a>
                        <a href="https://leetcode.com/u/ARINDAM9064/" target="_blank" rel="noopener noreferrer" className="social-link">
                            LeetCode
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
