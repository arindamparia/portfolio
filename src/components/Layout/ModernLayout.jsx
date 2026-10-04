/**
 * Modern Layout Component
 *
 * "One night sky": a single fixed WebGPU sky behind the whole page (SkyProvider),
 * with each section performing an algorithm on its stars.
 *
 * - Hero and About load immediately; later sections are lazy loaded
 * - Navigation highlights the section in view
 * - Mobile menu with haptic feedback
 */

import React, { useEffect, useState, lazy, Suspense } from 'react';
import Hero from '../Modern/Hero';
import About from '../Modern/About';
import SkyProvider from '../../sky/react/SkyProvider';
import { vibrateLight } from '../../utils/vibration';

// Lazy load components that are below the fold
const Skills = lazy(() => import('../Modern/Skills'));
const Experience = lazy(() => import('../Modern/Experience'));
const Projects = lazy(() => import('../Modern/Projects'));
const Background = lazy(() => import('../Modern/Background'));
const Contact = lazy(() => import('../Modern/Contact'));
const Footer = lazy(() => import('../Modern/Footer'));
const JokeButton = lazy(() => import('../Shared/JokeButton'));

// Render the rest of the page once the hero has painted (immediately if the URL points at a section)
const useAfterFirstPaint = () => {
    const [ready, setReady] = useState(() => window.location.hash.length > 1);
    useEffect(() => {
        if (ready) return undefined;
        const id = window.requestIdleCallback
            ? window.requestIdleCallback(() => setReady(true), { timeout: 700 })
            : setTimeout(() => setReady(true), 200);
        return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
    }, [ready]);
    return ready;
};

const NAV_ITEMS = [
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Work' },
    { id: 'projects', label: 'Projects' },
    { id: 'background', label: 'Background' },
    { id: 'contact', label: 'Contact' },
];

// Track which section is in view, for aria-current on the nav
const useActiveSection = () => {
    const [active, setActive] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );

        // Sections mount lazily, so watch for them as they appear
        const observeAll = () => document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s));
        observeAll();
        const mutation = new MutationObserver(observeAll);
        mutation.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutation.disconnect();
        };
    }, []);

    return active;
};

const ModernLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const active = useActiveSection();
    const showRest = useAfterFirstPaint();

    const toggleMenu = () => {
        vibrateLight();
        setIsMenuOpen((open) => !open);
    };

    const closeMenu = () => setIsMenuOpen(false);

    const handleNavClick = () => {
        vibrateLight();
        closeMenu();
    };

    // Close the menu with Escape, and lock page scroll while it is open
    useEffect(() => {
        if (!isMenuOpen) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeMenu();
        };
        window.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <SkyProvider>
            <div className="modern-app">
                <nav aria-label="Main">
                    <div className="container nav-content">
                        <a href="#home" className="logo" onClick={handleNavClick}>AP<span className="visually-hidden">, Arindam Paria, back to top</span></a>

                        <div id="nav-links" className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={handleNavClick}
                                    aria-current={active === item.id ? 'true' : undefined}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        <button
                            type="button"
                            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            aria-controls="nav-links"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>

                {isMenuOpen && <div className="nav-overlay" onClick={closeMenu} />}

                <main>
                    <Hero />
                    <About />
                    {showRest ? (
                        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
                            <Skills />
                            <Experience />
                            <Projects />
                            <Background />
                            <Contact />
                        </Suspense>
                    ) : (
                        <div style={{ minHeight: '60vh' }} />
                    )}
                </main>

                {showRest && (
                    <Suspense fallback={null}>
                        <Footer />
                        <JokeButton />
                    </Suspense>
                )}
            </div>
        </SkyProvider>
    );
};

export default ModernLayout;
