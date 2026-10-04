import React, { useMemo, useState } from 'react';
import { skillsData, skillCategoryNames } from '../../data/skills';
import { experienceData } from '../../data/experience';
import { projectsData } from '../../data/projects';
import { buildSkillGraph, workSources } from '../../sky/algorithms/skillGraph';
import { useSky } from '../../sky/react/SkyContext';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { DemoCaption, DemoControls, DemoStage } from '../../sky/react/DemoUI';
import { useSideSpace } from '../../sky/react/useSideSpace';

const loadSkillsMst = () => import('../../sky/demos/skillsMst');

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

const caption = (state) => {
    if (!state || (state.index === 0 && !state.playing)) {
        return `Kruskal's algorithm will join all ${state?.nodes ?? 'the'} skills with the shortest possible links.`;
    }
    if (!state.done) {
        return `Kruskal's algorithm: ${state.checked} links checked, ${state.kept} of ${state.totalLinks} kept. It tries the shortest link first and skips any that would close a loop.`;
    }
    return `All ${state.nodes} skills joined by ${state.totalLinks} links with the least total length. Skills I've used together count as closer, so the tree follows real projects.`;
};

const Skills = () => {
    const { status } = useSky();
    const graph = useMemo(() => buildSkillGraph(skillsData, workSources(experienceData, projectsData)), []);
    const { ref, state, call, failed } = useSkyDemo(loadSkillsMst, { graph });
    const [picked, setPicked] = useState(null);
    const sideSpace = useSideSpace();
    const showStage = status !== 'fallback' && !failed && sideSpace;

    // Category names sit at the centre of each cluster, like constellation names on a star atlas
    const clusterLabels = useMemo(() => Object.keys(skillsData).map((category) => {
        const members = graph.nodes.filter((node) => node.category === category);
        const x = members.reduce((sum, node) => sum + node.x, 0) / members.length;
        const y = Math.min(...members.map((node) => node.y));
        return { category, x, y };
    }), [graph]);

    const selected = state?.selected;
    const usage = selected ?? (picked && graph.nodes.find((node) => node.name === picked));

    const pick = (name) => {
        setPicked((current) => (current === name ? null : name));
        call('selectByName', name);
    };

    return (
        <section id="skills">
            <div className="container">
                <h2 className="chart-title">Skills</h2>
                <p className="chart-intro">
                    The languages, frameworks and platforms I work with. Pick one to see where I've used it.
                </p>

                <div className={showStage ? 'chart-grid' : ''}>
                    <div>
                        <dl className={`skill-groups ${showStage ? 'is-beside' : ''}`}>
                            {Object.entries(skillsData).map(([category, skills]) => (
                                <div key={category} className="skill-group">
                                    <dt>{skillCategoryNames[category] ?? category}</dt>
                                    <dd>
                                        {skills.map((skill) => (
                                            <button
                                                key={skill}
                                                type="button"
                                                className="skill-chip"
                                                aria-pressed={(selected?.name ?? picked) === skill}
                                                onClick={() => pick(skill)}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {(showStage || usage) && (
                    <div className="chart-stage-col">
                        {showStage && (
                            <DemoStage
                                ref={ref}
                                className="skills-stage"
                                label="A constellation of my skills, joined into a minimum spanning tree by Kruskal's algorithm"
                            >
                                {clusterLabels.map(({ category, x, y }) => (
                                    <span
                                        key={category}
                                        className="stage-label"
                                        style={{ left: `calc(28px + ${x} * (100% - 56px))`, top: `calc(28px + ${y} * (100% - 56px) - 1.4rem)` }}
                                    >
                                        {skillCategoryNames[category]}
                                    </span>
                                ))}
                                {selected && (
                                    <span className="stage-label stage-label-selected" style={{ left: selected.x, top: selected.y + 12 }}>
                                        {selected.name}
                                    </span>
                                )}
                            </DemoStage>
                        )}
                        {showStage && <DemoCaption>{caption(state)}</DemoCaption>}
                        {showStage && <DemoControls state={state} call={call} label="Kruskal's algorithm" />}
                        {usage && (
                            <p className="skill-usage" aria-live="polite">
                                <strong>{usage.name}</strong>
                                {usage.usedIn.length > 0
                                    ? ` used in ${listFormat.format(usage.usedIn)}.`
                                    : ' is part of my toolkit outside the work listed here.'}
                                {selected?.neighbours?.length > 0 && ` Linked in the tree to ${listFormat.format(selected.neighbours)}.`}
                            </p>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Skills;
