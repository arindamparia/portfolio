import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { projectsData } from '../../data/projects';
import { SORTS } from '../../sky/algorithms/sorts';
import { useSky } from '../../sky/react/SkyContext';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { DemoCaption, DemoControls, DemoStage } from '../../sky/react/DemoUI';
import { useSideSpace } from '../../sky/react/useSideSpace';
import { vibrateLight } from '../../utils/vibration';

const loadSortRace = () => import('../../sky/demos/sortRace');

const number = (n) => n.toLocaleString('en-IN');

// Fewest comparisons any comparison sort can guarantee: log₂(n!)
const comparisonLowerBound = (n) => {
    let bits = 0;
    for (let k = 2; k <= n; k++) bits += Math.log2(k);
    return Math.ceil(bits);
};

const raceCaption = (state, size) => {
    if (!state || (state.index === 0 && !state.playing)) {
        return `Merge sort on ${size} random numbers. Each star is a number: across is its position, up is its value, so sorted looks like a rising line.`;
    }
    if (!state.done) return 'Gold stars are being compared or written right now. Merge sort sorts each half, then merges them.';
    const comparisons = state.lanes[0].comparisons;
    // Exact worst case of top-down merge sort: n⌈log₂ n⌉ − 2^⌈log₂ n⌉ + 1
    const levels = Math.ceil(Math.log2(size));
    const worst = size * levels - 2 ** levels + 1;
    return `Sorted with ${number(comparisons)} comparisons. Merge sort never needs more than ${number(worst)} for ${size} numbers, and no comparison sort can guarantee fewer than ${number(comparisonLowerBound(size))}. That's why it's called optimal.`;
};

const ProjectLinks = ({ project }) => (
    <div className="project-links">
        {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary" onClick={vibrateLight}>
                {project.liveLabel ?? 'Open live site'}
            </a>
        )}
        {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" onClick={vibrateLight}>
                <FaGithub aria-hidden="true" /> Source code
            </a>
        )}
    </div>
);

const SORT_LANES = ['merge'];
const SORT_SIZE = 48;

const SortRace = () => {
    const { ref, state, call } = useSkyDemo(loadSortRace, { lanes: SORT_LANES, size: SORT_SIZE });

    return (
        <div className="race">
            <DemoStage
                ref={ref}
                className="race-stage lanes-1"
                label={`Merge sort sorting ${SORT_SIZE} random numbers`}
            >
                <div className="race-lane">
                    <p className="race-lane-head">
                        <span className="race-lane-name">{SORTS.merge.name}</span>
                        <span className="race-lane-complexity">{SORTS.merge.complexity}, worst case too</span>
                    </p>
                    <div className="race-plot" data-lane="merge" />
                    <p className="race-lane-count">
                        {number(state?.lanes[0]?.comparisons ?? 0)} comparisons{state?.lanes[0]?.finished ? ', sorted' : ''}
                    </p>
                </div>
            </DemoStage>
            <DemoCaption>{raceCaption(state, SORT_SIZE)}</DemoCaption>
            <DemoControls state={state} call={call} label="Merge sort" />
        </div>
    );
};

const Projects = () => {
    const { status } = useSky();
    const sideSpace = useSideSpace();
    const showRace = status !== 'fallback' && sideSpace;
    const featured = projectsData.find((p) => p.featured);
    const current = projectsData.filter((p) => !p.featured && !p.earlier);
    const earlier = projectsData.filter((p) => p.earlier);

    return (
        <section id="projects">
            <div className="container">
                <h2 className="chart-title">Projects</h2>
                <p className="chart-intro">
                    Things I've built for myself and keep using.
                    {showRace && ' Beside AlgoTracker, the kind of thing it helps you practise: merge sort, step by step.'}
                </p>

                <div className={showRace ? 'chart-grid projects-top' : ''}>
                {featured && (
                    <article className={`case-study ${showRace ? 'is-stacked' : ''}`}>
                        <img
                            src={featured.image}
                            alt={`${featured.name} dashboard showing tracked problems and review queue`}
                            loading="lazy"
                            width="1200"
                            height="721"
                        />
                        <div>
                            <h3 className="project-name">{featured.name}</h3>
                            <p>{featured.description}</p>
                            <p className="project-stack">Built with {featured.tech.join(', ')}</p>
                            <ProjectLinks project={featured} />
                        </div>
                    </article>
                )}
                {showRace && (
                    <div className="chart-stage-col">
                        <SortRace />
                    </div>
                )}
                </div>

                <div className="project-list">
                    {current.map((project) => (
                        <article key={project.name}>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <p className="project-stack">Built with {project.tech.join(', ')}</p>
                            <ProjectLinks project={project} />
                        </article>
                    ))}
                </div>

                <div className="earlier">
                    <h3>Earlier, from college</h3>
                    <ul>
                        {earlier.map((project) => (
                            <li key={project.name}>
                                <span>{project.name}</span>
                                <span className="earlier-desc">{project.description}</span>
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link">
                                        Source<span className="visually-hidden"> code for {project.name}</span>
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Projects;
