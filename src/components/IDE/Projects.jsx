import React from 'react';
import { motion } from 'framer-motion';
import { projectsData } from '../../data/projects';

const Projects = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ color: '#6a9955', marginBottom: '1rem' }}>// My Projects Collection</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {projectsData.map((project, index) => (
                        <div key={index} style={{ background: '#2d2d2d', borderRadius: '8px', overflow: 'hidden', border: '1px solid #3e3e42' }}>
                            <div style={{ background: '#3e3e42', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', color: '#e8e8e8' }}>{project.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#858585' }}>{project.type}</span>
                            </div>
                            <div style={{ padding: '1rem', fontFamily: 'var(--font-code)' }}>
                                <p style={{ color: '#569cd6' }}>const <span style={{ color: '#9cdcfe' }}>project</span> = {'{'}</p>
                                <div style={{ paddingLeft: '1.5rem' }}>
                                    <p><span style={{ color: '#9cdcfe' }}>description</span>: <span style={{ color: '#ce9178' }}>"{project.description}"</span>,</p>
                                    <p><span style={{ color: '#9cdcfe' }}>technologies</span>: [</p>
                                    <div style={{ paddingLeft: '1.5rem' }}>
                                        {project.tech.map((t, i) => (
                                            <span key={i} style={{ color: '#ce9178' }}>"{t}"{i < project.tech.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </div>
                                    <p>]</p>
                                </div>
                                <p>{'};'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Projects;
