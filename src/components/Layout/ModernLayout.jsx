import React from 'react';
import Hero from '../Modern/Hero';
import About from '../Modern/About';
import Skills from '../Modern/Skills';
import Projects from '../Modern/Projects';
import Experience from '../Modern/Experience';
import Education from '../Modern/Education';
import Contact from '../Modern/Contact';

const ModernLayout = () => {
    return (
        <div className="modern-app">
            <nav>
                <div className="container nav-content">
                    <div className="logo">AP</div>
                    <div className="nav-links">
                        <a href="#home">Home</a>
                        <a href="#skills">Skills</a>
                        <a href="#experience">Experience</a>
                        <a href="#education">Education</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </nav>

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
