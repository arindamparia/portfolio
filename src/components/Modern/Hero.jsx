import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';
import { vibrateMedium, vibrateLight } from '../../utils/vibration';
import InteractiveBackground from '../Shared/InteractiveBackground';
import MatrixBackground from '../Shared/MatrixBackground';
import Clock from '../Shared/Clock';
import IndianEvent from '../Shared/IndianEvent';
import useSunCycle from '../../hooks/useSunCycle';
import { useViewMode } from '../../hooks/useViewMode';

const Hero = () => {
    const { cycle, isDay, solarData } = useSunCycle();
    const { viewMode } = useViewMode();

    // Determine color scheme based on cycle
    const getHeroColorScheme = () => {
        switch (cycle) {
            case 'dawn':
            case 'early-morning':
                return 'pink';
            case 'day':
            case 'morning':
            case 'late-morning':
            case 'noon':
            case 'early-afternoon':
                return 'blue';
            case 'afternoon':
            case 'late-afternoon':
            case 'dusk':
                return 'orange';
            case 'blue-hour':
            case 'blue-hour-morning':
                return 'teal';
            case 'pre-dawn':
            case 'early-night':
            case 'night':
            default:
                return 'purple';
        }
    };

    return (
        <section id="home" className="hero">
            {viewMode === 'hacker' ? (
                <MatrixBackground />
            ) : (
                <InteractiveBackground
                    variant="universe"
                    colorScheme={getHeroColorScheme()}
                    intensity={isDay ? 0.3 : 0.5}
                    cycle={cycle}
                />
            )}
            {/* Clock positioned at top-left corner */}
            <div style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                zIndex: 10
            }}>
                <Clock solarData={solarData} cycle={cycle} />
            </div>
            <div className="container">
                <div className="hero-content">
                    <motion.img
                        src={assets.profileImage}
                        alt={`${personalInfo.name.full} - ${personalInfo.title}`}
                        className="profile-image"
                        fetchPriority="high"
                        width="400"
                        height="400"
                        // Removed loading="lazy" as this is the LCP element
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
                    />
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <p className="greeting">{viewMode === 'hacker' ? '> ' : ''}{personalInfo.greeting}</p>
                        <h1>{personalInfo.name.first}</h1>
                        <h2>
                            {personalInfo.title}
                            {viewMode === 'hacker' && (
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    style={{ color: 'var(--modern-accent-primary)' }}
                                >_</motion.span>
                            )}
                        </h2>
                        <div className="hero-buttons">
                            <motion.a 
                                href={assets.cvPath} 
                                className="btn" 
                                download 
                                onClick={vibrateLight}
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255,255,255,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Download CV
                            </motion.a>
                            <motion.a 
                                href="#contact" 
                                className="btn btn-secondary" 
                                onClick={vibrateLight}
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255,255,255,0.3)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Contact
                            </motion.a>
                        </div>
                        <div className="social-icons">
                            <motion.a 
                                href={socialLinks.linkedin.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={vibrateLight} 
                                aria-label="LinkedIn Profile"
                                whileHover={{ scale: 1.2, color: "#0077b5" }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaLinkedin />
                            </motion.a>
                            <motion.a 
                                href={socialLinks.github.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={vibrateLight} 
                                aria-label="GitHub Profile"
                                whileHover={{ scale: 1.2, color: "#6cc644" }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaGithub />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
                <IndianEvent />
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
        </section >
    );
};

export default Hero;
