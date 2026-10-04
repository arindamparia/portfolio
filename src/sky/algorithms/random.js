/**
 * Seeded pseudo-random numbers (mulberry32), so demo layouts are the same on every visit.
 */
export const seededRandom = (seed = 1) => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/** Fisher–Yates shuffle (in place) using the given random source */
export const shuffle = (array, random = Math.random) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/** A fresh seed for a new random layout */
export const randomSeed = () => Math.floor(Math.random() * 2 ** 31);
