import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, DynamicDrawUsage, LineBasicNodeMaterial, LineSegments } from 'three/webgpu';
import { attribute, uniform, vec4 } from 'three/tsl';
import { SIGNAL } from '../palette';

/**
 * Links: thin lines between stars (MST edges, shortest paths, network routes).
 *
 * One LineSegments object drawn by the pixel-space overlay camera. Coordinates are CSS pixels
 * relative to the stage, y down. Each link has a state that maps to a colour:
 *   faint   - an available connection (hairline)
 *   candidate - being considered right now (signal gold)
 *   kept    - accepted into the result (time accent)
 *   rejected - considered and dropped
 *   path    - the final answer (bright gold)
 *   hidden  - not drawn (e.g. a rejected link after its flash)
 */

export const LINK = { faint: 0, candidate: 1, kept: 2, rejected: 3, path: 4, hidden: 5 };

const GOLD = new Color(SIGNAL);
const STARLIGHT = new Color('#e8ecf8');

export const createLinks = ({ capacity, palette }) => {
    const positions = new BufferAttribute(new Float32Array(capacity * 6), 3);
    const colors = new BufferAttribute(new Float32Array(capacity * 6), 3);
    positions.setUsage(DynamicDrawUsage);
    colors.setUsage(DynamicDrawUsage);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', positions);
    geometry.setAttribute('color', colors);
    geometry.setDrawRange(0, 0);

    const opacity = uniform(1);
    const material = new LineBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
    });
    material.colorNode = vec4(attribute('color', 'vec3').mul(opacity), 1);

    const lines = new LineSegments(geometry, material);
    lines.frustumCulled = false;
    // Nothing to draw yet: skip the draw call entirely
    lines.visible = false;
    lines.renderOrder = 1;

    const states = new Uint8Array(capacity);
    let count = 0;
    const scratch = new Color();

    const colorFor = (state) => {
        switch (state) {
            case LINK.candidate: return scratch.copy(GOLD).multiplyScalar(0.85);
            case LINK.kept: return scratch.copy(palette.light.value).multiplyScalar(0.7);
            case LINK.rejected: return scratch.copy(STARLIGHT).multiplyScalar(0.1);
            case LINK.path: return scratch.copy(GOLD);
            case LINK.hidden: return scratch.setRGB(0, 0, 0);
            default: return scratch.copy(STARLIGHT).multiplyScalar(0.1);
        }
    };

    const writeColor = (i) => {
        const c = colorFor(states[i]);
        colors.array.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    };

    return {
        object: lines,
        opacity,
        get count() {
            return count;
        },

        /** Set link i between two points (CSS px, y down) */
        set(i, x1, y1, x2, y2, state = LINK.faint) {
            positions.array.set([x1, -y1, 0, x2, -y2, 0], i * 6);
            states[i] = state;
            writeColor(i);
            positions.needsUpdate = true;
            colors.needsUpdate = true;
        },

        setState(i, state) {
            states[i] = state;
            writeColor(i);
            colors.needsUpdate = true;
        },

        getState(i) {
            return states[i];
        },

        /** How many links are drawn (links are revealed in order) */
        setCount(n) {
            count = Math.min(n, capacity);
            geometry.setDrawRange(0, count * 2);
            lines.visible = count > 0;
        },

        /** Re-tint kept links after the time-of-day accent changes */
        refreshColors() {
            for (let i = 0; i < count; i++) writeColor(i);
            colors.needsUpdate = true;
        },

        dispose() {
            geometry.dispose();
            material.dispose();
        },
    };
};
