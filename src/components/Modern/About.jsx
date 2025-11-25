import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';

const About = () => {
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
                        src="https://via.placeholder.com/300x400"
                        alt="About"
                        className="about-image"
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
                                <p>5+ years<br />Salesforce Development</p>
                            </div>
                            <div className="info-card">
                                <div className="info-card-icon">
                                    <FaGraduationCap />
                                </div>
                                <h3>Education</h3>
                                <p>B.E. Electronics<br />MBA Marketing</p>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            Experienced Salesforce Developer with 5+ years delivering robust solutions across Sales,
                            Service, and Experience Clouds. Expert in Apex, LWC, Flows, and Integration, with a
                            proven track record of automating processes and optimizing performance. Skilled in CI/CD
                            (Copado/Git), Adaptive Card UI, and Conga Composer automation.
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
                    <a href="#experience">
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
