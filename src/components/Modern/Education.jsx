import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { educationData } from '../../data/education';

const Education = () => {
    return (
        <section id="education">
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
            </div>
        </section>
    );
};

export default Education;
