/**
 * Binary min-heap keyed by priority, used as Dijkstra's priority queue.
 */
export const createMinHeap = () => {
    const items = [];

    const swap = (i, j) => {
        [items[i], items[j]] = [items[j], items[i]];
    };

    const up = (i) => {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (items[p].priority <= items[i].priority) break;
            swap(i, p);
            i = p;
        }
    };

    const down = (i) => {
        for (;;) {
            const l = i * 2 + 1;
            const r = l + 1;
            let smallest = i;
            if (l < items.length && items[l].priority < items[smallest].priority) smallest = l;
            if (r < items.length && items[r].priority < items[smallest].priority) smallest = r;
            if (smallest === i) return;
            swap(i, smallest);
            i = smallest;
        }
    };

    return {
        get size() {
            return items.length;
        },
        push(value, priority) {
            items.push({ value, priority });
            up(items.length - 1);
        },
        pop() {
            const top = items[0];
            const last = items.pop();
            if (items.length > 0) {
                items[0] = last;
                down(0);
            }
            return top;
        },
    };
};

/** Undirected adjacency list from [{ u, v, w }] */
export const toAdjacency = (nodeCount, edges) => {
    const adjacency = Array.from({ length: nodeCount }, () => []);
    edges.forEach(({ u, v, w }, index) => {
        adjacency[u].push({ to: v, w, edge: index });
        adjacency[v].push({ to: u, w, edge: index });
    });
    return adjacency;
};

/**
 * Dijkstra's shortest path from `source` to `target` with a binary heap, O((V + E) log V).
 *
 * Returns the replayable steps (each node as it is settled, and each successful relaxation),
 * the distance, and the path as node and edge indices. Stops as soon as the target is settled.
 */
export const dijkstra = (nodeCount, edges, source, target) => {
    const adjacency = toAdjacency(nodeCount, edges);
    const dist = new Array(nodeCount).fill(Infinity);
    const prev = new Array(nodeCount).fill(-1);
    const prevEdge = new Array(nodeCount).fill(-1);
    const settled = new Array(nodeCount).fill(false);
    const heap = createMinHeap();
    const steps = [];

    dist[source] = 0;
    heap.push(source, 0);

    while (heap.size > 0) {
        const { value: node, priority } = heap.pop();
        if (settled[node] || priority > dist[node]) continue;
        settled[node] = true;
        steps.push({ type: 'settle', node, dist: dist[node] });
        if (node === target) break;

        for (const { to, w, edge } of adjacency[node]) {
            if (settled[to]) continue;
            const candidate = dist[node] + w;
            if (candidate < dist[to]) {
                dist[to] = candidate;
                prev[to] = node;
                prevEdge[to] = edge;
                heap.push(to, candidate);
                steps.push({ type: 'relax', from: node, to, edge, dist: candidate });
            }
        }
    }

    const path = [];
    const pathEdges = [];
    if (dist[target] !== Infinity) {
        for (let node = target; node !== -1; node = prev[node]) {
            path.unshift(node);
            if (prevEdge[node] !== -1) pathEdges.unshift(prevEdge[node]);
        }
    }

    return { steps, distance: dist[target], path, pathEdges, settledCount: settled.filter(Boolean).length };
};
