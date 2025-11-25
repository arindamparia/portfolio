import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { VscChevronDown } from 'react-icons/vsc';

const Experience = () => {
    const salesforceSkills = [
        { name: 'APEX', level: 'Experienced' },
        { name: 'LWC', level: 'Experienced' },
        { name: 'FLOWS', level: 'Experienced' },
        { name: 'Integration', level: 'Experienced' },
        { name: 'Experience Cloud', level: 'Intermediate' },
        { name: 'Sales & Service Cloud', level: 'Basic' }
    ];

    const tools = [
        { name: 'Github Actions', level: 'Intermediate' },
        { name: 'Conga Composer', level: 'Intermediate' },
        { name: 'Copado', level: 'Intermediate' },
        { name: 'Git', level: 'Intermediate' }
    ];

    return (
        <section id="experience">
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
                    Experience
                </motion.h2>
                <div className="skills-container">
                    <motion.div
                        className="skills-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3>Salesforce Development</h3>
                        <div className="skill-items">
                            {salesforceSkills.map((skill, index) => (
                                <div key={index} className="skill-item">
                                    <div className="skill-item-icon">
                                        <FaCheckCircle />
                                    </div>
                                    <div className="skill-item-text">
                                        <h4>{skill.name}</h4>
                                        <p>{skill.level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        className="skills-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3>Tools</h3>
                        <div className="skill-items">
                            {tools.map((tool, index) => (
                                <div key={index} className="skill-item">
                                    <div className="skill-item-icon">
                                        <FaCheckCircle />
                                    </div>
                                    <div className="skill-item-text">
                                        <h4>{tool.name}</h4>
                                        <p>{tool.level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    className="section-arrow"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <a href="#projects">
                        <VscChevronDown />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Experience;
