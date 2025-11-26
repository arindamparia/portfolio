import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';
import { vibrateMedium, vibrateLight } from '../../utils/vibration';
import InteractiveBackground from '../Shared/InteractiveBackground';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <InteractiveBackground variant="universe" colorScheme="purple" intensity={0.7} />
            <div className="container">
                <div className="hero-content">
                    <motion.img
                        src={assets.profileImage}
                        alt={`${personalInfo.name.full} - ${personalInfo.title}`}
                        className="profile-image"
                        loading="lazy"
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
                            <a href={assets.cvPath} className="btn" download onClick={vibrateLight}>Download CV</a>
                            <a href="#contact" className="btn btn-secondary" onClick={vibrateLight}>Contact</a>
                        </div>
                        <div className="social-icons">
                            <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight}>
                                <FaLinkedin />
                            </a>
                            <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight}>
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
                    <a href="#about" onClick={vibrateMedium}>
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
