import { STATE, createActors } from '../engine/actors';
import { LINK, createLinks } from '../engine/links';
import { createStage } from '../engine/stage';
import { binarySearchSteps } from '../algorithms/binarySearch';
import { createStepper } from './stepper';
import { watchVisibility } from './visibility';

/**
 * Background: binary search for a JEE rank among every candidate.
 *
 * A band of stars stands for all candidates, ordered by rank from left to right; the bright star
 * in the middle is the probe. Each step compares the probe with the target and rules out half the
 * band (it dims), then the remaining half stretches to fill the band again, like zooming in, and
 * fresh stars fill the space. About 21 steps find one rank among 11.5 lakh.
 *
 * Each binary search step takes two ticks: probe, then zoom.
 */

const STEP_SECONDS = 0.4;

const createRankSearch = async ({ sky, element, onState, animate, total, target }) => {
    const steps = binarySearchSteps(total, target);
    const n = sky.isSmall ? 260 : 520;

    const stage = createStage(element);
    const actors = createActors({ capacity: n, palette: sky.palette });
    const links = createLinks({ capacity: 1, palette: sky.palette });
    stage.group.add(links.object, actors.object);

    const xs = new Float32Array(n); // 0..1 across the band
    const ys = new Float32Array(n); // offset from the band's centre line, in band heights
    const sizes = new Float32Array(n);
    const states = new Array(n).fill(STATE.idle);
    let size = { width: 0, height: 0 };
    let animating = animate;
    let stepIndex = 0;
    let phase = 'ready';

    // Star 0 is the probe, always in the middle of the band
    const scatterStar = (i) => {
        xs[i] = Math.random();
        // Rough Gaussian (sum of uniforms) so the band is dense in the middle, like the Milky Way
        ys[i] = (Math.random() + Math.random() + Math.random() - 1.5) / 3;
        sizes[i] = (sky.isSmall ? 3 : 3.4) + Math.random() * 3;
    };

    const seed = () => {
        for (let i = 1; i < n; i++) scatterStar(i);
        xs[0] = 0.5;
        ys[0] = 0;
        sizes[0] = sky.isSmall ? 14 : 18;
    };

    const toPoints = () => {
        const { width, height } = size;
        const points = new Float32Array(n * 2);
        for (let i = 0; i < n; i++) {
            points[i * 2] = 12 + xs[i] * (width - 24);
            points[i * 2 + 1] = height / 2 + ys[i] * height * 0.9;
        }
        return points;
    };

    const drawProbeLine = (visible) => {
        const { width, height } = size;
        links.set(0, width / 2, 8, width / 2, height - 8, visible ? LINK.candidate : LINK.hidden);
        links.setCount(1);
    };

    const layout = () => {
        size = { width: stage.rect.width, height: stage.rect.height };
        actors.place(toPoints(), { sizes, states });
        drawProbeLine(phase === 'probe');
    };

    const setAll = (fn) => {
        for (let i = 0; i < n; i++) states[i] = fn(i);
        actors.setStates(states);
    };

    const probe = (k) => {
        const { result } = steps[k];
        phase = 'probe';
        // Target below the probe: everything to the right is ruled out, and vice versa
        setAll((i) => {
            if (i === 0) return result === 'found' ? STATE.done : STATE.active;
            if (result === 'found') return STATE.dimmed;
            const right = xs[i] > 0.5;
            return (result === 'lower') === right ? STATE.dimmed : STATE.idle;
        });
        drawProbeLine(result !== 'found');
    };

    const zoom = (k) => {
        const { result } = steps[k];
        phase = 'zoom';
        for (let i = 1; i < n; i++) {
            const keptLeft = result === 'lower' && xs[i] <= 0.5;
            const keptRight = result === 'higher' && xs[i] > 0.5;
            if (keptLeft) xs[i] = xs[i] * 2;
            else if (keptRight) xs[i] = xs[i] * 2 - 1;
            else scatterStar(i);
        }
        for (let i = 0; i < n; i++) states[i] = i === 0 ? STATE.active : STATE.idle;
        // Glide while playing (autoplay or visitor-started); jump when stepping without motion
        if (animating || stepper.state.playing) {
            actors.setStates(states);
            actors.setSizes(sizes);
            actors.settle();
            actors.moveTo(toPoints(), { duration: STEP_SECONDS * 0.9 });
        } else {
            // No motion: jump straight to the zoomed band
            actors.place(toPoints(), { sizes, states });
        }
        drawProbeLine(false);
    };

    const ticks = steps.length * 2 - 1;

    const stepper = createStepper({
        sky,
        total: ticks,
        interval: STEP_SECONDS,
        apply(t) {
            stepIndex = Math.floor(t / 2);
            if (t % 2 === 0) probe(stepIndex);
            else zoom(stepIndex);
        },
        reset() {
            stepIndex = 0;
            phase = 'ready';
            seed();
            states.fill(STATE.idle);
            states[0] = STATE.active;
            layout();
        },
        onChange: () => emit(),
    });

    const emit = () => {
        const s = stepper.state;
        const current = steps[Math.min(stepIndex, steps.length - 1)];
        // After a zoom, show the range the next probe will search
        const shown = phase === 'zoom' && steps[stepIndex + 1] ? steps[stepIndex + 1] : current;
        onState?.({
            ...s,
            phase,
            step: phase === 'ready' ? 0 : stepIndex + 1,
            steps: steps.length,
            total,
            target,
            lo: shown.lo,
            hi: shown.hi,
            mid: shown.mid,
            result: phase === 'probe' ? current.result : null,
            found: s.done,
        });
    };

    stage.sync();
    seed();
    states[0] = STATE.active;
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
                if (Math.abs(rect.width - size.width) > 1 || Math.abs(rect.height - size.height) > 1) layout();
                actors.update(frame.delta);
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

export default createRankSearch;
