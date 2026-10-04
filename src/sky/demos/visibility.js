/**
 * Calls `onFirstView` once, the first time at least half of the element is on screen.
 * Returns a function that stops watching.
 */
export const watchVisibility = (element, onFirstView, threshold = 0.5) => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.intersectionRatio >= threshold) {
                observer.disconnect();
                onFirstView();
            }
        },
        { threshold: [threshold] }
    );
    observer.observe(element);
    return () => observer.disconnect();
};
