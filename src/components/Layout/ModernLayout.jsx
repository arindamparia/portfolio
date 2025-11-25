import React from 'react';
import Hero from '../Modern/Hero';
import About from '../Modern/About';
import Projects from '../Modern/Projects';
import Experience from '../Modern/Experience';
import Contact from '../Modern/Contact';

const ModernLayout = () => {
    return (
        <div className="modern-app">
            <nav>
                <div className="container nav-content">
                    <div className="logo">AW</div>
                    <div className="nav-links">
                        <a href="#home">About</a>
                        <a href="#experience">Experience</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </nav>

            <main>
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Contact />
            </main>
        </div>
    );
};

export default ModernLayout;
