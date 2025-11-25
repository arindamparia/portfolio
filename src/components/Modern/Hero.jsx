import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="container">
                <div className="hero-content">
                    <motion.img
                        src="https://via.placeholder.com/400"
                        alt="Profile"
                        className="profile-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <p className="greeting">Hello, I'm</p>
                        <h1>Arindam</h1>
                        <h2>Software Engineer</h2>
                        <div className="hero-buttons">
                            <a href="/cv.pdf" className="btn" download>Download CV</a>
                            <a href="#contact" className="btn btn-secondary">Contact</a>
                        </div>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/arindam-paria-557170191/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                            <a href="https://github.com/arindamparia" target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
