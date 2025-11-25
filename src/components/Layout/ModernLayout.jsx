import React, { useState } from 'react';
import Hero from '../Modern/Hero';
import About from '../Modern/About';
import Skills from '../Modern/Skills';
import Projects from '../Modern/Projects';
import Experience from '../Modern/Experience';
import Education from '../Modern/Education';
import Contact from '../Modern/Contact';
import { vibrateLight } from '../../utils/vibration';

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
                <Skills />
                <Experience />
                <Education />
                <Projects />
                <Contact />
            </main>
        </div>
    );
};

export default ModernLayout;
