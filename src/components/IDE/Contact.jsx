import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div style={{ padding: '2rem', fontFamily: 'var(--font-code)' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ color: '#6a9955', marginBottom: '1rem' }}>/* Contact Information Styles */</div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ color: '#d7ba7d' }}>.contact-me</span> <span style={{ color: '#da70d6' }}>{'{'}</span>
                    <div style={{ paddingLeft: '1.5rem' }}>
                        <div><span style={{ color: '#9cdcfe' }}>email</span>: <span style={{ color: '#ce9178' }}>"arindamparia321@gmail.com"</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>phone</span>: <span style={{ color: '#b5cea8' }}>"+91 9064175719"</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>status</span>: <span style={{ color: '#ce9178' }}>"Open to opportunities"</span>;</div>
                    </div>
                    <span style={{ color: '#da70d6' }}>{'}'}</span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ color: '#d7ba7d' }}>.social-media</span> <span style={{ color: '#da70d6' }}>{'{'}</span>
                    <div style={{ paddingLeft: '1.5rem' }}>
                        <div><span style={{ color: '#9cdcfe' }}>github</span>: <span style={{ color: '#ce9178' }}>url("<a href="https://github.com/arindamparia" target="_blank" rel="noopener noreferrer" style={{ color: '#ce9178', textDecoration: 'underline', cursor: 'pointer' }}>https://github.com/arindamparia</a>")</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>linkedin</span>: <span style={{ color: '#ce9178' }}>url("<a href="https://www.linkedin.com/in/arindam-paria-557170191/" target="_blank" rel="noopener noreferrer" style={{ color: '#ce9178', textDecoration: 'underline', cursor: 'pointer' }}>https://www.linkedin.com/in/arindam-paria-557170191/</a>")</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>leetcode</span>: <span style={{ color: '#ce9178' }}>url("<a href="https://leetcode.com/u/ARINDAM9064/" target="_blank" rel="noopener noreferrer" style={{ color: '#ce9178', textDecoration: 'underline', cursor: 'pointer' }}>https://leetcode.com/u/ARINDAM9064/</a>")</span>;</div>
                    </div>
                    <span style={{ color: '#da70d6' }}>{'}'}</span>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <p style={{ color: '#6a9955' }}>// Click to connect</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <a href="mailto:arindamparia321@gmail.com" className="btn">Send Email</a>
                        <a href="https://www.linkedin.com/in/arindam-paria-557170191/" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#0077b5' }}>LinkedIn</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
