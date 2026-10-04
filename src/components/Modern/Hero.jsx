import React, { useEffect, useRef } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';
import { experienceData } from '../../data/experience';
import { vibrateLight } from '../../utils/vibration';
import { liftCurtain } from '../../utils/curtain';
import Clock from '../Shared/Clock';
import IndianEvent from '../Shared/IndianEvent';
import TypedLines from './TypedLines';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { useSky } from '../../sky/react/SkyContext';

const loadHeroName = () => import('../../sky/demos/heroName');

// Lift the curtain at the latest after this, even if the sky is slow
const CURTAIN_MAX_MS = 3500;

const PITCH = [
    { text: personalInfo.pitch, className: 'hero-pitch', speed: 42, pause: 250 },
    { text: personalInfo.pitchAside, className: 'hero-aside', speed: 16, pause: 650 },
];

const Hero = () => {
    const current = experienceData[0];
    const { animate, cycle, solarData, status, reducedMotion } = useSky();
    const { ref: nameRef, state: nameState, call: nameCall } = useSkyDemo(loadHeroName, { eager: true });
    const starlit = nameState && nameState.phase !== 'idle';
    const lifted = useRef(false);

    // Show the page once the fonts are in and the stars are in their starting places
    // (or straight away when there's no star intro to wait for)
    const heroReady = starlit || status === 'fallback' || reducedMotion;
    useEffect(() => {
        const lift = () => {
            if (lifted.current) return;
            lifted.current = true;
            liftCurtain();
        };
        const timer = setTimeout(lift, CURTAIN_MAX_MS);
        if (heroReady) (document.fonts?.ready ?? Promise.resolve()).then(lift);
        return () => clearTimeout(timer);
    }, [heroReady]);

    return (
        <section id="home" className="hero">
            <div className="hero-clock">
                <Clock solarData={solarData} cycle={cycle} blended />
            </div>

            <div className="container">
                <h1 ref={nameRef} className={`hero-name ${starlit ? 'is-starlit' : ''}`}>{personalInfo.name.full}</h1>
                <TypedLines lines={PITCH} reducedMotion={reducedMotion} />
                <p className="hero-role">{current.role} at {current.company}, based in India.</p>

                <div className="hero-actions">
                    <a href="#contact" className="btn btn-primary" onClick={vibrateLight}>
                        Get in touch
                    </a>
                    {assets.cvPath && (
                        <a href={assets.cvPath} className="btn btn-ghost" download onClick={vibrateLight}>
                            Download CV
                        </a>
                    )}
                    <a
                        href={socialLinks.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-link"
                        onClick={vibrateLight}
                        aria-label="LinkedIn profile"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href={socialLinks.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-link"
                        onClick={vibrateLight}
                        aria-label="GitHub profile"
                    >
                        <FaGithub />
                    </a>
                </div>

                <div className="hero-footnotes">
                    {starlit && (
                        <p className="hero-note">
                            My name above is drawn by {nameState.stars.toLocaleString('en-IN')} stars, each matched to a
                            spot in the letters by sorting both sets from left to right.
                            {animate && (
                                <button type="button" className="text-button" onClick={() => nameCall('replay')}>
                                    Replay
                                </button>
                            )}
                        </p>
                    )}
                </div>
            </div>

            <div className="hero-fact">
                <IndianEvent blended />
            </div>
        </section>
    );
};

export default Hero;
