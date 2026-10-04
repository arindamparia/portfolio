import React, { useLayoutEffect, useMemo, useState } from 'react';
import ChartTitle from './ChartTitle';
import { skillsData, skillCategoryNames } from '../../data/skills';
import { experienceData } from '../../data/experience';
import { projectsData } from '../../data/projects';
import { buildSkillGraph, workSources } from '../../sky/algorithms/skillGraph';
import { useSky } from '../../sky/react/SkyContext';
import { useSkyDemo } from '../../sky/react/useSkyDemo';
import { DemoCaption, DemoControls, DemoStage } from '../../sky/react/DemoUI';
import { labelAnchor } from '../../sky/react/labelAnchor';
import { useSideSpace } from '../../sky/react/useSideSpace';
import { randomSeed } from '../../sky/algorithms/random';

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
    // A new random sky on every visit; Shuffle draws another and plays it
    const [layout, setLayout] = useState(() => ({ seed: randomSeed(), byVisitor: false }));
    const graph = useMemo(() => buildSkillGraph(skillsData, workSources(experienceData, projectsData), { seed: layout.seed }), [layout]);
    const { ref, state, call, failed } = useSkyDemo(loadSkillsMst, { graph, rebuildKey: layout.seed, playOnStart: layout.byVisitor });
    const [picked, setPicked] = useState(null);
    const shuffle = () => {
        setPicked(null);
        setLayout({ seed: randomSeed(), byVisitor: true });
    };
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

    // Random layouts can bring two cluster labels close: nudge any label that overlaps one above
    // it down just enough to clear it. Re-run whenever the layout or the stage size changes
    useLayoutEffect(() => {
        const stage = ref.current;
        if (!stage || !showStage) return undefined;
        const separate = () => {
            const labels = [...stage.querySelectorAll('.stage-label:not(.stage-label-selected)')];
            labels.forEach((label) => label.style.setProperty('--nudge', '0px'));
            const placed = [];
            labels
                .map((label) => ({ label, rect: label.getBoundingClientRect() }))
                .sort((a, b) => a.rect.top - b.rect.top)
                .forEach(({ label, rect }) => {
                    let top = rect.top;
                    for (const other of placed) {
                        const overlapX = Math.min(rect.right, other.right) - Math.max(rect.left, other.left);
                        const overlapY = Math.min(top + rect.height, other.bottom) - Math.max(top, other.top);
                        if (overlapX > 0 && overlapY > 0) top = other.bottom + 4;
                    }
                    if (top !== rect.top) label.style.setProperty('--nudge', `${Math.round(top - rect.top)}px`);
                    placed.push({ left: rect.left, right: rect.right, top, bottom: top + rect.height });
                });
        };
        separate();
        const observer = new ResizeObserver(separate);
        observer.observe(stage);
        return () => observer.disconnect();
    }, [graph, showStage, ref]);

    const pick = (name) => {
        setPicked((current) => (current === name ? null : name));
        call('selectByName', name);
    };

    return (
        <section id="skills">
            <div className="container">
                <ChartTitle algorithm="Kruskal's minimum spanning tree">Skills</ChartTitle>
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
                                        style={{ left: `calc(28px + ${x} * (100% - 56px))`, top: `calc(28px + ${y} * (100% - 56px) - 1.5rem)`, ...labelAnchor(x) }}
                                    >
                                        {skillCategoryNames[category]}
                                    </span>
                                ))}
                                {selected && (
                                    <span className="stage-label stage-label-selected" style={{ left: selected.x, top: selected.y + 12, ...labelAnchor(selected.nx) }}>
                                        {selected.name}
                                    </span>
                                )}
                            </DemoStage>
                        )}
                        {showStage && <DemoCaption>{caption(state)}</DemoCaption>}
                        {showStage && <DemoControls state={state} call={call} label="Kruskal's algorithm" onShuffle={shuffle} />}
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
