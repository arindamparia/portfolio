import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSunCycle from '../../hooks/useSunCycle';
import { SCHEMES, schemeForCycle } from '../palette';
import { SkyContext } from './SkyContext';

const PAUSE_KEY = 'skyPaused';

// DOM-based sky for devices without WebGPU or WebGL 2 (uses Framer Motion, so it loads only when needed)
const StillSky = lazy(() => import('./StillSky'));

const READY_TIMEOUT_MS = 8000;

// WebGL 2 is the baseline (WebGPURenderer falls back to it); otherwise a real WebGPU adapter is needed.
// Checking `'gpu' in navigator` alone isn't enough: the API can exist with no usable adapter.
const hasWebGL2 = () => {
    try {
        return !!document.createElement('canvas').getContext('webgl2');
    } catch {
        return false;
    }
};

const supportsGpu = async () => {
    if (hasWebGL2()) return true;
    if (!('gpu' in navigator)) return false;
    try {
        return !!(await navigator.gpu.requestAdapter());
    } catch {
        return false;
    }
};

const readPaused = () => {
    try {
        return localStorage.getItem(PAUSE_KEY) === '1';
    } catch {
        return false;
    }
};

const detectDevice = () => {
    const connection = navigator.connection;
    return {
        isSmall: window.matchMedia('(max-width: 768px), (pointer: coarse)').matches,
        lowPower: (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 4) || connection?.saveData === true,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
};

/**
 * Mounts the fixed night sky behind the whole Modern view and shares it with sections
 * (time-of-day colours, pause state, and the engine for algorithm demos).
 */
const SkyProvider = ({ children }) => {
    const containerRef = useRef(null);
    const [sky, setSky] = useState(null);
    const [status, setStatus] = useState('loading');
    const [paused, setPausedState] = useState(readPaused);
    const [device] = useState(detectDevice);
    const { cycle, solarData, isDay } = useSunCycle();

    const colors = SCHEMES[schemeForCycle(cycle)];

    // Expose the time accent to CSS
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--accent', colors.light);
        root.style.setProperty('--accent-strong', colors.accent);
        return () => {
            root.style.removeProperty('--accent');
            root.style.removeProperty('--accent-strong');
        };
    }, [colors]);

    // Load Three.js only once the browser is idle, so it never competes with the first paint
    useEffect(() => {
        if (status !== 'loading') return undefined;

        let controller = null;
        let cancelled = false;

        const start = async () => {
            try {
                if (!(await supportsGpu())) throw new Error('No WebGPU or WebGL 2');
                const { createSky } = await import('../engine/createSky');
                if (cancelled || !containerRef.current) return;
                controller = createSky({ container: containerRef.current, colors, ...device });
                // Give up on a renderer that never finishes starting
                await Promise.race([
                    controller.ready,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Sky timed out')), READY_TIMEOUT_MS)),
                ]);
                if (cancelled) return;
                controller.setPaused(paused);
                setSky(controller);
                setStatus('ready');
            } catch {
                controller?.dispose();
                controller = null;
                if (!cancelled) setStatus('fallback');
            }
        };

        // Wait for the page to finish loading, then for a short idle moment (the curtain covers
        // the page meanwhile), so the sky doesn't compete with the first paint
        let idle = 0;
        const schedule = () => {
            idle = window.requestIdleCallback
                ? window.requestIdleCallback(start, { timeout: 600 })
                : setTimeout(start, 200);
        };
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });

        return () => {
            cancelled = true;
            window.removeEventListener('load', schedule);
            if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
            clearTimeout(idle);
            controller?.dispose();
            setSky(null);
        };
        // Build the engine once; colours and pause state are pushed in by the effects below
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sky?.setColors(colors);
    }, [sky, colors]);

    const setPaused = useCallback((value) => {
        setPausedState(value);
        try {
            localStorage.setItem(PAUSE_KEY, value ? '1' : '0');
        } catch {
            // Storage unavailable: the choice lasts for this visit only
        }
    }, []);

    useEffect(() => {
        sky?.setPaused(paused);
    }, [sky, paused]);

    const value = useMemo(() => ({
        sky,
        status,
        colors,
        cycle,
        solarData,
        isDay,
        paused,
        setPaused,
        ...device,
        // Demos animate only when the sky is live and motion is welcome
        animate: status === 'ready' && !paused && !device.reducedMotion,
    }), [sky, status, colors, cycle, solarData, isDay, paused, setPaused, device]);

    return (
        <SkyContext.Provider value={value}>
            <div ref={containerRef} className={`sky ${status === 'loading' ? '' : 'is-visible'}`} aria-hidden="true">
                {status === 'fallback' && (
                    <Suspense fallback={null}>
                        <StillSky colors={colors} />
                    </Suspense>
                )}
            </div>
            {children}
        </SkyContext.Provider>
    );
};

export default SkyProvider;
