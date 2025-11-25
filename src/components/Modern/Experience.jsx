import React from 'react';
import { motion } from 'framer-motion';
import { experienceData } from '../../data/experience';

const Experience = () => {
    return (
        <section id="experience">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Experience
                </motion.h2>
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {experienceData.map((exp, index) => (
                        <div key={index} className="timeline-item">
                            <span className="timeline-date">{exp.period}</span>
                            <h3>{exp.role}</h3>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>{exp.company}</h4>

                            {exp.projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: '1.5rem' }}>
                                    <h5 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{proj.name}</h5>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        <strong>Focus:</strong> {proj.focus}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {proj.details}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Experience;
