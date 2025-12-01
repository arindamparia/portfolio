import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';
import { vibrateMedium, vibrateLight } from '../../utils/vibration';
import InteractiveBackground from '../Shared/InteractiveBackground';
import Clock from '../Shared/Clock';
import IndianEvent from '../Shared/IndianEvent';
import useSunCycle from '../../hooks/useSunCycle';

const Hero = () => {
    const { cycle, isDay, solarData } = useSunCycle();

    // Determine color scheme based on cycle
    const getHeroColorScheme = () => {
        switch (cycle) {
            case 'dawn':
                return 'pink';
            case 'day':
                return 'blue';
            case 'dusk':
                return 'orange';
            case 'blue-hour':
                return 'teal';
            case 'night':
            default:
                return 'purple';
        }
    };

    return (
        <section id="home" className="hero">
            <InteractiveBackground
                variant="universe"
                colorScheme={getHeroColorScheme()}
                intensity={isDay ? 0.3 : 0.5}
                cycle={cycle}
            />
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
                        // Simplified animation to prevent delaying LCP
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
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
                            <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight} aria-label="LinkedIn Profile">
                                <FaLinkedin />
                            </a>
                            <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" onClick={vibrateLight} aria-label="GitHub Profile">
                                <FaGithub />
                            </a>
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
