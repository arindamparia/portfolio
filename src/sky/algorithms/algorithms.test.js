import { describe, expect, it } from 'vitest';
import { seededRandom, shuffle } from './random';
import { assignmentCost, pairByAxis } from './assignment';
import { createUnionFind, kruskal } from './kruskal';
import { createMinHeap, dijkstra } from './dijkstra';
import { binarySearchSteps, candidatesFromPercentile } from './binarySearch';
import { OP, SORTS, makeDataset } from './sorts';

const randomGraph = (n, extraEdges, seed) => {
    const random = seededRandom(seed);
    const edges = [];
    // A random spanning path keeps the graph connected, then add random extra edges
    const order = shuffle(Array.from({ length: n }, (_, i) => i), random);
    for (let i = 1; i < n; i++) edges.push({ u: order[i - 1], v: order[i], w: 1 + Math.floor(random() * 50) });
    for (let k = 0; k < extraEdges; k++) {
        const u = Math.floor(random() * n);
        const v = Math.floor(random() * n);
        if (u !== v) edges.push({ u, v, w: 1 + Math.floor(random() * 50) });
    }
    return edges;
};

// Reference: Prim's algorithm, O(V²)
const primWeight = (n, edges) => {
    const adj = Array.from({ length: n }, () => new Array(n).fill(Infinity));
    edges.forEach(({ u, v, w }) => {
        adj[u][v] = Math.min(adj[u][v], w);
        adj[v][u] = Math.min(adj[v][u], w);
    });
    const inTree = new Array(n).fill(false);
    const best = new Array(n).fill(Infinity);
    best[0] = 0;
    let total = 0;
    for (let k = 0; k < n; k++) {
        let u = -1;
        for (let i = 0; i < n; i++) if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
        inTree[u] = true;
        total += best[u];
        for (let v = 0; v < n; v++) if (!inTree[v] && adj[u][v] < best[v]) best[v] = adj[u][v];
    }
    return total;
};

// Reference: Bellman-Ford, O(VE)
const bellmanFord = (n, edges, source) => {
    const dist = new Array(n).fill(Infinity);
    dist[source] = 0;
    for (let k = 0; k < n - 1; k++) {
        edges.forEach(({ u, v, w }) => {
            if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
            if (dist[v] + w < dist[u]) dist[u] = dist[v] + w;
        });
    }
    return dist;
};

// Replay recorded sort operations onto a copy of the input
const replay = (values, ops) => {
    const a = values.slice();
    for (const [op, i, j] of ops) {
        if (op === OP.swap) [a[i], a[j]] = [a[j], a[i]];
        else if (op === OP.write) a[i] = j;
    }
    return a;
};

describe('seededRandom', () => {
    it('is deterministic and in [0, 1)', () => {
        const a = seededRandom(42);
        const b = seededRandom(42);
        for (let i = 0; i < 100; i++) {
            const x = a();
            expect(x).toBe(b());
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(1);
        }
    });
});

describe('pairByAxis', () => {
    it('is a one-to-one assignment', () => {
        const random = seededRandom(7);
        const src = Array.from({ length: 400 }, () => random() * 1000);
        const dst = Array.from({ length: 400 }, () => random() * 1000);
        const order = pairByAxis(src, dst);
        expect(new Set(order).size).toBe(200);
        expect(Math.min(...order)).toBe(0);
        expect(Math.max(...order)).toBe(199);
    });

    it('beats a random assignment on total distance', () => {
        const random = seededRandom(9);
        const src = Array.from({ length: 1000 }, () => random() * 1000);
        const dst = Array.from({ length: 1000 }, () => random() * 1000);
        const sorted = assignmentCost(src, dst, pairByAxis(src, dst));
        const randomOrder = shuffle(Array.from({ length: 500 }, (_, i) => i), random);
        expect(sorted).toBeLessThan(assignmentCost(src, dst, randomOrder));
    });
});

describe('union-find', () => {
    it('merges sets and detects cycles', () => {
        const uf = createUnionFind(5);
        expect(uf.union(0, 1)).toBe(true);
        expect(uf.union(1, 2)).toBe(true);
        expect(uf.union(0, 2)).toBe(false);
        expect(uf.find(2)).toBe(uf.find(0));
        expect(uf.find(3)).not.toBe(uf.find(0));
    });
});

describe('kruskal', () => {
    it('matches Prim on random connected graphs', () => {
        for (let seed = 1; seed <= 25; seed++) {
            const n = 10 + seed;
            const edges = randomGraph(n, n * 3, seed);
            const { tree, weight } = kruskal(n, edges);
            expect(tree.length).toBe(n - 1);
            expect(weight).toBe(primWeight(n, edges));
        }
    });

    it('records rejected edges that would close a cycle', () => {
        const edges = [{ u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 0, v: 2, w: 3 }, { u: 2, v: 3, w: 4 }];
        const { steps, tree } = kruskal(4, edges);
        expect(steps.map((s) => s.accepted)).toEqual([true, true, false, true]);
        expect(tree).toEqual([0, 1, 3]);
    });
});

describe('dijkstra', () => {
    it('heap pops in priority order', () => {
        const heap = createMinHeap();
        [5, 1, 4, 2, 3].forEach((p) => heap.push(p, p));
        expect([1, 2, 3, 4, 5].map(() => heap.pop().value)).toEqual([1, 2, 3, 4, 5]);
    });

    it('matches Bellman-Ford distances and returns a valid path', () => {
        for (let seed = 1; seed <= 25; seed++) {
            const n = 12 + seed;
            const edges = randomGraph(n, n * 2, seed + 100);
            const reference = bellmanFord(n, edges, 0);
            const target = n - 1;
            const { distance, path, pathEdges } = dijkstra(n, edges, 0, target);
            expect(distance).toBe(reference[target]);
            expect(path[0]).toBe(0);
            expect(path[path.length - 1]).toBe(target);
            expect(pathEdges.reduce((sum, e) => sum + edges[e].w, 0)).toBe(distance);
        }
    });
});

describe('binary search', () => {
    it('finds the rank within ⌈log₂(n + 1)⌉ probes', () => {
        const total = candidatesFromPercentile(13372, 98.8384);
        const steps = binarySearchSteps(total, 13372);
        expect(steps[steps.length - 1]).toMatchObject({ mid: 13372, result: 'found' });
        expect(steps.length).toBeLessThanOrEqual(Math.ceil(Math.log2(total + 1)));
    });

    it('works for every target in a small range', () => {
        for (let target = 1; target <= 100; target++) {
            const steps = binarySearchSteps(100, target);
            expect(steps.at(-1).mid).toBe(target);
            expect(steps.length).toBeLessThanOrEqual(7);
        }
    });

    it('derives about 11.5 lakh candidates from the JEE rank and percentile', () => {
        expect(candidatesFromPercentile(13372, 98.8384)).toBeGreaterThan(1_140_000);
        expect(candidatesFromPercentile(13372, 98.8384)).toBeLessThan(1_160_000);
    });
});

describe('sorts', () => {
    const datasets = ['random', 'nearly', 'reversed'];

    for (const [key, sort] of Object.entries(SORTS)) {
        it(`${sort.name} sorts every dataset, and its recorded ops reproduce the result`, () => {
            for (const kind of datasets) {
                for (const n of [1, 2, 7, 48]) {
                    const values = makeDataset(kind, n, seededRandom(n));
                    const { ops, sorted } = sort.run(values);
                    const expected = values.slice().sort((a, b) => a - b);
                    expect(sorted, `${key} ${kind} ${n}`).toEqual(expected);
                    expect(replay(values, ops), `${key} replay ${kind} ${n}`).toEqual(expected);
                    // Every position is eventually marked final
                    expect(new Set(ops.filter(([op]) => op === OP.done).map(([, i]) => i)).size).toBe(n);
                }
            }
        });
    }

    it('insertion sort is near-linear on nearly sorted data and quadratic on reversed', () => {
        const n = 48;
        const nearly = SORTS.insertion.run(makeDataset('nearly', n, seededRandom(3))).comparisons;
        const reversed = SORTS.insertion.run(makeDataset('reversed', n)).comparisons;
        expect(nearly).toBeLessThan(n * 3);
        expect(reversed).toBe((n * (n - 1)) / 2);
    });

    it('n log n sorts stay within a few times n log₂ n comparisons', () => {
        const n = 48;
        const bound = 3 * n * Math.log2(n);
        for (const key of ['merge', 'quick', 'heap']) {
            for (const kind of datasets) {
                expect(SORTS[key].run(makeDataset(kind, n, seededRandom(5))).comparisons).toBeLessThan(bound);
            }
        }
    });
});

describe('skill graph', async () => {
    const { buildSkillGraph, workSources } = await import('./skillGraph');
    const { skillsData } = await import('../../data/skills');
    const { experienceData } = await import('../../data/experience');
    const { projectsData } = await import('../../data/projects');
    const sources = workSources(experienceData, projectsData);
    const { nodes, edges } = buildSkillGraph(skillsData, sources);

    it('has one node per skill, inside the unit square', () => {
        expect(nodes.length).toBe(Object.values(skillsData).flat().length);
        nodes.forEach((node) => {
            expect(node.x).toBeGreaterThan(0);
            expect(node.x).toBeLessThan(1);
            expect(node.y).toBeGreaterThan(0);
            expect(node.y).toBeLessThan(1);
        });
    });

    it('is connected, so Kruskal produces a full spanning tree', () => {
        expect(kruskal(nodes.length, edges).tree.length).toBe(nodes.length - 1);
    });

    it('links skills used together, from real work', () => {
        const usedIn = (name) => nodes.find((node) => node.name === name).usedIn;
        expect(usedIn('Go')).toContain('Tapestry: Cart & Checkout');
        expect(usedIn('GraphQL')).toContain('Tapestry: Cart & Checkout');
        expect(usedIn('Spring Boot').length).toBeGreaterThan(1);
        expect(usedIn('React')).toContain('DailyAlign');
        const go = nodes.findIndex((node) => node.name === 'Go');
        const graphql = nodes.findIndex((node) => node.name === 'GraphQL');
        expect(edges.some((e) => e.together && ((e.u === go && e.v === graphql) || (e.u === graphql && e.v === go)))).toBe(true);
    });

    it('does not match Java inside JavaScript', () => {
        const java = nodes.find((node) => node.name === 'Java');
        expect(java.usedIn).not.toContain('AlgoTracker');
    });
});

describe('career graph', async () => {
    const { buildCareerGraph } = await import('./careerGraph');
    const milestones = ['NIT Durgapur', 'Hire Buddy', 'Lloyds', 'Tapestry cart', 'Agentic pilot'].map((label, i) => ({ id: `m${i}`, label }));
    const { nodes, edges } = buildCareerGraph(milestones);

    it('puts milestones first and scatters waypoints in the unit square', () => {
        expect(nodes.slice(0, 5).every((node) => node.milestone)).toBe(true);
        expect(nodes.length).toBeGreaterThan(30);
        nodes.forEach((node) => {
            expect(node.x).toBeGreaterThan(0);
            expect(node.x).toBeLessThan(1);
        });
    });

    it('routes from the first milestone to the last through every milestone, in order', () => {
        const { path } = dijkstra(nodes.length, edges, 0, milestones.length - 1);
        const reached = path.filter((i) => i < milestones.length);
        expect(reached).toEqual([0, 1, 2, 3, 4]);
    });

    it('routes to any intermediate milestone through the earlier ones', () => {
        for (let target = 1; target < milestones.length; target++) {
            const { path } = dijkstra(nodes.length, edges, 0, target);
            expect(path.filter((i) => i < milestones.length)).toEqual(Array.from({ length: target + 1 }, (_, i) => i));
        }
    });
});

describe('terminal traces', async () => {
    const traces = await import('./terminalTraces');
    const { skillsData } = await import('../../data/skills');
    const { experienceData } = await import('../../data/experience');
    const { projectsData } = await import('../../data/projects');

    it('prints a sort trace that ends sorted', () => {
        const lines = traces.sortTrace('quick', 16);
        expect(lines[0]).toContain('Quicksort');
        expect(lines.find((l) => l.startsWith('sorted'))).toContain('▁');
        expect(traces.sortTrace('bogo')[0]).toContain('unknown algorithm');
    });

    it('prints kruskal, dijkstra and search traces', () => {
        expect(traces.kruskalTrace(skillsData, experienceData, projectsData).at(-1)).toMatch(/links join all \d+ skills/);
        const route = traces.dijkstraTrace(['NIT Durgapur', 'Hire Buddy', 'Lloyds'].map((label, i) => ({ id: `m${i}`, label })));
        expect(route.find((l) => l.startsWith('route:'))).toBe('route: NIT Durgapur → Hire Buddy → Lloyds');
        const search = traces.searchTrace(13372, 98.8384);
        expect(search.some((l) => l.includes('FOUND'))).toBe(true);
    });
});

describe('career milestones', async () => {
    const { careerMilestones } = await import('../../data/careerMilestones');

    it('run from NIT Durgapur to Tapestry Cart & Checkout, in order', () => {
        expect(careerMilestones().map((m) => m.label)).toEqual([
            'NIT Durgapur',
            'Hire Buddy',
            'Lloyds Credit System',
            'Tapestry UCP',
            'Tapestry Cart & Checkout',
        ]);
    });
});

describe('random layouts', async () => {
    const { buildCareerGraph } = await import('./careerGraph');
    const { buildSkillGraph, workSources } = await import('./skillGraph');
    const { careerMilestones } = await import('../../data/careerMilestones');
    const { skillsData } = await import('../../data/skills');
    const { experienceData } = await import('../../data/experience');
    const { projectsData } = await import('../../data/projects');
    const seeds = Array.from({ length: 40 }, (_, i) => 1000 + i * 7717);

    it('every career layout routes through the milestones in order, for every target', () => {
        const milestones = careerMilestones();
        for (const seed of seeds) {
            const { nodes, edges } = buildCareerGraph(milestones, { seed });
            for (let target = 1; target < milestones.length; target++) {
                const passed = dijkstra(nodes.length, edges, 0, target).path.filter((i) => i < milestones.length);
                expect(passed, `seed ${seed} target ${target}`).toEqual(Array.from({ length: target + 1 }, (_, i) => i));
            }
        }
    });

    it('every skill layout is connected and stays inside the stage', () => {
        const sources = workSources(experienceData, projectsData);
        for (const seed of seeds) {
            const { nodes, edges } = buildSkillGraph(skillsData, sources, { seed });
            expect(kruskal(nodes.length, edges).tree.length).toBe(nodes.length - 1);
            nodes.forEach((n) => {
                expect(n.x).toBeGreaterThan(0);
                expect(n.x).toBeLessThan(1);
                expect(n.y).toBeGreaterThan(0);
                expect(n.y).toBeLessThan(1);
            });
        }
    });

    it('different seeds draw different skies', () => {
        const sources = workSources(experienceData, projectsData);
        const a = buildSkillGraph(skillsData, sources, { seed: 1 }).nodes[0];
        const b = buildSkillGraph(skillsData, sources, { seed: 2 }).nodes[0];
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(0.01);
    });
});
