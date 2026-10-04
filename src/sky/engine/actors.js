import { AdditiveBlending, Color, DynamicDrawUsage, InstancedBufferAttribute, PointsNodeMaterial, Sprite } from 'three/webgpu';
import { float, instancedBufferAttribute, mix, saturate, sin, step, time, uniform, uv, vec3 } from 'three/tsl';
import { SIGNAL } from '../palette';

/**
 * Actors: the stars that perform algorithms.
 *
 * One instanced Sprite drawn by the pixel-space overlay camera. Each star has a "from" and "to"
 * position (CSS pixels, y down, relative to its stage), and the GPU eases between them using
 * a per-star delay, so a whole algorithm step costs one buffer upload instead of per-frame work.
 *
 * Per-star data: size (px), state, delay (s), twinkle phase
 * States: 0 idle (starlight), 1 active (signal gold), 2 done (time accent), 3 dimmed
 * Optional "scatter" offset lets a stage push stars outwards continuously (uniform `spread`).
 */

export const STATE = { idle: 0, active: 1, done: 2, dimmed: 3 };

const STARLIGHT = new Color('#e8ecf8');
const GOLD = new Color(SIGNAL);

export const createActors = ({ capacity, palette }) => {
    const attr = (itemSize) => {
        const attribute = new InstancedBufferAttribute(new Float32Array(capacity * itemSize), itemSize);
        attribute.setUsage(DynamicDrawUsage);
        return attribute;
    };

    const from = attr(3);
    const to = attr(3);
    const scatter = attr(3);
    const data = attr(4);

    const uniforms = {
        clock: uniform(0),
        duration: uniform(0.6),
        spread: uniform(0),
        opacity: uniform(1),
    };

    const aFrom = instancedBufferAttribute(from);
    const aTo = instancedBufferAttribute(to);
    const aScatter = instancedBufferAttribute(scatter);
    const aData = instancedBufferAttribute(data);

    // Per-star progress with its own delay, eased out (strong ease-out: 1 - (1 - t)^3)
    const t = saturate(uniforms.clock.sub(aData.z).div(uniforms.duration));
    const eased = float(1).sub(float(1).sub(t).pow(3));
    const position = mix(aFrom, aTo, eased).add(aScatter.mul(uniforms.spread));

    const material = new PointsNodeMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        sizeAttenuation: false,
    });
    material.positionNode = vec3(position.x, position.y.negate(), 0);
    material.sizeNode = aData.x;

    // State -> colour and brightness
    const state = aData.y;
    const isActive = step(0.5, state).mul(step(state, 1.5));
    const isDone = step(1.5, state).mul(step(state, 2.5));
    const isDimmed = step(2.5, state);

    const gold = uniform(GOLD);
    const starlight = uniform(STARLIGHT);
    material.colorNode = mix(mix(starlight, gold, isActive), palette.light, isDone);

    const brightness = mix(mix(mix(float(0.8), float(1), isActive), float(1), isDone), float(0.18), isDimmed);
    const falloff = float(1).sub(uv().sub(0.5).length().mul(2)).saturate();
    const glow = falloff.pow(5).add(falloff.pow(2).mul(0.18));
    const twinkle = sin(time.mul(1.3).add(aData.w)).mul(0.12).add(0.88);
    material.opacityNode = glow.mul(brightness).mul(twinkle).mul(uniforms.opacity);

    const sprite = new Sprite(material);
    sprite.count = 0;
    sprite.visible = false;
    sprite.frustumCulled = false;
    sprite.renderOrder = 2;

    let maxDelay = 0;

    const markDirty = (...attributes) => attributes.forEach((a) => { a.needsUpdate = true; });

    return {
        object: sprite,
        uniforms,
        capacity,
        get count() {
            return sprite.count;
        },
        setCount(n) {
            sprite.count = Math.min(n, capacity);
            sprite.visible = sprite.count > 0;
        },

        /**
         * Place stars immediately (no transition). points: Float32Array/array of [x, y] pairs
         */
        place(points, { size = 3, state = STATE.idle, sizes, states } = {}) {
            const n = Math.min(points.length / 2, capacity);
            for (let i = 0; i < n; i++) {
                const x = points[i * 2];
                const y = points[i * 2 + 1];
                from.array.set([x, y, 0], i * 3);
                to.array.set([x, y, 0], i * 3);
                data.array[i * 4] = sizes ? sizes[i] : size;
                data.array[i * 4 + 1] = states ? states[i] : state;
                data.array[i * 4 + 2] = 0;
                data.array[i * 4 + 3] = Math.random() * Math.PI * 2;
            }
            sprite.count = n;
            sprite.visible = n > 0;
            maxDelay = 0;
            uniforms.clock.value = uniforms.duration.value;
            markDirty(from, to, data);
        },

        /**
         * Move stars to new positions. Each star starts from where it currently is
         * (call settle() first if a previous move may still be running).
         * delays: per-star start delay in seconds (optional)
         */
        moveTo(points, { duration = 0.6, delays } = {}) {
            const n = Math.min(points.length / 2, sprite.count);
            maxDelay = 0;
            for (let i = 0; i < n; i++) {
                to.array[i * 3] = points[i * 2];
                to.array[i * 3 + 1] = points[i * 2 + 1];
                const delay = delays ? delays[i] : 0;
                data.array[i * 4 + 2] = delay;
                if (delay > maxDelay) maxDelay = delay;
            }
            uniforms.duration.value = duration;
            uniforms.clock.value = 0;
            markDirty(to, data);
        },

        /** Snap the current transition to its end, making "to" the new "from" */
        settle() {
            from.array.set(to.array.subarray(0, sprite.count * 3));
            uniforms.clock.value = uniforms.duration.value + maxDelay;
            markDirty(from);
        },

        /** Move one star instantly (for fast step-by-step algorithms) */
        setPosition(index, x, y) {
            from.array[index * 3] = x;
            from.array[index * 3 + 1] = y;
            to.array[index * 3] = x;
            to.array[index * 3 + 1] = y;
            markDirty(from, to);
        },

        setStates(states) {
            for (let i = 0; i < Math.min(states.length, sprite.count); i++) data.array[i * 4 + 1] = states[i];
            markDirty(data);
        },

        setState(index, state) {
            data.array[index * 4 + 1] = state;
            markDirty(data);
        },

        setSizes(sizes) {
            for (let i = 0; i < Math.min(sizes.length, sprite.count); i++) data.array[i * 4] = sizes[i];
            markDirty(data);
        },

        /** Outward offsets used with uniforms.spread (e.g. scatter on scroll) */
        setScatter(offsets) {
            scatter.array.set(offsets.subarray ? offsets.subarray(0, sprite.count * 3) : offsets);
            markDirty(scatter);
        },

        get isMoving() {
            return uniforms.clock.value < uniforms.duration.value + maxDelay;
        },

        /** Advance the transition clock; returns true when the move has finished */
        update(delta) {
            const end = uniforms.duration.value + maxDelay;
            if (uniforms.clock.value < end) {
                uniforms.clock.value = Math.min(uniforms.clock.value + delta, end);
                return uniforms.clock.value >= end;
            }
            return false;
        },

        dispose() {
            material.dispose();
        },
    };
};
