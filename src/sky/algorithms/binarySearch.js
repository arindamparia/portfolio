/**
 * Binary search for `target` among the ranks 1..total (a sorted list).
 *
 * Returns each probe so a demo can replay it: the range [lo, hi] before the probe, the middle
 * probed, and whether the target lies below, above or at it. Takes at most ⌈log₂(total + 1)⌉ probes.
 */
export const binarySearchSteps = (total, target) => {
    const steps = [];
    let lo = 1;
    let hi = total;

    while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        const result = target === mid ? 'found' : target < mid ? 'lower' : 'higher';
        steps.push({ lo, hi, mid, result });
        if (result === 'found') break;
        if (result === 'lower') hi = mid - 1;
        else lo = mid + 1;
    }

    return steps;
};

/**
 * Number of candidates implied by a rank and percentile:
 * percentile = share of candidates at or below you, so total ≈ rank / (1 - percentile / 100).
 */
export const candidatesFromPercentile = (rank, percentile) => Math.round(rank / (1 - percentile / 100));
