import { STATE, createActors } from '../engine/actors';
import { LINK, createLinks } from '../engine/links';
import { createStage } from '../engine/stage';
import { dijkstra } from '../algorithms/dijkstra';
import { createStepper } from './stepper';
import { watchVisibility } from './visibility';

/**
 * Experience: Dijkstra's shortest path through a field of stars, from where I started to where
 * I am now. The search spreads out from the start, always settling the closest star next; then
 * the shortest route lights up in gold, passing each career milestone in order.
 *
 * Choosing a milestone (from the timeline) re-runs the search to that milestone.
 */

const PAD = 24;
const STEP_SECONDS = 0.045;

const createCareerPath = async ({ sky, element, onState, animate, graph }) => {
    const { nodes, edges } = graph;
    const milestoneCount = nodes.filter((node) => node.milestone).length;

    const stage = createStage(element);
    const actors = createActors({ capacity: nodes.length, palette: sky.palette });
    const links = createLinks({ capacity: edges.length, palette: sky.palette });
    stage.group.add(links.object, actors.object);

    const sizes = nodes.map((node) => (node.milestone ? (sky.isSmall ? 13 : 16) : (sky.isSmall ? 6 : 7)));
    const points = new Float32Array(nodes.length * 2);
    const nodeStates = new Array(nodes.length).fill(STATE.idle);
    const linkStates = new Array(edges.length).fill(LINK.faint);
    let size = { width: 0, height: 0 };
    let animating = animate;

    let target = milestoneCount - 1;
    let result = dijkstra(nodes.length, edges, 0, target);
    let settledSoFar = 0;
    let traced = 0;
    let current = -1;

    const layout = () => {
        const { width, height } = stage.rect;
        size = { width, height };
        nodes.forEach((node, i) => {
            points[i * 2] = PAD + node.x * (width - PAD * 2);
            points[i * 2 + 1] = PAD + node.y * (height - PAD * 2);
        });
        actors.place(points, { sizes, states: nodeStates });
        edges.forEach(({ u, v }, i) => links.set(i, points[u * 2], points[u * 2 + 1], points[v * 2], points[v * 2 + 1], linkStates[i]));
        links.setCount(edges.length);
    };

    const setNode = (i, state) => {
        nodeStates[i] = state;
        actors.setState(i, state);
    };

    const setLink = (i, state) => {
        linkStates[i] = state;
        links.setState(i, state);
    };

    const reached = () => {
        const onPath = result.path.slice(0, traced + (traced > 0 ? 1 : 0));
        return onPath.filter((i) => i < milestoneCount);
    };

    const totalSteps = () => result.steps.length + result.pathEdges.length;

    const stepper = createStepper({
        total: totalSteps(),
        interval: STEP_SECONDS,
        apply(i) {
            if (current !== -1 && nodeStates[current] === STATE.active && traced === 0) setNode(current, STATE.done);
            if (i < result.steps.length) {
                const step = result.steps[i];
                if (step.type === 'settle') {
                    settledSoFar += 1;
                    current = step.node;
                    setNode(step.node, STATE.active);
                } else {
                    setLink(step.edge, LINK.kept);
                }
                return;
            }
            // Trace the shortest route, one link at a time
            const k = i - result.steps.length;
            if (k === 0) {
                // Dim the exploration so the route stands out
                for (let e = 0; e < edges.length; e++) if (linkStates[e] === LINK.kept) setLink(e, LINK.faint);
                nodes.forEach((_, n) => { if (nodeStates[n] !== STATE.idle) setNode(n, STATE.dimmed); });
                setNode(result.path[0], STATE.active);
            }
            setLink(result.pathEdges[k], LINK.path);
            setNode(result.path[k + 1], STATE.active);
            traced = k + 1;
        },
        reset() {
            settledSoFar = 0;
            traced = 0;
            current = -1;
            nodeStates.fill(STATE.idle);
            linkStates.fill(LINK.faint);
            actors.setStates(nodeStates);
            for (let e = 0; e < edges.length; e++) links.setState(e, LINK.faint);
        },
        onChange: () => emit(),
    });

    const emit = () => {
        const s = stepper.state;
        onState?.({
            ...s,
            target,
            settled: settledSoFar,
            stars: nodes.length,
            hops: result.pathEdges.length,
            tracing: traced > 0,
            reached: reached().map((i) => nodes[i].id),
            milestones: nodes.slice(0, milestoneCount).map((node, i) => ({
                id: node.id,
                label: node.label,
                x: points[i * 2],
                y: points[i * 2 + 1],
            })),
        });
    };

    stage.sync();
    layout();

    const stopWatching = watchVisibility(element, () => {
        if (animating) stepper.play();
        else stepper.complete();
        sky.requestRender();
    });
    emit();

    return {
        layer: {
            object: stage.group,
            update(frame) {
                const rect = stage.sync();
                if (Math.abs(rect.width - size.width) > 1 || Math.abs(rect.height - size.height) > 1) {
                    layout();
                    emit();
                }
                if (frame.delta > 0) stepper.update(frame.delta);
            },
            dispose() {
                actors.dispose();
                links.dispose();
                stage.dispose();
            },
        },
        toggle: () => stepper.toggle(),
        step: () => {
            stepper.step();
            sky.requestRender();
        },
        replay: () => {
            if (animating) stepper.replay();
            else stepper.restart();
            sky.requestRender();
        },
        setSpeed: (speed) => stepper.setSpeed(speed),
        /** Re-run the search to another milestone (by id) */
        routeTo(id) {
            const index = nodes.findIndex((node) => node.id === id);
            if (index < 0) return;
            target = index;
            result = dijkstra(nodes.length, edges, 0, target);
            stepper.setTotal(totalSteps());
            if (animating) stepper.replay();
            else stepper.complete();
            sky.requestRender();
        },
        setAnimate(value) {
            animating = value;
            if (!value && stepper.state.playing) stepper.complete();
        },
        dispose() {
            stopWatching();
        },
    };
};

export default createCareerPath;
