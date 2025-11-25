import React, { useState, lazy, Suspense } from 'react';
import Hero from '../Modern/Hero';
import About from '../Modern/About';
import { vibrateLight } from '../../utils/vibration';

// Lazy load components that are below the fold
const Skills = lazy(() => import('../Modern/Skills'));
const Projects = lazy(() => import('../Modern/Projects'));
const Experience = lazy(() => import('../Modern/Experience'));
const Education = lazy(() => import('../Modern/Education'));
const Certifications = lazy(() => import('../Modern/Certifications'));
const Contact = lazy(() => import('../Modern/Contact'));

const ModernLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        vibrateLight();
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleNavClick = () => {
        vibrateLight();
        closeMenu();
    };

    return (
        <div className="modern-app">
            <nav>
                <div className="container nav-content">
                    <div className="logo">AP</div>

                    {/* Hamburger Menu Button */}
                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Navigation Links */}
                    <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <a href="#home" onClick={handleNavClick}>Home</a>
                        <a href="#skills" onClick={handleNavClick}>Skills</a>
                        <a href="#experience" onClick={handleNavClick}>Experience</a>
                        <a href="#education" onClick={handleNavClick}>Education</a>
                        <a href="#certifications" onClick={handleNavClick}>Certifications</a>
                        <a href="#projects" onClick={handleNavClick}>Projects</a>
                        <a href="#contact" onClick={handleNavClick}>Contact</a>
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile menu */}
            {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

            <main>
                <Hero />
                <About />
                <Suspense fallback={<div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
                    <Skills />
                    <Experience />
                    <Education />
                    <Certifications />
                    <Projects />
                    <Contact />
                </Suspense>
            </main>
        </div>
    );
};

export default ModernLayout;
