/**
 * Modern Layout Component
 *
 * A clean, contemporary portfolio layout with:
 * - Responsive navigation with hamburger menu
 * - Hero section
 * - Smooth scrolling sections
 * - Mobile-first design
 *
 * Features:
 * - Works on all screen sizes
 * - Lazy loading for below-the-fold content
 * - Haptic feedback on mobile devices
 * - Smooth section transitions
 */

import React, { useState, lazy, Suspense } from 'react';
import Hero from '../Modern/Hero';
import About from '../Modern/About';
import Clock from '../Shared/Clock';
import { vibrateLight } from '../../utils/vibration';

// Lazy load components that are below the fold (not immediately visible)
// This improves initial page load performance
const Skills = lazy(() => import('../Modern/Skills'));
const Projects = lazy(() => import('../Modern/Projects'));
const Experience = lazy(() => import('../Modern/Experience'));
const Education = lazy(() => import('../Modern/Education'));
const Certifications = lazy(() => import('../Modern/Certifications'));
const Contact = lazy(() => import('../Modern/Contact'));

const ModernLayout = () => {
    // Track mobile menu open/closed state
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /**
     * Toggle mobile navigation menu with haptic feedback
     */
    const toggleMenu = () => {
        vibrateLight();
        setIsMenuOpen(!isMenuOpen);
    };

    /**
     * Close mobile navigation menu
     */
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    /**
     * Handle navigation link click
     * Provides haptic feedback and closes mobile menu with a delay
     * to allow smooth scrolling to start before the menu disappears
     */
    const handleNavClick = () => {
        vibrateLight();
        // Delay closing the menu slightly to allow smooth scroll to initiate visually
        setTimeout(() => {
            closeMenu();
        }, 300);
    };

    // Prevent body and html scroll when menu is open
    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <div className="modern-app">
            {/* Top navigation bar */}
            <nav>
                <div className="container nav-content">
                    {/* Portfolio logo/initials */}
                    <a href="#home" className="logo" onClick={handleNavClick} style={{ textDecoration: 'none', cursor: 'pointer' }}>AP</a>

                    {/* Navigation links (horizontal on desktop, slide-in menu on mobile) */}
                    <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <a href="#home" onClick={handleNavClick}>Home</a>
                        <a href="#skills" onClick={handleNavClick}>Skills</a>
                        <a href="#experience" onClick={handleNavClick}>Experience</a>
                        <a href="#education" onClick={handleNavClick}>Education</a>
                        <a href="#certifications" onClick={handleNavClick}>Certifications</a>
                        <a href="#projects" onClick={handleNavClick}>Projects</a>
                        <a href="#contact" onClick={handleNavClick}>Contact</a>
                    </div>

                    {/* Clock with dynamic background */}
                    <Clock />

                    {/* Hamburger menu button (visible on mobile) */}
                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Dark overlay when mobile menu is open (click to close) */}
            {isMenuOpen && (
                <div
                    className="nav-overlay"
                    onClick={closeMenu}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998, // Below nav (1000) but above content
                        backdropFilter: 'blur(4px)'
                    }}
                ></div>
            )}

            {/* Main content area with all sections */}
            <main>
                {/* Hero and About are loaded immediately (above the fold) */}
                <Hero />
                <About />

                {/* Below-the-fold sections are lazy loaded for better performance */}
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
