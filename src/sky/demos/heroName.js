import { createActors } from '../engine/actors';
import { createStage } from '../engine/stage';
import { pairByAxis } from '../algorithms/assignment';
import { sampleTextPoints } from '../algorithms/textPoints';
import { waitForCurtain } from '../../utils/curtain';

/**
 * Hero: stars form the name.
 *
 * Stars start scattered across the hero and fly to points sampled from the real <h1>.
 * Pairing is done by sorting both sets left to right (see pairByAxis), so the stars sweep in
 * without criss-crossing. Once formed, the star-name replaces the DOM text visually; scrolling
 * down scatters the stars outward, scrolling back up re-forms the name.
 */

const SEEN_KEY = 'heroNameSeen';

const readSeen = () => {
    try {
        return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
        return false;
    }
};

const markSeen = () => {
    try {
        sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
        // Storage unavailable: the intro plays again next visit
    }
};

const createHeroName = async ({ sky, element, onState, animate }) => {
    // Dense enough that thin serif strokes read as solid lines of starlight
    const count = sky.isSmall ? 3000 : 6500;
    const stage = createStage(element);
    const actors = createActors({ capacity: count, palette: sky.palette });
    stage.group.add(actors.object);

    let targets = await sampleTextPoints(element, count);
    if (targets.length === 0) throw new Error('Could not sample heading text');

    const sizes = Float32Array.from({ length: count }, () => (sky.isSmall ? 1.5 : 1.8) + Math.random() * (sky.isSmall ? 1 : 1.3));

    // Outward scatter directions for scrolling away (px)
    const scatter = new Float32Array(count * 3);
    const writeScatter = () => {
        const { width } = stage.rect;
        for (let i = 0; i < count; i++) {
            const dx = targets[i * 2] - width / 2;
            const dy = targets[i * 2 + 1] - stage.rect.height / 2;
            const length = Math.hypot(dx, dy) || 1;
            const push = 120 + Math.random() * 420;
            scatter[i * 3] = (dx / length) * push + (Math.random() - 0.5) * 160;
            scatter[i * 3 + 1] = (dy / length) * push - 120 - Math.random() * 260;
        }
        actors.setScatter(scatter);
    };

    // Random start positions across the visible hero, in stage-local coordinates
    const scatteredStart = () => {
        const { left, top } = stage.sync();
        return Float32Array.from({ length: count * 2 }, (_, k) => (k % 2 === 0
            ? Math.random() * window.innerWidth - left
            : Math.random() * window.innerHeight - top));
    };

    let phase = 'idle';
    let animating = animate;
    let disposed = false;
    // Keeps the sky's loop awake for a visitor-started replay while autoplay is off
    let release = null;
    const letGo = () => {
        release?.();
        release = null;
    };

    const emit = () => onState?.({ phase, stars: count });

    const finish = () => {
        actors.settle();
        letGo();
        phase = 'formed';
        markSeen();
        emit();
    };

    const form = ({ fly }) => {
        stage.sync();
        if (!fly) {
            actors.place(targets, { sizes });
            writeScatter();
            finish();
            return;
        }
        const sources = scatteredStart();
        const order = pairByAxis(sources, targets);
        const assigned = new Float32Array(count * 2);
        for (let i = 0; i < count; i++) {
            assigned[i * 2] = targets[order[i] * 2];
            assigned[i * 2 + 1] = targets[order[i] * 2 + 1];
        }
        targets = assigned;
        actors.place(sources, { sizes });
        writeScatter();

        // Ready in the starting positions; fly once the page curtain has lifted
        phase = 'ready';
        emit();
        waitForCurtain().then(() => {
            if (disposed || phase !== 'ready') return;
            // Sweep left to right, with a little randomness so it feels organic
            const width = stage.rect.width || 1;
            const delays = Float32Array.from({ length: count }, (_, i) => (targets[i * 2] / width) * 0.55 + Math.random() * 0.3);
            actors.moveTo(targets, { duration: 1.1, delays });
            phase = 'forming';
            emit();
        });
    };

    // Skip the intro on any interaction
    const skip = () => {
        if (phase === 'ready') {
            actors.place(targets, { sizes });
            finish();
        } else if (phase === 'forming') {
            finish();
        }
    };
    window.addEventListener('pointerdown', skip, { passive: true });
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });

    // Re-sample when the heading reflows (resize, font swap)
    let resizeTimer = 0;
    let lastWidth = stage.rect.width;
    const resizeObserver = new ResizeObserver(() => {
        if (Math.abs(element.getBoundingClientRect().width - lastWidth) < 1) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(async () => {
            lastWidth = element.getBoundingClientRect().width;
            targets = await sampleTextPoints(element, count);
            if (targets.length) form({ fly: false });
            sky.requestRender();
        }, 150);
    });
    resizeObserver.observe(element);

    form({ fly: animating && !readSeen() });

    const layer = {
        object: stage.group,
        update(frame) {
            stage.sync();
            if (phase === 'forming' && actors.update(frame.delta)) finish();

            // Scroll away scatters the name; scrolling back re-forms it
            const p = Math.min(Math.max(frame.scrollY / (frame.height * 0.55), 0), 1);
            actors.uniforms.spread.value = animating ? p * p : 0;
            actors.uniforms.opacity.value = 1 - p * 0.85;
        },
        dispose() {
            actors.dispose();
            stage.dispose();
        },
    };

    return {
        layer,
        setAnimate(value) {
            animating = value;
            if (!value) skip();
        },
        replay() {
            if (!animating && !release) release = sky.holdAnimation();
            form({ fly: true });
        },
        dispose() {
            disposed = true;
            letGo();
            clearTimeout(resizeTimer);
            resizeObserver.disconnect();
            window.removeEventListener('pointerdown', skip);
            window.removeEventListener('keydown', skip);
            window.removeEventListener('wheel', skip);
        },
    };
};

export default createHeroName;
