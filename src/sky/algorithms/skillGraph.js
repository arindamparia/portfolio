import { createUnionFind } from './kruskal';
import { seededRandom, shuffle } from './random';

/**
 * Builds the graph the skills constellation runs Kruskal's algorithm on.
 *
 * - Nodes: every skill, laid out as one cluster per category around an ellipse
 *   (coordinates normalised to 0..1, so the stage can scale them to any size)
 * - Edges: each skill's nearest neighbours, plus every pair of skills used together in the
 *   same piece of work. Pairs used together get a shorter weight, so the minimum spanning tree
 *   prefers the technologies that really are connected in practice.
 * - If that graph is disconnected, the shortest bridges between components are added.
 */

// How a skill might be written in work descriptions, when not exactly its display name. Includes
// what a stack implies: SCAPI/OCAPI and serverless endpoints are REST APIs, Spring Boot is Java,
// SFRA cartridges are JavaScript, Flutter is Dart.
const ALIASES = {
    'SFCC (SFRA, SCAPI, OCAPI, SLAS)': ['SFCC', 'SCAPI', 'SFRA', 'OCAPI', 'SLAS', 'Salesforce Commerce Cloud'],
    'Gemini Agents': ['Gemini'],
    'Java Microservices': ['microservices'],
    'REST APIs': ['REST', 'SCAPI', 'OCAPI', 'Express', 'Netlify Serverless', 'Cloudflare Pages Functions'],
    'Three.js (WebGPU, TSL)': ['Three.js', 'WebGPU'],
    'BFF Architecture': ['BFF', 'middleware'],
    'Cloudflare Workers': ['Cloudflare Pages', 'Cloudflare Workers', 'Cloudflare Pages Functions'],
    'Cloudflare D1': ['D1'],
    'JUnit & Mockito': ['JUnit', 'Mockito'],
    'OpenAI API': ['OpenAI'],
    'Spring Boot': ['Spring Boot'],
    'Spring AI': ['Spring AI'],
    'Salesforce Sales Cloud': ['Salesforce'],
    'HTML/CSS': ['HTML', 'CSS'],
    Java: ['Java,', 'Java ', 'Spring Boot'],
    JavaScript: ['Vanilla JS', 'SFRA'],
    Dart: ['Flutter'],
    PostgreSQL: ['PostgreSQL', 'Postgres'],
};

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const mentions = (skill, text) => {
    const names = [skill, ...(ALIASES[skill] ?? [])];
    return names.some((name) => new RegExp(`(^|[^A-Za-z0-9])${escape(name.trim())}($|[^A-Za-z0-9+#])`, 'i').test(text));
};

/** Pieces of work (from experience and projects) with the text that names their stack */
export const workSources = (experienceData, projectsData) => {
    const sources = [];
    experienceData.forEach((job) => job.projects.forEach((project) => {
        if (project.workstreams) {
            project.workstreams.forEach((stream) => sources.push({
                label: `${project.name.split(' (')[0]}: ${stream.name}`,
                text: `${stream.focus}. ${stream.details}`,
            }));
        } else {
            sources.push({ label: project.name, text: `${project.focus}. ${project.details}` });
        }
    }));
    // Earlier (college) projects count too: they're where Node.js, MongoDB and Python were used
    projectsData.forEach((project) => sources.push({
        label: project.name,
        text: project.tech.join(', '),
    }));
    return sources;
};

export const buildSkillGraph = (skillsData, sources, { seed = 7, neighbours = 4 } = {}) => {
    const random = seededRandom(seed);
    const categories = Object.keys(skillsData);
    const nodes = [];

    // Every seed draws a different sky: clusters in a shuffled order around a ring with a random
    // starting angle, each cluster nudged off the ring and turned by its own random amount
    const slots = shuffle(categories.map((_, i) => i), random);
    const start = random() * Math.PI * 2;
    const ring = { x: 0.3 + random() * 0.06, y: 0.32 + random() * 0.06 };

    categories.forEach((category, c) => {
        // Small nudges only: neighbouring clusters are 2π/9 apart, so this keeps them from crowding
        const angle = (slots[c] / categories.length) * Math.PI * 2 + start + (random() - 0.5) * 0.14;
        const reach = 0.93 + random() * 0.1;
        const cx = 0.5 + Math.cos(angle) * ring.x * reach;
        const cy = 0.5 + Math.sin(angle) * ring.y * reach;
        const twist = random() * Math.PI * 2;
        skillsData[category].forEach((name, j) => {
            // Golden-angle spiral inside the cluster, with a little jitter
            const r = 0.035 + 0.026 * Math.sqrt(j);
            const theta = twist + j * 2.399963 + random() * 0.6;
            nodes.push({
                name,
                category,
                x: Math.min(0.97, Math.max(0.03, cx + Math.cos(theta) * r + (random() - 0.5) * 0.02)),
                y: Math.min(0.97, Math.max(0.03, cy + Math.sin(theta) * r * 1.1 + (random() - 0.5) * 0.02)),
                usedIn: sources.filter((source) => mentions(name, source.text)).map((source) => source.label),
            });
        });
    });

    const n = nodes.length;
    const distance = (a, b) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
    const together = (a, b) => nodes[a].usedIn.some((label) => nodes[b].usedIn.includes(label));

    const edgeMap = new Map();
    const addEdge = (a, b) => {
        if (a === b) return;
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (edgeMap.has(key)) return;
        const pair = together(a, b);
        edgeMap.set(key, { u: Math.min(a, b), v: Math.max(a, b), w: distance(a, b) * (pair ? 0.35 : 1), together: pair });
    };

    for (let a = 0; a < n; a++) {
        const nearest = Array.from({ length: n }, (_, b) => b)
            .filter((b) => b !== a)
            .sort((p, q) => distance(a, p) - distance(a, q))
            .slice(0, neighbours);
        nearest.forEach((b) => addEdge(a, b));
        for (let b = a + 1; b < n; b++) if (together(a, b)) addEdge(a, b);
    }

    // Bridge any disconnected components with their shortest connecting edge
    for (;;) {
        const sets = createUnionFind(n);
        edgeMap.forEach(({ u, v }) => sets.union(u, v));
        const roots = new Set(nodes.map((_, i) => sets.find(i)));
        if (roots.size <= 1) break;
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
