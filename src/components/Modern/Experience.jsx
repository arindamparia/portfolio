import React, { useMemo, useState } from 'react';
import { experienceData } from '../../data/experience';
import { educationData } from '../../data/education';
import { buildCareerGraph } from '../../sky/algorithms/careerGraph';
import { careerMilestones, slug } from '../../data/careerMilestones';
import { useSky } from '../../sky/react/SkyContext';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { DemoCaption, DemoControls, DemoStage } from '../../sky/react/DemoUI';
import { labelAnchor } from '../../sky/react/labelAnchor';
import { useSideSpace } from '../../sky/react/useSideSpace';
import { randomSeed } from '../../sky/algorithms/random';

const loadCareerPath = () => import('../../sky/demos/careerPath');

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

const caption = (state, milestones) => {
    if (!state) return '';
    const from = milestones[0].label;
    const to = milestones[state.target]?.label;
    if (state.index === 0 && !state.playing) {
        return `Dijkstra's algorithm will find the shortest route through ${state.stars} stars, from ${from} to ${to}.`;
    }
    if (!state.tracing) {
        return `Dijkstra's algorithm: ${state.settled} of ${state.stars} stars settled. It always settles the closest star next, so the first route to reach ${to} is the shortest.`;
    }
    const passed = state.reached.map((id) => milestones.find((m) => m.id === id)?.label).filter(Boolean);
    return `Shortest route from ${from} to ${to}: ${state.hops} links, passing ${listFormat.format(passed)}. It settled ${state.settled} stars to be sure.`;
};

const RouteButton = ({ id, live, call }) => (live ? (
    <button type="button" className="text-button route-button" onClick={() => call('routeTo', id)}>
        Show route
    </button>
) : null);

const Work = ({ item, parent, reached, live, call }) => {
    const id = slug(item.name);
    return (
        <div className={`work ${reached.includes(id) ? 'is-reached' : ''}`}>
            <h4>
                {item.name}
                {!item.workstreams && <RouteButton id={id} live={live} call={call} />}
            </h4>
            <p className="work-stack">Built with {item.focus}</p>
            <p>{item.details}</p>
            {item.workstreams && (
                <ul className="workstreams">
                    {item.workstreams.map((stream) => {
                        const streamId = slug(`${parent ?? item.name}-${stream.name}`);
                        return (
                            <li key={stream.name} className={reached.includes(streamId) ? 'is-reached' : ''}>
                                <h5>
                                    {stream.name}
                                    <RouteButton id={streamId} live={live} call={call} />
                                </h5>
                                <p className="work-stack">Built with {stream.focus}</p>
                                <p>{stream.details}</p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

const Experience = () => {
    const { status } = useSky();
    const degree = educationData[0];
    const milestones = useMemo(() => careerMilestones(), []);
    // A new random star field on every visit; Shuffle draws another and plays it
    const [layout, setLayout] = useState(() => ({ seed: randomSeed(), byVisitor: false }));
    const graph = useMemo(() => buildCareerGraph(milestones, { seed: layout.seed }), [milestones, layout]);
    const { ref, state, call, failed } = useSkyDemo(loadCareerPath, { graph, rebuildKey: layout.seed, playOnStart: layout.byVisitor });
    const shuffle = () => setLayout({ seed: randomSeed(), byVisitor: true });
    const sideSpace = useSideSpace();
    const live = status !== 'fallback' && !failed && sideSpace;
    const reached = state?.reached ?? [];

    return (
        <section id="experience">
            <div className="container">
                <h2 className="chart-title">Work</h2>
                <p className="chart-intro">
                    Where I've worked and what I built there, most recent first.
                    {live && ' The stars trace the route from where I started.'}
                </p>

                <div className="chart-grid">
                    <ol className="timeline">
                        {experienceData.map((job) => (
                            <li key={job.company}>
                                <p className="timeline-when">{job.period}</p>
                                <h3 className="timeline-role">{job.role}</h3>
                                <p className="timeline-org">{job.company}</p>
                                {job.projects.map((project) => (
                                    <Work key={project.name} item={project} reached={reached} live={live} call={call} />
                                ))}
                            </li>
                        ))}
                        <li className={reached.includes('nit-durgapur') ? 'is-reached' : ''}>
                            <p className="timeline-when">{degree.year}</p>
                            <h3 className="timeline-role">{degree.degree}</h3>
                            <p className="timeline-org">{degree.institution}, {degree.details.split('\n')[0]}</p>
                        </li>
                    </ol>

                    {live && (
                        <div className="chart-stage-col">
                            <DemoStage
                                ref={ref}
                                className="career-stage"
                                label={`A field of stars where Dijkstra's algorithm finds the shortest route from ${milestones[0].label} to my current work`}
                            >
                                {state?.milestones.map((m) => (
                                    <span
                                        key={m.id}
                                        className={`stage-label ${reached.includes(m.id) ? 'stage-label-selected' : ''}`}
                                        style={{ left: m.x, top: m.y + 14, ...labelAnchor(m.nx) }}
                                    >
                                        {m.label}
                                    </span>
                                ))}
                            </DemoStage>
                            <DemoCaption>{caption(state, milestones)}</DemoCaption>
                            <DemoControls state={state} call={call} label="Dijkstra's algorithm" onShuffle={shuffle} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Experience;
