import React, { Suspense, lazy, useEffect, useState } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { personalInfo, socialLinks, assets } from '../../constants/personalInfo';
import { experienceData } from '../../data/experience';
import { vibrateLight } from '../../utils/vibration';
import { liftCurtain, waitForFonts } from '../../utils/curtain';
import Clock from '../Shared/Clock';
import TypedLines from './TypedLines';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { useSky } from '../../sky/react/SkyContext';
import { heroStarCount } from '../../sky/heroStars';

const loadHeroName = () => import('../../sky/demos/heroName');
// Not part of the first paint (and it uses Framer Motion), so it loads afterwards into reserved space
const IndianEvent = lazy(() => import('../Shared/IndianEvent'));


const PITCH = [
    { text: personalInfo.pitch, className: 'hero-pitch', speed: 42, pause: 250 },
    { text: personalInfo.pitchAside, className: 'hero-aside', speed: 16, pause: 650 },
];

const Hero = () => {
    const current = experienceData[0];
    const { cycle, solarData, reducedMotion, status, isSmall } = useSky();
    const { ref: nameRef, state: nameState, call: nameCall, failed: nameFailed } = useSkyDemo(loadHeroName, { eager: true });
    const starlit = nameState && (nameState.phase === 'forming' || nameState.phase === 'formed');

    // The stars draw the name; the text stays invisible (but present for screen readers and search)
    // so the visitor never sees it switch styles. Text appears only if the stars can't: no GPU, an
    // error, or nothing within 3 seconds
    const [late, setLate] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setLate(true), 3000);
        return () => clearTimeout(timer);
    }, []);
    const showText = status === 'fallback' || nameFailed || (late && !starlit);

    // One reveal: lift the curtain when the fonts are applied AND the star name is ready to draw
    // (or the text fallback applies), so the sky, the name and the text appear together. Capped
    // so a slow device never waits on a black screen for long
    const [fontsIn, setFontsIn] = useState(false);
    const [capped, setCapped] = useState(false);
    useEffect(() => {
        waitForFonts().then(() => setFontsIn(true));
        const timer = setTimeout(() => setCapped(true), 1200);
        return () => clearTimeout(timer);
    }, []);
    const nameReady = Boolean(nameState && nameState.phase !== 'idle');
    useEffect(() => {
        if (fontsIn && (nameReady || showText || capped)) liftCurtain();
    }, [fontsIn, nameReady, showText, capped]);


    return (
        <section id="home" className="hero">
            <div className="hero-clock">
                <Clock solarData={solarData} cycle={cycle} blended />
            </div>

            <div className="container">
                <h1 ref={nameRef} className={`hero-name ${showText ? '' : 'is-starlit'}`}>{personalInfo.name.full}</h1>
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
                    {/* Always rendered so its space is reserved; it fades in once the stars have drawn the name */}
                    <p className={`hero-note ${starlit ? 'is-shown' : ''}`} aria-hidden={!starlit}>
                        My name above is drawn by {heroStarCount(isSmall).toLocaleString('en-IN')} stars, each matched to a
                        spot in the letters by sorting both sets from left to right.
                        <button type="button" className="text-button" onClick={() => nameCall('replay')} tabIndex={starlit ? 0 : -1}>
                            Replay
                        </button>
                    </p>
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
