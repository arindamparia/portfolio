import React from 'react';
import ChartTitle from './ChartTitle';
import { experienceData } from '../../data/experience';
import { educationData } from '../../data/education';
import { personalInfo, assets } from '../../constants/personalInfo';
import { useSky } from '../../sky/react/SkyContext';

const JOINED = new Date('2023-11-27');

// "2 years 10 months" since joining
const timeSince = (start, now = new Date()) => {
    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (now.getDate() < start.getDate()) months -= 1;
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (rest > 0 || years === 0) parts.push(`${rest} ${rest === 1 ? 'month' : 'months'}`);
    return parts.join(' ');
};

const About = () => {
    const { status } = useSky();
    const current = experienceData[0];
    const jee = educationData.find((e) => e.degree.includes('JEE'));
    const percentile = jee?.details.match(/Percentile:\s*([\d.]+)/)?.[1];

    return (
        <section id="about">
            <div className="container about-layout">
                <div className="about-text">
                    <ChartTitle>About</ChartTitle>
                    <p className="about-lead">
                        I work on the parts of online shopping nobody notices until they break: carts,
                        checkouts and payments.
                    </p>

                    <ul className="about-points">
                        <li>
                            <h3>At work</h3>
                            <p>
                                Backend engineer at {current.company}. Rebuilt the cart and checkout
                                for <strong>Coach and Coach Outlet</strong>, then a headless cart in <strong>Go and GraphQL</strong>.
                            </p>
                        </li>
                        <li>
                            <h3>Lately</h3>
                            <p>
                                Teaching an AI to shop: <strong>Spring Boot</strong> middleware between a <strong>Gemini agent</strong>,
                                Salesforce Commerce Cloud and Adyen. A nervous double-click never charges you twice.
                            </p>
                        </li>
                        <li>
                            <h3>What I care about</h3>
                            <p>
                                The part of the design doc most people skim: <strong>latency, retries, idempotency and
                                test coverage</strong>. Get those right and new features stay exciting for the right reasons.
                            </p>
                        </li>
                        <li>
                            <h3>After hours</h3>
                            <p>
                                <strong>AlgoTracker</strong> keeps my DSA sharp, <strong>DailyAlign</strong> keeps the rest of me in
                                shape, and a <strong>salary calculator</strong> exists because every offer letter deserves a second opinion.
                            </p>
                        </li>
                    </ul>

                    <dl className="facts">
                        <div>
                            <dt>At {current.company}</dt>
                            <dd>{timeSince(JOINED)}</dd>
                        </div>
                        <div>
                            <dt>Studied at</dt>
                            <dd>NIT Durgapur, CSE</dd>
                        </div>
                        {percentile && (
                            <div>
                                <dt>JEE Main {jee.year}</dt>
                                <dd>{Number(percentile).toFixed(2)} percentile</dd>
                            </div>
                        )}
                    </dl>
                    {status !== 'fallback' && (
                        <p className="about-sky-note">The sky on this page runs real algorithms. Scroll and you'll see them.</p>
                    )}
                </div>

                <div className="about-figures">
                    <figure className="about-figure">
                        <img
                            src={assets.profileImage}
                            alt={`${personalInfo.name.full} in a grey blazer`}
                            loading="lazy"
                            width="600"
                            height="750"
                        />
                        <figcaption>Off duty, blazer on.</figcaption>
                    </figure>
                    <figure className="about-figure">
                        <img
                            src={assets.aboutImage}
                            alt={`${personalInfo.name.full} at his desk in a sweater with a chess king on it`}
                            loading="lazy"
                            width="600"
                            height="750"
                        />
                        <figcaption>At my desk. The chess king is there to remind me to think a few moves ahead.</figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
};

export default About;
