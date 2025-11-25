import React from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../../data/skills';

const Skills = () => {
    return (
        <div style={{ padding: '1rem', fontFamily: 'var(--font-code)' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ color: '#6a9955', marginBottom: '1rem' }}>// Technical Skills Inventory</div>
                <pre style={{ color: '#d4d4d4', fontSize: '1rem' }}>
                    <span style={{ color: '#da70d6' }}>{'{'}</span>
                    <div style={{ paddingLeft: '1.5rem' }}>
                        {Object.entries(skillsData).map(([category, skills], index, arr) => (
                            <div key={category}>
                                <span style={{ color: '#9cdcfe' }}>"{category}"</span>: <span style={{ color: '#da70d6' }}>[</span>
                                <div style={{ paddingLeft: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {skills.map((skill, i) => (
                                        <span key={i} style={{ color: '#ce9178' }}>
                                            "{skill}"{i < skills.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                                <span style={{ color: '#da70d6' }}>]</span>{index < arr.length - 1 ? ',' : ''}
                            </div>
                        ))}
                    </div>
                    <span style={{ color: '#da70d6' }}>{'}'}</span>
                </pre>
            </motion.div>
        </div>
    );
};

export default Skills;
