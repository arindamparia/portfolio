import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { educationData } from '../../data/education';
import { vibrateMedium } from '../../utils/vibration';
import InteractiveBackground from '../Shared/InteractiveBackground';

const Education = () => {
    return (
        <section id="education">
            <InteractiveBackground variant="gradient" colorScheme="pink" intensity={0.5} />
            <div className="container">
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    My Academic Journey
                </motion.p>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Education
                </motion.h2>
                <div className="education-grid">
                    {educationData.map((edu, index) => (
                        <motion.div
                            key={index}
                            className="education-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="education-icon">
                                <FaGraduationCap />
                            </div>
                            <span className="education-year">{edu.year}</span>
                            <h3 className="education-degree">{edu.degree}</h3>
                            <h4 className="education-institution">{edu.institution}</h4>
                            <p className="education-details">{edu.details}</p>
                        </motion.div>
                    ))}
                </div>
                <motion.div
                    className="section-arrow"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <a href="#certifications" onClick={vibrateMedium}>
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Education;
