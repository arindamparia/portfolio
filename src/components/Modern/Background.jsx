import React from 'react';
import { educationData } from '../../data/education';
import { certificationsData } from '../../data/certifications';
import { candidatesFromPercentile } from '../../sky/algorithms/binarySearch';
import { useSky } from '../../sky/react/SkyContext';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { DemoCaption, DemoControls, DemoStage } from '../../sky/react/DemoUI';
import { useSideSpace } from '../../sky/react/useSideSpace';

const loadRankSearch = () => import('../../sky/demos/rankSearch');

const number = (n) => n.toLocaleString('en-IN');

const caption = (state, lakh) => {
    if (!state) return '';
    const target = number(state.target);
    if (state.phase === 'ready') {
        return `Binary search will find rank ${target} among about ${lakh} lakh JEE Main candidates, a total worked out from the rank and percentile.`;
    }
    if (state.found) {
        const bound = Math.ceil(Math.log2(state.total + 1));
        return `Found rank ${target} in ${state.steps} steps. Checking ranks one by one from the top would take ${target} comparisons; binary search never needs more than ${bound} here, because each step halves what's left.`;
    }
    if (state.phase === 'probe') {
        const below = state.result === 'lower';
        return `Step ${state.step}: is ${target} below ${number(state.mid)}? ${below ? 'Yes, so every rank above it is ruled out.' : 'No, so every rank below it is ruled out.'}`;
    }
    return `Step ${state.step}: ${number(state.hi - state.lo + 1)} candidates left, from rank ${number(state.lo)} to ${number(state.hi)}.`;
};

const Background = () => {
    const { status } = useSky();
    const sideSpace = useSideSpace();
    const degree = educationData[0];
    const jee = educationData.find((e) => e.degree.includes('JEE'));
    const [stream, cgpa] = degree.details.split('\n');

    const percentile = Number(jee?.details.match(/Percentile:\s*([\d.]+)/)?.[1]);
    const rank = Number(jee?.details.match(/Rank:\s*([\d,]+)/)?.[1].replace(/,/g, ''));
    const total = percentile && rank ? candidatesFromPercentile(rank, percentile) : null;
    const lakh = total ? (total / 100000).toFixed(1) : null;

    const { ref, state, call, failed } = useSkyDemo(loadRankSearch, { total, target: rank });
    const live = status !== 'fallback' && !failed && total && sideSpace;

    return (
        <section id="background">
            <div className="container">
                <h2 className="chart-title">Background</h2>
                <p className="chart-intro">Education and certifications.</p>

                <div className="chart-grid">
                    <div className="records">
                        <div className="record">
                            <h3>{degree.degree}, {stream}</h3>
                            <p>{degree.institution}, {degree.year}. <span className="record-highlight">{cgpa}</span></p>
                        </div>
                        {jee && (
                            <div className="record">
                                <h3>{jee.degree}, {jee.year}</h3>
                                <p className="record-highlight">{jee.details.split('\n').join('. ')}</p>
                            </div>
                        )}
                        <ul className="cert-list" aria-label="Certifications">
                            {certificationsData.map((cert) => (
                                <li key={cert.name}>
                                    <span>{cert.name}, {cert.issuer}</span>
                                    <span>{cert.year}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {live && (
                        <div className="chart-stage-col">
                            <div className="rank-range" aria-hidden="true">
                                <span>{state ? number(state.lo) : '1'}</span>
                                <span className={`rank-probe ${state?.found ? 'is-found' : ''}`}>
                                    {state ? number(state.found ? state.target : state.mid) : ''}
                                </span>
                                <span>{state ? number(state.hi) : number(total)}</span>
                            </div>
                            <DemoStage
                                ref={ref}
                                className="rank-stage"
                                label={`A band of stars standing for about ${lakh} lakh candidates, searched by binary search for rank ${number(rank)}`}
                            />
                            <DemoCaption>{caption(state, lakh)}</DemoCaption>
                            <DemoControls state={state} call={call} label="Binary search" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Background;
