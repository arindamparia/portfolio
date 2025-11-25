import React from 'react';
import { motion } from 'framer-motion';
import { educationData } from '../../data/education';

const Education = () => {
    return (
        <section id="about">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Education
                </motion.h2>
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {educationData.map((edu, index) => (
                        <div key={index} className="timeline-item">
                            <span className="timeline-date">{edu.year}</span>
                            <h3>{edu.degree}</h3>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>{edu.institution}</h4>
                            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                {edu.details}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Education;
