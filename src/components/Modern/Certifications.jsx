import React from 'react';
import { motion } from 'framer-motion';
import { FaCertificate } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';
import { certificationsData } from '../../data/certifications';
import { vibrateMedium } from '../../utils/vibration';
import InteractiveBackground from '../Shared/InteractiveBackground';

const Certifications = () => {
    return (
        <section id="certifications" style={{ background: 'var(--bg-secondary)' }}>
            <InteractiveBackground variant="gradient" colorScheme="purple" intensity={0.2} />
            <div className="container">
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Professional Credentials
                </motion.p>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Certifications
                </motion.h2>
                <div className="education-grid">
                    {certificationsData.map((cert, index) => (
                        <motion.div
                            key={index}
                            className="education-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="education-icon">
                                <FaCertificate />
                            </div>
                            <span className="education-year">{cert.year}</span>
                            <h3 className="education-degree">{cert.name}</h3>
                            <h4 className="education-institution">{cert.issuer}</h4>
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
                    <a href="#projects" onClick={vibrateMedium}>
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Certifications;
