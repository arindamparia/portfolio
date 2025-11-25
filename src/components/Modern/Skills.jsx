import React from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../../data/skills';

const Skills = () => {
    // Flatten skills for grid display
    const flatSkills = [];
    Object.entries(skillsData).forEach(([category, skills]) => {
        skills.forEach(skill => {
            flatSkills.push({ name: skill, category: category.charAt(0).toUpperCase() + category.slice(1) });
        });
    });

    return (
        <section id="skills" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Technical Skills
                </motion.h2>
                <div className="skills-grid">
                    {flatSkills.map((skill, index) => (
                        <motion.div
                            key={index}
                            className="skill-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{skill.name}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{skill.category}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
