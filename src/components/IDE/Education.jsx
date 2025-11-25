import React from 'react';
import { motion } from 'framer-motion';
import { educationData } from '../../data/education';

const Education = () => {
    return (
        <div style={{ padding: '2rem', fontFamily: 'var(--font-code)', color: '#d4d4d4' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 style={{ color: '#569cd6', borderBottom: '1px solid #3e3e42', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}># Education History</h1>

                {educationData.map((edu, index) => (
                    <div key={index} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#4ec9b0', fontSize: '1.2rem', marginBottom: '0.5rem' }}>## {edu.degree}</h2>
                        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                            <li style={{ marginBottom: '0.2rem' }}>- **Institution**: <span style={{ color: '#ce9178' }}>{edu.institution}</span></li>
                            <li style={{ marginBottom: '0.2rem' }}>- **Year**: <span style={{ color: '#b5cea8' }}>{edu.year}</span></li>
                            <li>
                                - **Details**:
                                <div style={{ paddingLeft: '1.5rem', color: '#858585', whiteSpace: 'pre-line' }}>
                                    {edu.details}
                                </div>
                            </li>
                        </ul>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Education;
