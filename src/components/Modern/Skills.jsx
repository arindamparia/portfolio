import React from 'react';
import { motion } from 'framer-motion';
import { VscCode, VscChevronDown } from 'react-icons/vsc';
import { skillsData } from '../../data/skills';
import { vibrateMedium } from '../../utils/vibration';

const Skills = () => {
    const categoryNames = {
        languages: 'Languages',
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'Database',
        enterprise: 'Enterprise',
        cloud_devops: 'Cloud & DevOps',
        fundamentals: 'Fundamentals',
        tools: 'Tools'
    };

    return (
        <section id="skills" style={{ background: 'var(--bg-secondary)', padding: '4rem 0' }}>
            <div className="container">
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Explore My
                </motion.p>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Technical Skills
                </motion.h2>
                <div className="skills-container-modern">
                    {Object.entries(skillsData).map(([category, skills], categoryIndex) => (
                        <motion.div
                            key={category}
                            className="skills-category-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
                            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                        >
                            <h3 className="skills-category-title">{categoryNames[category]}</h3>
                            <div className="skills-list">
                                {skills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skillIndex}
                                        className="skill-tag"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                                    >
                                        <VscCode className="skill-tag-icon" />
                                        <span>{skill}</span>
                                    </motion.div>
                                ))}
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
                    <a href="#experience" onClick={vibrateMedium}>
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
