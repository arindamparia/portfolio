import React, { Suspense, lazy, useEffect } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';
import { experienceData } from '../../data/experience';
import { vibrateLight } from '../../utils/vibration';
import { liftCurtain, waitForFonts } from '../../utils/curtain';
import Clock from '../Shared/Clock';
import TypedLines from './TypedLines';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { useSky } from '../../sky/react/SkyContext';

const loadHeroName = () => import('../../sky/demos/heroName');
// Not part of the first paint (and it uses Framer Motion), so it loads afterwards into reserved space
const IndianEvent = lazy(() => import('../Shared/IndianEvent'));


const PITCH = [
    { text: personalInfo.pitch, className: 'hero-pitch', speed: 42, pause: 250 },
    { text: personalInfo.pitchAside, className: 'hero-aside', speed: 16, pause: 650 },
];

const Hero = () => {
    const current = experienceData[0];
    const { animate, cycle, solarData, reducedMotion } = useSky();
    const { ref: nameRef, state: nameState, call: nameCall } = useSkyDemo(loadHeroName, { eager: true });
    // The text name shows first; it fades out only once the stars are taking over the letters
    const starlit = nameState && (nameState.phase === 'forming' || nameState.phase === 'formed');

    // Show the page as soon as the fonts are applied. The 3D sky and the star name arrive
    // when the GPU is ready, without holding up the first paint
    useEffect(() => {
        waitForFonts().then(liftCurtain);
    }, []);

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
                <Suspense fallback={null}>
                    <IndianEvent blended />
                </Suspense>
            </div>
        </section>
    );
};

export default Hero;
