import React from 'react';
import { motion } from 'framer-motion';
import { VscChevronDown } from 'react-icons/vsc';
import { projectsData } from '../../data/projects';
import { vibrateMedium } from '../../utils/vibration';

const Projects = () => {
    return (
        <section id="projects">
            <div className="container">
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Browse My Recent
                </motion.p>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Projects
                </motion.h2>
                <div className="projects-grid">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={index}
                            className="project-card"
                            initial={{ y: 20 }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img src="https://via.placeholder.com/350x250" alt={`${project.name} - ${project.description}`} className="project-image" loading="lazy" />
                            <div className="project-info">
                                <h3>{project.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {project.tech.map((t, i) => (
                                        <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(0, 0, 0, 0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>{t}</span>
                                    ))}
                                </div>
                            </div>
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
                    <a href="#contact" onClick={vibrateMedium}>
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
