import { STATE, createActors } from '../engine/actors';
import { LINK, createLinks } from '../engine/links';
import { createStage } from '../engine/stage';
import { OP, SORTS, makeDataset } from '../algorithms/sorts';
import { createStepper } from './stepper';
import { watchVisibility } from './visibility';

/**
 * Projects: a sorting race.
 *
 * Every lane sorts the same numbers. Each number is a star: across = its position in the array,
 * up = its value, so a sorted lane is a rising diagonal. Faint lines join neighbouring positions,
 * and the scribble straightens into a line as the sort progresses. Each tick, every lane performs
 * one recorded operation (compare, swap, write), so the race is fair.
 *
 * Lane boxes come from the DOM ([data-lane] elements inside the stage), so layout is pure CSS.
 */

const OPS_PER_SECOND = 120;
const PAD = 10;

const createSortRace = async ({ sky, element, onState, animate, lanes: laneKeys, size: n }) => {
    const stage = createStage(element);
    const capacity = laneKeys.length * n;
    const actors = createActors({ capacity, palette: sky.palette });
    const links = createLinks({ capacity: laneKeys.length * (n - 1), palette: sky.palette });
    stage.group.add(links.object, actors.object);

    let dataset = 'random';
    let values = makeDataset(dataset, n);
    let animating = animate;

    // Per-lane replay state
    const lanes = laneKeys.map((key, l) => ({
        key,
        name: SORTS[key].name,
        complexity: SORTS[key].complexity,
        base: l * n, // first star index for this lane
        ops: [],
        comparisons: 0,
        total: 0,
        array: [], // array[i] = value at position i
        position: [], // position[v] = where value v's star is drawn
        active: [],
        done: new Set(),
        finishedAt: 0,
        box: { x: 0, y: 0, width: 1, height: 1 },
    }));

    let finishOrder = [];

    const readBoxes = () => {
        const origin = element.getBoundingClientRect();
        element.querySelectorAll('[data-lane]').forEach((box, l) => {
            const r = box.getBoundingClientRect();
            if (lanes[l]) lanes[l].box = { x: r.left - origin.left, y: r.top - origin.top, width: r.width, height: r.height };
        });
    };

    const pointFor = (lane, index, value) => {
        const { x, y, width, height } = lane.box;
        return [
            x + PAD + ((index + 0.5) / n) * (width - PAD * 2),
            y + height - PAD - (value / n) * (height - PAD * 2),
        ];
    };

    const drawLink = (lane, k) => {
        if (k < 0 || k >= n - 1) return;
        const [x1, y1] = pointFor(lane, k, lane.array[k]);
        const [x2, y2] = pointFor(lane, k + 1, lane.array[k + 1]);
        const inOrder = lane.array[k] < lane.array[k + 1];
        links.set(lane.base - lane.base / n + k, x1, y1, x2, y2, inOrder && lane.done.has(k) ? LINK.kept : LINK.faint);
    };

    const starState = (lane, value) => {
        const index = lane.position[value];
        if (lane.active.includes(index)) return STATE.active;
        if (lane.done.has(index)) return STATE.done;
        return STATE.idle;
    };

    const drawStar = (lane, value) => {
        const [x, y] = pointFor(lane, lane.position[value], value);
        actors.setPosition(lane.base + value - 1, x, y);
        actors.setState(lane.base + value - 1, starState(lane, value));
    };

    const drawLane = (lane) => {
        for (let v = 1; v <= n; v++) drawStar(lane, v);
        for (let k = 0; k < n - 1; k++) drawLink(lane, k);
    };

    const resetLane = (lane) => {
        const result = SORTS[lane.key].run(values);
        lane.ops = result.ops;
        lane.total = result.comparisons;
        lane.comparisons = 0;
        lane.array = values.slice();
        lane.position = [];
        lane.array.forEach((v, i) => { lane.position[v] = i; });
        lane.active = [];
        lane.done = new Set();
        lane.finishedAt = 0;
    };

    const placeAll = () => {
        const points = new Float32Array(capacity * 2);
        lanes.forEach((lane) => {
            for (let v = 1; v <= n; v++) {
                const [x, y] = pointFor(lane, lane.position[v], v);
                points[(lane.base + v - 1) * 2] = x;
                points[(lane.base + v - 1) * 2 + 1] = y;
            }
        });
        actors.place(points, { size: sky.isSmall ? 7 : 8 });
        links.setCount(lanes.length * (n - 1));
        lanes.forEach(drawLane);
    };

    const setActive = (lane, indices) => {
        const previous = lane.active;
        lane.active = indices;
        previous.forEach((i) => drawStar(lane, lane.array[i]));
        indices.forEach((i) => drawStar(lane, lane.array[i]));
    };

    const applyOp = (lane, op, tick) => {
        const [type, i, j] = op;
        if (type === OP.compare) {
            lane.comparisons += 1;
            setActive(lane, [i, j]);
        } else if (type === OP.swap) {
            const a = lane.array[i];
            const b = lane.array[j];
            lane.array[i] = b;
            lane.array[j] = a;
            lane.position[a] = j;
            lane.position[b] = i;
            setActive(lane, [i, j]);
            [i - 1, i, j - 1, j].forEach((k) => drawLink(lane, k));
        } else if (type === OP.write) {
            lane.array[i] = j;
            lane.position[j] = i;
            setActive(lane, [i]);
            [i - 1, i].forEach((k) => drawLink(lane, k));
        } else if (type === OP.done) {
            lane.done.add(i);
            drawStar(lane, lane.array[i]);
            [i - 1, i].forEach((k) => drawLink(lane, k));
        }
        if (tick === lane.ops.length - 1) {
            setActive(lane, []);
            lane.finishedAt = tick + 1;
            finishOrder.push(lane.key);
        }
    };

    const longest = () => Math.max(...lanes.map((lane) => lane.ops.length));

    const stepper = createStepper({
        sky,
        total: 0,
        interval: 1 / OPS_PER_SECOND,
        apply(tick) {
            lanes.forEach((lane) => {
                if (tick < lane.ops.length) applyOp(lane, lane.ops[tick], tick);
            });
        },
        reset() {
            // Every run sorts new numbers
            values = makeDataset(dataset, n);
            finishOrder = [];
            lanes.forEach(resetLane);
            stepper.setTotal(longest());
            readBoxes();
            placeAll();
        },
        finish() {
            finishOrder = [];
            lanes.forEach(resetLane);
            const total = longest();
            for (let tick = 0; tick < total; tick++) {
                lanes.forEach((lane) => {
                    if (tick < lane.ops.length) applyOp(lane, lane.ops[tick], tick);
                });
            }
            readBoxes();
            lanes.forEach(drawLane);
        },
        onChange: () => emit(),
    });

    const emit = () => {
        const s = stepper.state;
        onState?.({
            ...s,
            dataset,
            size: n,
            finishOrder: [...finishOrder],
            lanes: lanes.map((lane) => ({
                key: lane.key,
                name: lane.name,
                complexity: lane.complexity,
                comparisons: lane.comparisons,
                finished: lane.finishedAt > 0,
            })),
        });
    };

    const rebuild = () => {
        lanes.forEach(resetLane);
        stepper.setTotal(longest());
        readBoxes();
        placeAll();
    };

    stage.sync();
    rebuild();

    let lastSize = { width: stage.rect.width, height: stage.rect.height };
    const stopWatching = watchVisibility(element, () => {
        if (animating) stepper.play();
        else stepper.complete();
        sky.requestRender();
    }, 0.4);
    emit();

    return {
        layer: {
            object: stage.group,
            update(frame) {
                const rect = stage.sync();
                if (Math.abs(rect.width - lastSize.width) > 1 || Math.abs(rect.height - lastSize.height) > 1) {
                    lastSize = { width: rect.width, height: rect.height };
                    readBoxes();
                    lanes.forEach(drawLane);
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
        // Visitor-started playback runs even when autoplay is off (paused sky, reduced motion)
        replay: () => {
            stepper.replay();
            sky.requestRender();
        },
        setSpeed: (speed) => stepper.setSpeed(speed),
        /** New data of the given kind ('random', 'nearly', 'reversed') and start again */
        setDataset(kind) {
            dataset = kind;
            values = makeDataset(kind, n);
            rebuild();
            stepper.replay();
            sky.requestRender();
        },
        setAnimate(value) {
            animating = value;
            if (!value && stepper.state.playing) stepper.complete();
        },
        dispose() {
            stepper.dispose();
            stopWatching();
        },
    };
};

export default createSortRace;
