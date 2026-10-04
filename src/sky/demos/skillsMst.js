import { STATE, createActors } from '../engine/actors';
import { LINK, createLinks } from '../engine/links';
import { createStage } from '../engine/stage';
import { kruskal } from '../algorithms/kruskal';
import { createStepper } from './stepper';
import { watchVisibility } from './visibility';

/**
 * Skills: Kruskal's minimum spanning tree.
 *
 * Every skill is a star. Kruskal considers the candidate links shortest first: each one flashes
 * gold, then is kept (time accent) or, if it would close a loop, dropped. The result connects every
 * skill with the least total length; skills used together in real work have shorter links, so the
 * tree follows how the technologies are actually used.
 *
 * Picking a skill (chip or star) lights its links in the tree and reports where it was used.
 */

const PAD = 28;
const STEP_SECONDS = 0.07;

const createSkillsMst = async ({ sky, element, onState, animate, graph, playOnStart = false }) => {
    const { nodes, edges } = graph;
    const { steps, weight } = kruskal(nodes.length, edges);
    const treeNeighbours = nodes.map(() => []);

    const stage = createStage(element);
    const actors = createActors({ capacity: nodes.length, palette: sky.palette });
    const links = createLinks({ capacity: steps.length, palette: sky.palette });
    stage.group.add(links.object, actors.object);

    // Skills used in more places shine brighter (bigger)
    const sizes = nodes.map((node) => (sky.isSmall ? 9 : 11) + Math.min(node.usedIn.length, 4) * (sky.isSmall ? 2 : 2.6));
    const points = new Float32Array(nodes.length * 2);
    const nodeStates = new Array(nodes.length).fill(STATE.idle);
    const connected = new Array(nodes.length).fill(false);
    const linkStates = new Array(steps.length).fill(LINK.candidate);
    let kept = 0;
    let selected = -1;
    let size = { width: 0, height: 0 };
    let animating = animate;

    const layout = () => {
        const { width, height } = stage.rect;
        size = { width, height };
        nodes.forEach((node, i) => {
            points[i * 2] = PAD + node.x * (width - PAD * 2);
            points[i * 2 + 1] = PAD + node.y * (height - PAD * 2);
        });
        actors.place(points, { sizes, states: nodeStates });
        steps.forEach(({ edge }, i) => {
            const { u, v } = edges[edge];
            links.set(i, points[u * 2], points[u * 2 + 1], points[v * 2], points[v * 2 + 1], linkStates[i]);
        });
    };

    const nodeState = (i) => {
        if (selected === -1) return connected[i] ? STATE.done : STATE.idle;
        if (i === selected) return STATE.active;
        return treeNeighbours[selected].includes(i) ? STATE.done : STATE.dimmed;
    };

    const refreshNodes = () => {
        for (let i = 0; i < nodes.length; i++) nodeStates[i] = nodeState(i);
        actors.setStates(nodeStates);
    };

    const setLink = (i, state) => {
        linkStates[i] = state;
        links.setState(i, state);
    };

    // Re-colour the links for the current selection: the selected skill's tree links become the "path"
    const refreshSelection = () => {
        steps.forEach(({ edge, accepted }, i) => {
            if (i >= links.count || linkStates[i] === LINK.hidden || linkStates[i] === LINK.candidate) return;
            if (!accepted) return;
            const { u, v } = edges[edge];
            const touches = selected !== -1 && (u === selected || v === selected);
            setLink(i, touches ? LINK.path : LINK.kept);
        });
        refreshNodes();
    };

    const resolve = (i) => {
        const { edge, accepted } = steps[i];
        const { u, v } = edges[edge];
        if (accepted) {
            setLink(i, LINK.kept);
            connected[u] = true;
            connected[v] = true;
            treeNeighbours[u].push(v);
            treeNeighbours[v].push(u);
            kept += 1;
        } else {
            setLink(i, LINK.hidden);
        }
    };

    let lastShown = -1;

    const stepper = createStepper({
        sky,
        total: steps.length,
        interval: STEP_SECONDS,
        apply(i) {
            if (lastShown >= 0) resolve(lastShown);
            const { u, v } = edges[steps[i].edge];
            setLink(i, LINK.candidate);
            links.setCount(i + 1);
            lastShown = i;
            refreshNodes();
            actors.setState(u, STATE.active);
            actors.setState(v, STATE.active);
            if (i === steps.length - 1) {
                resolve(i);
                lastShown = -1;
                refreshSelection();
            }
        },
        reset() {
            kept = 0;
            lastShown = -1;
            connected.fill(false);
            treeNeighbours.forEach((list) => { list.length = 0; });
            linkStates.fill(LINK.candidate);
            links.setCount(0);
            refreshNodes();
        },
        finish() {
            kept = 0;
            connected.fill(false);
            treeNeighbours.forEach((list) => { list.length = 0; });
            for (let i = 0; i < steps.length; i++) {
                setLink(i, LINK.candidate);
                resolve(i);
            }
            lastShown = -1;
            links.setCount(steps.length);
            refreshSelection();
        },
        onChange: () => emit(),
    });

    const emit = () => {
        const s = stepper.state;
        onState?.({
            ...s,
            checked: Math.min(s.index, steps.length),
            kept,
            nodes: nodes.length,
            totalLinks: nodes.length - 1,
            weight,
            selected: selected === -1 ? null : {
                name: nodes[selected].name,
                nx: nodes[selected].x,
                usedIn: nodes[selected].usedIn,
                neighbours: treeNeighbours[selected].map((j) => nodes[j].name),
                x: points[selected * 2],
                y: points[selected * 2 + 1],
            },
        });
    };

    const select = (index) => {
        selected = index === selected ? -1 : index;
        refreshSelection();
        emit();
        sky.requestRender();
    };

    // Tapping a star selects the nearest skill
    const onPointerDown = (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        let best = -1;
        let bestDistance = sky.isSmall ? 26 : 20;
        for (let i = 0; i < nodes.length; i++) {
            const d = Math.hypot(points[i * 2] - x, points[i * 2 + 1] - y);
            if (d < bestDistance) {
                best = i;
                bestDistance = d;
            }
        }
        if (best !== -1) select(best);
    };
    element.addEventListener('click', onPointerDown);

    stage.sync();
    layout();
    refreshNodes();

    // Start when the stage is mostly in view; without motion, show the finished tree
    // Autoplay, or play straight away when the visitor asked for a new layout
    const stopWatching = watchVisibility(element, () => {
        if (animating || playOnStart) stepper.play();
        else stepper.complete();
        sky.requestRender();
    });
    emit();

    return {
        layer: {
            object: stage.group,
            update(frame) {
                const rect = stage.sync();
                if (Math.abs(rect.width - size.width) > 1 || Math.abs(rect.height - size.height) > 1) layout();
                if (frame.delta > 0) stepper.update(frame.delta);
            },
            dispose() {
                actors.dispose();
                links.dispose();
                stage.dispose();
            },
        },
        play: () => stepper.play(),
        pause: () => stepper.pause(),
        toggle: () => stepper.toggle(),
        step: () => {
            stepper.step();
            sky.requestRender();
        },
        // Visitor-started playback runs even when autoplay is off (paused sky, reduced motion)
        replay: () => {
            stepper.replay();
            sky.requestRender();
        },
        setSpeed: (speed) => stepper.setSpeed(speed),
        selectByName: (name) => select(nodes.findIndex((node) => node.name === name)),
        setAnimate(value) {
            animating = value;
            if (!value && stepper.state.playing) stepper.complete();
        },
        dispose() {
            stepper.dispose();
            stopWatching();
            element.removeEventListener('click', onPointerDown);
        },
    };
};

export default createSkillsMst;
