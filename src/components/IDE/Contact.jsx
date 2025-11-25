import React from 'react';
import { motion } from 'framer-motion';
import { personalInfo, socialLinks } from '../../constants/personalInfo';

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
                        <div><span style={{ color: '#9cdcfe' }}>email</span>: <span style={{ color: '#ce9178' }}>"{personalInfo.email}"</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>phone</span>: <span style={{ color: '#b5cea8' }}>"{personalInfo.phone}"</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>status</span>: <span style={{ color: '#ce9178' }}>"{personalInfo.status}"</span>;</div>
                    </div>
                    <span style={{ color: '#da70d6' }}>{'}'}</span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ color: '#d7ba7d' }}>.social-media</span> <span style={{ color: '#da70d6' }}>{'{'}</span>
                    <div style={{ paddingLeft: '1.5rem' }}>
                        <div><span style={{ color: '#9cdcfe' }}>github</span>: <span style={{ color: '#ce9178' }}>url("{socialLinks.github.url}")</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>linkedin</span>: <span style={{ color: '#ce9178' }}>url("{socialLinks.linkedin.url}")</span>;</div>
                        <div><span style={{ color: '#9cdcfe' }}>leetcode</span>: <span style={{ color: '#ce9178' }}>url("{socialLinks.leetcode.url}")</span>;</div>
                    </div>
                    <span style={{ color: '#da70d6' }}>{'}'}</span>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <p style={{ color: '#6a9955' }}>// Click to connect</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <a href={`mailto:${personalInfo.email}`} className="btn">Send Email</a>
                        <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#0077b5' }}>LinkedIn</a>
                        <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#333' }}>GitHub</a>
                        <a href={socialLinks.leetcode.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#FFA116' }}>LeetCode</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
