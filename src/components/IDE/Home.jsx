import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center' }}
            >
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Arindam Paria</h1>
                <h2 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '2rem' }}>Software Engineer</h2>

                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left', background: '#2d2d2d', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <p style={{ color: '#6a9955', fontFamily: 'var(--font-code)', marginBottom: '1rem' }}>// Welcome to my portfolio</p>
                    <p style={{ fontFamily: 'var(--font-code)', lineHeight: '1.8' }}>
                        <span className="code-keyword">const</span> <span className="code-variable">developer</span> = <span className="code-keyword">new</span> <span className="code-class">Developer</span>();<br />
                        <span className="code-variable">developer</span>.<span className="code-function">name</span> = <span className="code-string">"Arindam Paria"</span>;<br />
                        <span className="code-variable">developer</span>.<span className="code-function">role</span> = <span className="code-string">"Software Engineer"</span>;<br />
                        <span className="code-variable">developer</span>.<span className="code-function">location</span> = <span className="code-string">"India"</span>;<br />
                        <span className="code-variable">developer</span>.<span className="code-function">passion</span> = <span className="code-string">"Building scalable applications"</span>;<br />
                    </p>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn" onClick={() => document.getElementById('projects-tab')?.click()}>View Projects</button>
                    <button className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-primary)' }} onClick={() => document.getElementById('contact-tab')?.click()}>Contact Me</button>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
