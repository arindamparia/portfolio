import { STATE, createActors } from '../engine/actors';
import { LINK, createLinks } from '../engine/links';
import { createStage } from '../engine/stage';
import { dijkstra } from '../algorithms/dijkstra';

/**
 * Contact: a message travels as a packet of light through a small network of relay stars.
 *
 * Node 0 is the sender ("You"), node 1 is me. When a message is sent, Dijkstra picks the
 * shortest route and the packet hops along it. If sending fails, the packet stops halfway and
 * dims, matching the error message under the form.
 */

const PAD = 22;
const HOP_SECONDS = 0.28;

const createContactRoute = async ({ sky, element, onState, animate, graph }) => {
    const { nodes, edges } = graph;
    const route = dijkstra(nodes.length, edges, 0, 1);

    const stage = createStage(element);
    // One extra actor is the packet itself
    const actors = createActors({ capacity: nodes.length + 1, palette: sky.palette });
    const links = createLinks({ capacity: edges.length, palette: sky.palette });
    stage.group.add(links.object, actors.object);

    const packet = nodes.length;
    const points = new Float32Array((nodes.length + 1) * 2);
    const sizes = new Float32Array(nodes.length + 1);
    const states = new Array(nodes.length + 1).fill(STATE.idle);
    nodes.forEach((node, i) => { sizes[i] = node.milestone ? (sky.isSmall ? 13 : 15) : (sky.isSmall ? 5 : 6); });
    sizes[packet] = sky.isSmall ? 18 : 22;

    let animating = animate;
    let size = { width: 0, height: 0 };
    let phase = 'idle'; // idle | sending | delivered | failed
    let hop = 0;
    let stopAt = route.pathEdges.length;
    let hopClock = 0;

    const pointOf = (i) => [points[i * 2], points[i * 2 + 1]];

    const layout = () => {
        const { width, height } = stage.rect;
        size = { width, height };
        nodes.forEach((node, i) => {
            points[i * 2] = PAD + node.x * (width - PAD * 2);
            points[i * 2 + 1] = PAD + node.y * (height - PAD * 2);
        });
        const at = route.path[Math.min(hop, route.path.length - 1)];
        [points[packet * 2], points[packet * 2 + 1]] = pointOf(at);
        // The packet is hidden (tiny) until something is sent
        const placedSizes = Float32Array.from(sizes, (s, i) => (i === packet && phase === 'idle' ? 0 : s));
        actors.place(points, { sizes: placedSizes, states });
        edges.forEach(({ u, v }, i) => {
            const [x1, y1] = pointOf(u);
            const [x2, y2] = pointOf(v);
            links.set(i, x1, y1, x2, y2, linkState(i));
        });
        links.setCount(edges.length);
    };

    const linkState = (i) => {
        const k = route.pathEdges.indexOf(i);
        if (k === -1 || phase === 'idle') return LINK.faint;
        if (k < hop) return LINK.path;
        if (phase === 'failed' && k === hop) return LINK.rejected;
        return LINK.faint;
    };

    const emit = () => onState?.({ phase, hops: route.pathEdges.length, hop });

    const refresh = () => {
        edges.forEach((_, i) => links.setState(i, linkState(i)));
        states[0] = phase === 'idle' ? STATE.idle : STATE.done;
        states[1] = phase === 'delivered' ? STATE.done : STATE.idle;
        states[packet] = phase === 'failed' ? STATE.dimmed : STATE.active;
        route.path.forEach((node, k) => {
            if (node > 1) states[node] = k <= hop && phase !== 'idle' ? STATE.done : STATE.idle;
        });
        actors.setStates(states);
    };

    const moveToHop = (k) => {
        const [x, y] = pointOf(route.path[k]);
        const target = Float32Array.from(points);
        target[packet * 2] = x;
        target[packet * 2 + 1] = y;
        actors.settle();
        actors.moveTo(target, { duration: HOP_SECONDS });
    };

    const finishTrip = () => {
        hop = stopAt;
        phase = stopAt === route.pathEdges.length ? 'delivered' : 'failed';
        refresh();
        emit();
    };

    stage.sync();
    layout();
    refresh();
    emit();

    return {
        layer: {
            object: stage.group,
            update(frame) {
                const rect = stage.sync();
                if (Math.abs(rect.width - size.width) > 1 || Math.abs(rect.height - size.height) > 1) {
                    layout();
                    refresh();
                }
                if (phase !== 'sending') return;
                actors.update(frame.delta);
                hopClock += frame.delta;
                if (hopClock < HOP_SECONDS) return;
                hopClock = 0;
                hop += 1;
                refresh();
                emit();
                if (hop >= stopAt) {
                    finishTrip();
                    return;
                }
                moveToHop(hop + 1);
            },
            dispose() {
                actors.dispose();
                links.dispose();
                stage.dispose();
            },
        },
        /** Send a packet: 'success' travels the whole route, 'error' stops halfway */
        send(status = 'success') {
            stopAt = status === 'success' ? route.pathEdges.length : Math.max(1, Math.floor(route.pathEdges.length / 2));
            hop = 0;
            hopClock = 0;
            phase = 'sending';
            // Show the packet at the sender
            actors.setSizes(sizes);
            const [x, y] = pointOf(route.path[0]);
            actors.setPosition(packet, x, y);
            refresh();
            emit();
            if (!animating) {
                finishTrip();
                const [ex, ey] = pointOf(route.path[stopAt]);
                actors.setPosition(packet, ex, ey);
                sky.requestRender();
                return;
            }
            moveToHop(1);
        },
        setAnimate(value) {
            animating = value;
            if (!value && phase === 'sending') finishTrip();
        },
        dispose() {},
    };
};

export default createContactRoute;
