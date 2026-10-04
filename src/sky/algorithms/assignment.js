/**
 * Pair source points with target points by sorting both sets along one axis.
 *
 * This is the exact optimal assignment (minimum total squared distance) in one dimension,
 * and a good, crossing-light approximation in two: stars sweep across in order instead of
 * criss-crossing, and it runs in O(n log n) instead of the Hungarian algorithm's O(n³).
 *
 * points are flat arrays [x0, y0, x1, y1, ...]; returns `order` where source i goes to
 * target order[i].
 */
export const pairByAxis = (sources, targets, axis = 0) => {
    const n = Math.min(sources.length, targets.length) / 2;
    const byAxis = (points) => Array.from({ length: n }, (_, i) => i)
        .sort((a, b) => points[a * 2 + axis] - points[b * 2 + axis] || points[a * 2 + 1 - axis] - points[b * 2 + 1 - axis]);

    const sourceOrder = byAxis(sources);
    const targetOrder = byAxis(targets);
    const order = new Array(n);
    for (let k = 0; k < n; k++) order[sourceOrder[k]] = targetOrder[k];
    return order;
};

/** Total squared distance of an assignment (used to compare against alternatives in tests) */
export const assignmentCost = (sources, targets, order) => {
    let cost = 0;
    for (let i = 0; i < order.length; i++) {
        const dx = sources[i * 2] - targets[order[i] * 2];
        const dy = sources[i * 2 + 1] - targets[order[i] * 2 + 1];
        cost += dx * dx + dy * dy;
    }
    return cost;
};
