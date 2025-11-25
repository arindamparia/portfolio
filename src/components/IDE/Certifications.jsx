import React from 'react';
import { motion } from 'framer-motion';
import { certificationsData } from '../../data/certifications';

const Certifications = () => {
    return (
        <div style={{ padding: '2rem', fontFamily: 'var(--font-code)', color: '#d4d4d4' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 style={{ color: '#569cd6', borderBottom: '1px solid #3e3e42', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}># Professional Certifications</h1>

                {certificationsData.map((cert, index) => (
                    <div key={index} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#4ec9b0', fontSize: '1.2rem', marginBottom: '0.5rem' }}>## {cert.name}</h2>
                        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                            <li style={{ marginBottom: '0.2rem' }}>- **Issuer**: <span style={{ color: '#ce9178' }}>{cert.issuer}</span></li>
                            <li style={{ marginBottom: '0.2rem' }}>- **Year**: <span style={{ color: '#b5cea8' }}>{cert.year}</span></li>
                        </ul>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Certifications;
