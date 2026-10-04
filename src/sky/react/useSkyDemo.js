import { useCallback, useEffect, useRef, useState } from 'react';
import { useSky } from './SkyContext';

/**
 * Connect a section to an algorithm demo performed by the sky.
 *
 * `load` dynamically imports the demo module (so Three.js-dependent code only loads when the
 * sky is live). The demo pins itself to the element given to `ref`, reports its state through
 * `state` (for captions and controls), and `call('replay')` etc. invokes its controls.
 *
 * Demos are only built once their element comes within `rootMargin` of the viewport, so the
 * page doesn't pay for every demo up front. Pass `eager: true` for above-the-fold demos.
 * Changing `rebuildKey` rebuilds the demo (e.g. a new random layout).
 */
export const useSkyDemo = (load, { eager = false, rootMargin = '50% 0px', rebuildKey, ...options } = {}) => {
    const ref = useRef(null);
    const controls = useRef(null);
    const { sky, animate } = useSky();
    const [state, setState] = useState(null);
    const [near, setNear] = useState(eager);
    const [failed, setFailed] = useState(false);
    const animateRef = useRef(animate);
    const optionsRef = useRef(options);

    useEffect(() => {
        animateRef.current = animate;
        controls.current?.setAnimate?.(animate);
    }, [animate]);

    useEffect(() => {
        optionsRef.current = options;
    });

    // Wait until the demo's element is near the viewport
    useEffect(() => {
        if (near || !sky || !ref.current) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect();
                setNear(true);
            }
        }, { rootMargin });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [near, sky, rootMargin]);

    useEffect(() => {
        if (!sky || !near || !ref.current) return undefined;

        let cancelled = false;
        let demo = null;

        load()
            .then((module) => module.default({
                sky,
                element: ref.current,
                onState: (next) => {
                    if (!cancelled) setState(next);
                },
                animate: animateRef.current,
                ...optionsRef.current,
            }))
            .then((created) => {
                if (cancelled) {
                    created.layer.dispose?.();
                    created.dispose?.();
                    return;
                }
                demo = created;
                controls.current = created;
                sky.addLayer(created.layer);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });

        return () => {
            cancelled = true;
            controls.current = null;
            if (demo) {
                sky.removeLayer(demo.layer);
                demo.layer.dispose?.();
                demo.dispose?.();
            }
            setState(null);
        };
        // The demo is built once per sky; `load` is a stable module import
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sky, near, rebuildKey]);

    // Invoke a demo control (play, pause, step, replay, ...) from an event handler
    const call = useCallback((method, ...args) => controls.current?.[method]?.(...args), []);

    return { ref, state, call, failed, live: !!sky && !failed };
};
