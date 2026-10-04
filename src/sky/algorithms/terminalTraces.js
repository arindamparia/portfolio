import { OP, SORTS, makeDataset } from './sorts';
import { kruskal } from './kruskal';
import { dijkstra } from './dijkstra';
import { binarySearchSteps, candidatesFromPercentile } from './binarySearch';
import { buildSkillGraph, workSources } from './skillGraph';
import { buildCareerGraph } from './careerGraph';

/**
 * Text traces of the site's algorithms for the hacker-mode terminal (`run <algorithm>`).
 * Each function returns lines of output.
 */

const BARS = '▁▂▃▄▅▆▇█';
const sparkline = (values, max) => values.map((v) => BARS[Math.min(BARS.length - 1, Math.floor(((v - 1) / max) * BARS.length))]).join('');
const pad = (text, width) => String(text).padEnd(width);
const number = (n) => n.toLocaleString('en-IN');

export const sortTrace = (key = 'merge', n = 24) => {
    const sort = SORTS[key];
    if (!sort) return [`run sort: unknown algorithm '${key}'. Try: ${Object.keys(SORTS).join(', ')}`];

    const values = makeDataset('random', n);
    const { ops, comparisons } = sort.run(values);
    const array = values.slice();
    const lines = [`[SORT] ${sort.name}, ${n} random numbers, ${sort.complexity}`, '', `start      ${sparkline(array, n)}`];
    const every = Math.max(1, Math.ceil(ops.length / 8));
    let moves = 0;

    ops.forEach(([op, i, j], k) => {
        if (op === OP.swap) {
            [array[i], array[j]] = [array[j], array[i]];
            moves += 1;
        } else if (op === OP.write) {
            array[i] = j;
            moves += 1;
        }
        if ((k + 1) % every === 0 && k + 1 < ops.length) lines.push(`${pad(`op ${k + 1}`, 11)}${sparkline(array, n)}`);
    });

    lines.push(`sorted     ${sparkline(array, n)}`, '', `comparisons: ${comparisons}   moves: ${moves}   operations: ${ops.length}`);
    return lines;
};

export const kruskalTrace = (skillsData, experienceData, projectsData) => {
    const { nodes, edges } = buildSkillGraph(skillsData, workSources(experienceData, projectsData));
    const { steps, tree } = kruskal(nodes.length, edges);
    const name = (i) => nodes[i].name;
    const lines = [`[KRUSKAL] ${nodes.length} skills, ${edges.length} candidate links, shortest first`, ''];

    steps.slice(0, 14).forEach(({ edge, accepted }) => {
        const { u, v, w, together } = edges[edge];
        const link = pad(`${name(u)} ── ${name(v)}`, 44);
        lines.push(`${accepted ? '+' : 'x'} ${link} ${w.toFixed(3)}  ${accepted ? 'kept' : 'skipped, would close a loop'}${together ? '  (used together)' : ''}`);
    });

    lines.push(`  ... ${steps.length - 14} more`, '', `tree: ${tree.length} links join all ${nodes.length} skills (checked ${steps.length} candidates)`);
    return lines;
};

export const dijkstraTrace = (milestones) => {
    const { nodes, edges } = buildCareerGraph(milestones);
    const target = milestones.length - 1;
    const { steps, path, distance, settledCount } = dijkstra(nodes.length, edges, 0, target);
    const label = (i) => nodes[i].label ?? `star ${i}`;
    const lines = [`[DIJKSTRA] ${nodes.length} stars, from ${label(0)} to ${label(target)}`, ''];

    steps.filter((s) => s.type === 'settle').slice(0, 10).forEach(({ node, dist }) => {
        lines.push(`settle ${pad(label(node), 18)} distance ${dist.toFixed(3)}`);
    });

    lines.push(
        '  ...',
        '',
        `route: ${path.map(label).filter((l) => !l.startsWith('star')).join(' → ')}`,
        `${path.length - 1} links, total distance ${distance.toFixed(3)}, settled ${settledCount} of ${nodes.length} stars`
    );
    return lines;
};

export const searchTrace = (rank, percentile) => {
    const total = candidatesFromPercentile(rank, percentile);
    const steps = binarySearchSteps(total, rank);
    const lines = [
        `[BINARY SEARCH] rank ${number(rank)} among about ${number(total)} candidates`,
        `(total worked out from the ${percentile} percentile)`,
        '',
        `${pad('step', 6)}${pad('low', 12)}${pad('high', 12)}${pad('probe', 12)}verdict`,
    ];
    steps.forEach(({ lo, hi, mid, result }, i) => {
        const verdict = result === 'found' ? 'FOUND' : result === 'lower' ? 'go lower' : 'go higher';
        lines.push(`${pad(i + 1, 6)}${pad(number(lo), 12)}${pad(number(hi), 12)}${pad(number(mid), 12)}${verdict}`);
    });
    lines.push('', `${steps.length} probes, at most ${Math.ceil(Math.log2(total + 1))} needed. A linear scan would take ${number(rank)}.`);
    return lines;
};
