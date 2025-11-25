import React from 'react';
import { motion } from 'framer-motion';

const Certifications = () => {
    const certifications = [
        {
            name: 'Salesforce Certified Agentforce Specialist',
            year: '2025',
            issuer: 'Salesforce'
        },
        {
            name: 'Salesforce Certified AI Associate',
            year: '2024',
            issuer: 'Salesforce'
        },
        {
            name: 'AWS Accreditation (Technical) Certificate',
            year: '2024',
            issuer: 'Amazon Web Services'
        },
        {
            name: 'Certificate of Completion: Spring Boot',
            year: '2024',
            issuer: 'Udemy'
        }
    ];

    return (
        <section id="certifications" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Certifications
                </motion.h2>
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {certifications.map((cert, index) => (
                        <div key={index} className="timeline-item" style={{ marginBottom: index === certifications.length - 1 ? 0 : '2rem' }}>
                            <span className="timeline-date">{cert.year}</span>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{cert.name}</h3>
                            {cert.issuer && <p style={{ color: 'var(--text-secondary)' }}>{cert.issuer}</p>}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Certifications;
