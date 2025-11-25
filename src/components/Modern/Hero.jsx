import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="container">
                <div className="hero-content">
                    <motion.img
                        src={assets.profileImage}
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
                        <p className="greeting">{personalInfo.greeting}</p>
                        <h1>{personalInfo.name.first}</h1>
                        <h2>{personalInfo.title}</h2>
                        <div className="hero-buttons">
                            <a href={assets.cvPath} className="btn" download>Download CV</a>
                            <a href="#contact" className="btn btn-secondary">Contact</a>
                        </div>
                        <div className="social-icons">
                            <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                            <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    className="section-arrow"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <a href="#about">
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
