import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>Hi, I'm <span style={{ color: 'var(--accent-primary)' }}>Arindam</span></h1>
                    <h2>Software Engineer</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
                        Passionate about building scalable applications and solving complex problems.
                        Experienced in Java, Spring Boot, and Modern Web Technologies.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <a href="#projects" className="btn">View Work</a>
                        <a href="#contact" className="btn" style={{ background: 'transparent', border: '2px solid var(--accent-primary)' }}>Contact Me</a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
