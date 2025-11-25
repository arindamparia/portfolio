import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { experienceData } from '../../data/experience';
import { educationData } from '../../data/education';
import { personalInfo, assets } from '../../constants/personalInfo';
import { vibrateMedium } from '../../utils/vibration';

const About = () => {
    // Get the most recent experience
    const recentExperience = experienceData[0];
    const primaryEducation = educationData[0];

    // Calculate years of experience
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - startYear + 1;

    return (
        <section id="about">
            <div className="container">
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Get To Know More
                </motion.p>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    About Me
                </motion.h2>
                <div className="about-content">
                    <motion.img
                        src={assets.aboutImage}
                        alt="About"
                        className="about-image"
                        loading="lazy"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    />
                    <motion.div
                        className="about-info"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-card-icon">
                                    <FaBriefcase />
                                </div>
                                <h3>Experience</h3>
                                <p>{yearsOfExperience}+ years<br />{recentExperience.role}</p>
                            </div>
                            <div className="info-card">
                                <div className="info-card-icon">
                                    <FaGraduationCap />
                                </div>
                                <h3>Education</h3>
                                <p>{primaryEducation.degree}<br />{primaryEducation.institution}</p>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            {personalInfo.about} Currently working at {recentExperience.company}, with a strong foundation in backend development,
                            microservices architecture, and enterprise solutions.
                        </p>
                    </motion.div>
                </div>
                <motion.div
                    className="section-arrow"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <a href="#skills" onClick={vibrateMedium}>
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
