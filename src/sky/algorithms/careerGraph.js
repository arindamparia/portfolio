import { createUnionFind } from './kruskal';
import { seededRandom } from './random';
import { dijkstra } from './dijkstra';

/**
 * A field of stars with career milestones placed along it, for Dijkstra to route through.
 *
 * Milestones run from the bottom-left (the start) to the top-right (now). Waypoint stars are
 * scattered around them; each star links to its nearest neighbours. Links that touch a milestone
 * are cheaper (milestones are stepping stones), so the shortest route from the first milestone
 * to the last passes through each one in order.
 *
 * Coordinates are normalised to 0..1 so the stage can scale them.
 */
const buildCandidate = (milestones, { seed, waypoints, neighbours }) => {
    const random = seededRandom(seed);
    const count = milestones.length;
    // A gentle random curve from bottom-left to top-right: its sway, phase and the spacing of
    // the milestones along it change with every seed
    const sway = 0.04 + random() * 0.08;
    const phase = random() * Math.PI * 2;
    const nodes = milestones.map((milestone, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const jitter = i === 0 || i === count - 1 ? 0 : (random() - 0.5) * 0.08;
        return {
            ...milestone,
            milestone: true,
            x: 0.1 + (t + jitter) * 0.8,
            y: 0.88 - t * 0.76 + Math.sin(t * Math.PI * 2 + phase) * sway,
        };
    });

    // Scatter waypoints, keeping them a little apart from each other and from milestones
    let attempts = 0;
    while (nodes.length < count + waypoints && attempts < 5000) {
        attempts += 1;
        const candidate = { x: 0.04 + random() * 0.92, y: 0.04 + random() * 0.92, milestone: false };
        if (nodes.every((node) => Math.hypot(node.x - candidate.x, node.y - candidate.y) > 0.075)) nodes.push(candidate);
    }

    const n = nodes.length;
    const distance = (a, b) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
    const edgeMap = new Map();
    const addEdge = (a, b) => {
        if (a === b) return;
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (edgeMap.has(key)) return;
        const stepping = nodes[a].milestone || nodes[b].milestone;
        edgeMap.set(key, { u: Math.min(a, b), v: Math.max(a, b), w: distance(a, b) * (stepping ? 0.55 : 1) });
    };

    for (let a = 0; a < n; a++) {
        Array.from({ length: n }, (_, b) => b)
            .filter((b) => b !== a)
            .sort((p, q) => distance(a, p) - distance(a, q))
            .slice(0, neighbours)
            .forEach((b) => addEdge(a, b));
    }

    // Bridge any disconnected components with their shortest connecting edge
    for (;;) {
        const sets = createUnionFind(n);
        edgeMap.forEach(({ u, v }) => sets.union(u, v));
        if (new Set(nodes.map((_, i) => sets.find(i))).size <= 1) break;
        let best = null;
        for (let a = 0; a < n; a++) {
            for (let b = a + 1; b < n; b++) {
                if (sets.find(a) !== sets.find(b) && (!best || distance(a, b) < best.d)) best = { a, b, d: distance(a, b) };
            }
        }
        addEdge(best.a, best.b);
    }

    return { nodes, edges: [...edgeMap.values()] };
};

// Every shortest route from the first milestone to a later one passes the milestones in order
const routesInOrder = ({ nodes, edges }, count) => {
    for (let target = 1; target < count; target++) {
        const { path } = dijkstra(nodes.length, edges, 0, target);
        const passed = path.filter((i) => i < count);
        if (passed.length !== target + 1 || passed.some((m, k) => m !== k)) return false;
    }
    return true;
};

export const buildCareerGraph = (milestones, { seed = 11, waypoints = 38, neighbours = 4 } = {}) => {
    // Random layouts occasionally route past a milestone; try the next seed until every route
    // reads as a career path
    for (let attempt = 0; attempt < 60; attempt++) {
        const graph = buildCandidate(milestones, { seed: seed + attempt * 7919, waypoints, neighbours });
        if (routesInOrder(graph, milestones.length)) return graph;
    }
    return buildCandidate(milestones, { seed, waypoints, neighbours });
};
