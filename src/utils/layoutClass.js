import { flushSync } from 'react-dom';

/**
 * Layout classes for the whole page, set as attributes on <html>:
 *   data-bp="phone" (≤768px) | "tablet" (≤1023px) | "desktop"
 *   data-narrow   present below 1024px (demos stack, nav collapses)
 *   data-short    present when the window is 760px tall or less
 *
 * The CSS uses these instead of width media queries, so a layout switch happens from here, where
 * it can be wrapped in a View Transition: crossing a breakpoint while resizing the window
 * crossfades from the old layout to the new one instead of jumping. Browsers without View
 * Transitions (or with reduced motion) just switch.
 */

const compute = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
        bp: width <= 768 ? 'phone' : width <= 1023 ? 'tablet' : 'desktop',
        narrow: width <= 1023,
        short: height <= 760,
    };
};

let current = null;
const listeners = new Set();

const apply = (next) => {
    const root = document.documentElement;
    root.dataset.bp = next.bp;
    root.toggleAttribute('data-narrow', next.narrow);
    root.toggleAttribute('data-short', next.short);
    current = next;
};

const same = (a, b) => a && b && a.bp === b.bp && a.narrow === b.narrow && a.short === b.short;

const update = () => {
    const next = compute();
    if (same(next, current)) return;

    const commit = () => {
        apply(next);
        // React parts that depend on the layout (e.g. side demos) re-render inside the same transition
        flushSync(() => listeners.forEach((listener) => listener()));
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduced && !document.hidden) {
        document.startViewTransition(commit);
    } else {
        commit();
    }
};

export const initLayoutClass = () => {
    apply(compute());
    let frame = 0;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
    }, { passive: true });
};

export const getLayoutClass = () => current ?? compute();

export const subscribeLayoutClass = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
