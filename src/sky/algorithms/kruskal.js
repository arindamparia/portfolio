/**
 * Union-find (disjoint sets) with path compression and union by rank.
 * Both operations run in near-constant amortised time, O(α(n)).
 */
export const createUnionFind = (n) => {
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);

    const find = (x) => {
        while (parent[x] !== x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    };

    const union = (a, b) => {
        let ra = find(a);
        let rb = find(b);
        if (ra === rb) return false;
        if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
        parent[rb] = ra;
        if (rank[ra] === rank[rb]) rank[ra] += 1;
        return true;
    };

    return { find, union };
};

/**
 * Kruskal's minimum spanning tree (forest, if the graph is disconnected).
 *
 * edges: [{ u, v, w }]. Returns every step in the order Kruskal considers edges, so a demo
 * can replay it: { edge, accepted } where accepted is false when the edge would close a cycle.
 * Runs in O(E log E) for the sort.
 */
export const kruskal = (nodeCount, edges) => {
    const order = edges.map((_, i) => i).sort((a, b) => edges[a].w - edges[b].w);
    const sets = createUnionFind(nodeCount);
    const steps = [];
    const tree = [];
    let weight = 0;

    for (const index of order) {
        const { u, v, w } = edges[index];
        const accepted = sets.union(u, v);
        steps.push({ edge: index, accepted });
        if (accepted) {
            tree.push(index);
            weight += w;
            // A spanning tree has exactly n - 1 edges; stop early once it's complete
            if (tree.length === nodeCount - 1) break;
        }
    }

    return { steps, tree, weight };
};
