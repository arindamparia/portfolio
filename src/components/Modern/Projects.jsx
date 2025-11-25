import React from 'react';
import { motion } from 'framer-motion';
import { VscChevronDown } from 'react-icons/vsc';

const Projects = () => {
    const projects = [
        {
            name: 'Minimalist Portfolio',
            image: 'https://via.placeholder.com/350x250',
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        {
            name: 'Adaptive Cards for LWC',
            image: 'https://via.placeholder.com/350x250',
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        {
            name: 'Unsplash Image Gallery',
            image: 'https://via.placeholder.com/350x250',
            github: 'https://github.com',
            demo: 'https://example.com'
        }
    ];

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
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            className="project-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img src={project.image} alt={project.name} className="project-image" />
                            <div className="project-info">
                                <h3>{project.name}</h3>
                                <div className="project-buttons">
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                        Github
                                    </a>
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn">
                                        Live Demo
                                    </a>
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
                    <a href="#contact">
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
