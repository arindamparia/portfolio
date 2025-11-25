import React from 'react';
import { motion } from 'framer-motion';
import { experienceData } from '../../data/experience';

const Experience = () => {
    return (
        <div style={{ padding: '1rem', fontFamily: 'var(--font-code)' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ color: '#6a9955', marginBottom: '1rem' }}>// Professional Experience Log</div>
                <pre style={{ color: '#d4d4d4', fontSize: '1rem' }}>
                    <span style={{ color: '#da70d6' }}>[</span>
                    {experienceData.map((exp, i) => (
                        <div key={i} style={{ paddingLeft: '1.5rem' }}>
                            <span style={{ color: '#da70d6' }}>{'{'}</span>
                            <div style={{ paddingLeft: '1.5rem' }}>
                                <div><span style={{ color: '#9cdcfe' }}>"company"</span>: <span style={{ color: '#ce9178' }}>"{exp.company}"</span>,</div>
                                <div><span style={{ color: '#9cdcfe' }}>"role"</span>: <span style={{ color: '#ce9178' }}>"{exp.role}"</span>,</div>
                                <div><span style={{ color: '#9cdcfe' }}>"period"</span>: <span style={{ color: '#ce9178' }}>"{exp.period}"</span>,</div>
                                <div><span style={{ color: '#9cdcfe' }}>"projects"</span>: <span style={{ color: '#da70d6' }}>[</span></div>
                                {exp.projects.map((proj, j) => (
                                    <div key={j} style={{ paddingLeft: '1.5rem' }}>
                                        <span style={{ color: '#da70d6' }}>{'{'}</span>
                                        <div style={{ paddingLeft: '1.5rem' }}>
                                            <div><span style={{ color: '#9cdcfe' }}>"name"</span>: <span style={{ color: '#ce9178' }}>"{proj.name}"</span>,</div>
                                            <div><span style={{ color: '#9cdcfe' }}>"focus"</span>: <span style={{ color: '#ce9178' }}>"{proj.focus}"</span>,</div>
                                            <div><span style={{ color: '#9cdcfe' }}>"details"</span>: <span style={{ color: '#ce9178' }}>"{proj.details}"</span></div>
                                        </div>
                                        <span style={{ color: '#da70d6' }}>{'}'}</span>{j < exp.projects.length - 1 ? ',' : ''}
                                    </div>
                                ))}
                                <div><span style={{ color: '#da70d6' }}>]</span></div>
                            </div>
                            <span style={{ color: '#da70d6' }}>{'}'}</span>
                        </div>
                    ))}
                    <span style={{ color: '#da70d6' }}>]</span>
                </pre>
            </motion.div>
        </div>
    );
};

export default Experience;
