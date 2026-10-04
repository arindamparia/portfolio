/**
 * Sorting algorithms that record every operation, so a demo can replay them step by step
 * and race them fairly (one operation per lane per tick).
 *
 * Operations (flat arrays for speed):
 *   [OP.compare, i, j]   compared the values at i and j
 *   [OP.swap, i, j]      swapped the values at i and j
 *   [OP.write, i, value] wrote value at i (merge sort copies from a buffer)
 *   [OP.done, i]         position i holds its final value
 */
export const OP = { compare: 0, swap: 1, write: 2, done: 3 };

const recorder = (values) => {
    const a = values.slice();
    const ops = [];
    let comparisons = 0;
    return {
        a,
        ops,
        less(i, j) {
            ops.push([OP.compare, i, j]);
            comparisons += 1;
            return a[i] < a[j];
        },
        lessValue(x, y, i, j) {
            ops.push([OP.compare, i, j]);
            comparisons += 1;
            return x < y;
        },
        swap(i, j) {
            if (i === j) return;
            ops.push([OP.swap, i, j]);
            [a[i], a[j]] = [a[j], a[i]];
        },
        write(i, value) {
            ops.push([OP.write, i, value]);
            a[i] = value;
        },
        done(i) {
            ops.push([OP.done, i]);
        },
        result() {
            return { ops, comparisons, sorted: a };
        },
    };
};

/** Insertion sort: O(n²) comparisons in general, O(n) on nearly sorted data */
export const insertionSort = (values) => {
    const r = recorder(values);
    const n = r.a.length;
    for (let i = 1; i < n; i++) {
        for (let j = i; j > 0 && r.less(j, j - 1); j--) r.swap(j, j - 1);
    }
    for (let i = 0; i < n; i++) r.done(i);
    return r.result();
};

/** Top-down merge sort: O(n log n) always, stable, uses an O(n) buffer */
export const mergeSort = (values) => {
    const r = recorder(values);
    const n = r.a.length;

    const sort = (lo, hi) => {
        if (hi - lo < 1) return;
        const mid = (lo + hi) >> 1;
        sort(lo, mid);
        sort(mid + 1, hi);

        const buffer = r.a.slice(lo, hi + 1);
        let i = 0;
        let j = mid + 1 - lo;
        const leftEnd = mid - lo;
        const rightEnd = hi - lo;
        for (let k = lo; k <= hi; k++) {
            if (i > leftEnd) r.write(k, buffer[j++]);
            else if (j > rightEnd) r.write(k, buffer[i++]);
            else if (r.lessValue(buffer[j], buffer[i], lo + j, lo + i)) r.write(k, buffer[j++]);
            else r.write(k, buffer[i++]);
        }
        if (lo === 0 && hi === n - 1) for (let k = 0; k < n; k++) r.done(k);
    };

    sort(0, n - 1);
    if (n === 1) r.done(0);
    return r.result();
};

/** Quicksort with median-of-three pivot (Lomuto partition): O(n log n) expected, O(n²) worst */
export const quickSort = (values) => {
    const r = recorder(values);

    const medianOfThree = (lo, hi) => {
        const mid = (lo + hi) >> 1;
        if (r.less(mid, lo)) r.swap(mid, lo);
        if (r.less(hi, lo)) r.swap(hi, lo);
        if (r.less(mid, hi)) r.swap(mid, hi);
        // The median now sits at hi and serves as the pivot
    };

    const sort = (lo, hi) => {
        if (lo > hi) return;
        if (lo === hi) {
            r.done(lo);
            return;
        }
        medianOfThree(lo, hi);
        let store = lo;
        for (let i = lo; i < hi; i++) {
            if (r.less(i, hi)) {
                r.swap(i, store);
                store += 1;
            }
        }
        r.swap(store, hi);
        r.done(store);
        sort(lo, store - 1);
        sort(store + 1, hi);
    };

    sort(0, r.a.length - 1);
    return r.result();
};

/** Heapsort: O(n log n) always, in place, not stable */
export const heapSort = (values) => {
    const r = recorder(values);
    const n = r.a.length;

    const siftDown = (start, end) => {
        let root = start;
        for (;;) {
            const child = root * 2 + 1;
            if (child > end) return;
            let largest = root;
            if (r.less(largest, child)) largest = child;
            if (child + 1 <= end && r.less(largest, child + 1)) largest = child + 1;
            if (largest === root) return;
            r.swap(root, largest);
            root = largest;
        }
    };

    for (let start = (n >> 1) - 1; start >= 0; start--) siftDown(start, n - 1);
    for (let end = n - 1; end > 0; end--) {
        r.swap(0, end);
        r.done(end);
        siftDown(0, end - 1);
    }
    if (n > 0) r.done(0);
    return r.result();
};

export const SORTS = {
    merge: { name: 'Merge sort', run: mergeSort, complexity: 'O(n log n)' },
    quick: { name: 'Quicksort', run: quickSort, complexity: 'O(n log n) expected' },
    heap: { name: 'Heapsort', run: heapSort, complexity: 'O(n log n)' },
    insertion: { name: 'Insertion sort', run: insertionSort, complexity: 'O(n²)' },
};

/** Datasets for the race: random, nearly sorted (a few swaps), reversed */
export const makeDataset = (kind, n, random = Math.random) => {
    const values = Array.from({ length: n }, (_, i) => i + 1);
    if (kind === 'reversed') return values.reverse();
    if (kind === 'nearly') {
        if (n < 2) return values;
        for (let k = 0; k < Math.max(1, Math.round(n * 0.06)); k++) {
            const i = Math.floor(random() * (n - 1));
            [values[i], values[i + 1]] = [values[i + 1], values[i]];
        }
        return values;
    }
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
};
