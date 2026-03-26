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
                            key={project.name}
                            className={`project-card ${project.featured ? 'featured' : ''}`}
                            initial={{ y: 20 }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img src={project.image || "https://via.placeholder.com/350x250"} alt={`${project.name} - ${project.description}`} className="project-image" loading="lazy" />
                            <div className="project-info">
                                <h3>{project.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description}</p>
                                <div className="tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: project.featured ? 'flex-start' : 'center' }}>
                                    {project.tech.map((t, i) => (
                                        <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: '500' }}>{t}</span>
                                    ))}
                                </div>
                                {(project.live || project.github) && (
                                    <div className="project-buttons" style={{ justifyContent: project.featured ? 'flex-start' : 'center', marginTop: 'auto' }}>
                                        {project.live && (
                                            <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                                                Live Demo
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                )}
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
