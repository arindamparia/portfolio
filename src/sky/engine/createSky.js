import { Color, OrthographicCamera, PerspectiveCamera, Scene, Timer, Vector2, WebGPURenderer } from 'three/webgpu';
import { uniform } from 'three/tsl';
import { createNebula, createStars } from './background';

/**
 * The sky engine: one fixed, full-viewport canvas behind the whole page.
 *
 * - WebGPURenderer (falls back to WebGL 2 automatically)
 * - Pass 1: perspective camera, background stars + nebula; scroll flies forward through the field
 * - Pass 2: pixel-space orthographic camera for "layers" (algorithm demos) aligned to DOM elements
 * - Renders at full rate while the visitor is active, half rate after a few idle seconds,
 *   and not at all while the tab is hidden (requestAnimationFrame stops)
 * - Steps quality down (pixel ratio, star count) if the frame rate can't keep up
 */

const BACKGROUND = 0x020308;
const TIERS = [
    { dpr: 1.5, density: 1 },
    { dpr: 1.25, density: 0.7 },
    { dpr: 1, density: 0.45 },
];
const LOW_FPS = 48;
const WARMUP_SECONDS = 2;
const IDLE_MS = 4000;
const TRAVEL_PER_SCREEN = 2.4;

const damp = (delta, rate) => 1 - Math.exp(-delta * rate);

// Let the browser handle input between heavy startup steps, so no single task blocks for long
const yieldToMain = () => (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((resolve) => setTimeout(resolve, 0)));

export const createSky = ({ container, colors, isSmall, lowPower, reducedMotion }) => {
    let disposed = false;
    let initialized = false;
    let paused = false;
    let running = false;

    // ?renderer=webgl forces the WebGL 2 backend (for testing and comparison)
    const forceWebGL = new URLSearchParams(window.location.search).get('renderer') === 'webgl';
    const renderer = new WebGPURenderer({ antialias: false, alpha: false, powerPreference: 'low-power', forceWebGL });
    renderer.setClearColor(BACKGROUND, 1);
    renderer.autoClear = false;
    const startTier = lowPower ? 1 : 0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, TIERS[startTier].dpr));
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1, 0.1, 80);
    camera.position.set(0, 0, 5);

    // Pixel-space camera for DOM-aligned layers: x right, y down (negated), in CSS pixels
    const overlay = new Scene();
    const overlayCamera = new OrthographicCamera(0, 1, 0, -1, -10, 10);
    const layers = new Set();

    const palette = {
        primary: uniform(new Color(colors.primary)),
        accent: uniform(new Color(colors.accent)),
        light: uniform(new Color(colors.light)),
    };
    const targets = {
        primary: new Color(colors.primary),
        accent: new Color(colors.accent),
        light: new Color(colors.light),
    };

    const uniforms = {
        travel: uniform(0),
        streak: uniform(0),
        camera: uniform(new Vector2()),
        pointer: uniform(new Vector2(0.5, 0.5)),
        torch: uniform(0),
        starOpacity: uniform(1),
        nebulaOpacity: uniform(1),
    };

    const stars = createStars({
        count: Math.round((isSmall ? 1200 : 3000) * (lowPower ? 0.7 : 1)),
        palette,
        uniforms,
    });
    scene.add(stars.sprite);
    let nebula = null;

    // ---- Input state (read in the frame loop; listeners only store values) ----
    const input = {
        pointer: new Vector2(0.5, 0.5),
        torchTarget: 0,
        lastActivity: performance.now(),
        lastScrollY: window.scrollY,
        velocity: 0,
        docHeight: document.documentElement.scrollHeight,
        size: { width: 1, height: 1 },
    };

    const markActive = () => {
        input.lastActivity = performance.now();
    };

    const onPointerMove = (e) => {
        markActive();
        if (e.pointerType !== 'mouse' || isSmall) return;
        input.pointer.set(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
        input.torchTarget = 1;
    };
    const onPointerLeave = () => {
        input.torchTarget = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', markActive, { passive: true });
    window.addEventListener('keydown', markActive);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    // ---- Layout ----
    const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        input.size = { width, height };
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        overlayCamera.right = width;
        overlayCamera.bottom = -height;
        overlayCamera.updateProjectionMatrix();
        if (!running) renderOnce();
    };

    const docObserver = new ResizeObserver(() => {
        input.docHeight = document.documentElement.scrollHeight;
    });
    const resizeObserver = new ResizeObserver(resize);

    // ---- Adaptive quality: step down a tier after two slow one-second samples ----
    const perf = { tier: startTier, frames: 0, elapsed: 0, warmup: WARMUP_SECONDS, lowSamples: 0 };

    const trackPerformance = (delta, idle) => {
        if (perf.warmup > 0) {
            perf.warmup -= delta;
            return;
        }
        // Idle frames are deliberately throttled; don't count them as slow
        if (idle || perf.tier >= TIERS.length - 1) return;

        perf.frames += 1;
        perf.elapsed += delta;
        if (perf.elapsed < 1) return;

        perf.lowSamples = perf.frames / perf.elapsed < LOW_FPS ? perf.lowSamples + 1 : 0;
        perf.frames = 0;
        perf.elapsed = 0;

        if (perf.lowSamples >= 2) {
            perf.tier += 1;
            perf.lowSamples = 0;
            perf.warmup = 1;
            const tier = TIERS[perf.tier];
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.dpr));
            stars.sprite.count = Math.floor(stars.maxCount * tier.density);
            resize();
            layers.forEach((layer) => layer.onQualityChange?.(perf.tier));
        }
    };

    // ---- Rendering ----
    const render = () => {
        renderer.clear();
        renderer.render(scene, camera);
        if (overlay.children.length > 0) renderer.render(overlay, overlayCamera);
    };

    const renderOnce = () => {
        if (!initialized || disposed) return;
        const { width, height } = input.size;
        const frameState = { delta: 0, time: 0, scrollY: window.scrollY, width, height, idle: true };
        layers.forEach((layer) => layer.update?.(frameState));
        render();
    };

    // While the loop is stopped, still re-render (once per frame at most) so DOM-aligned layers follow scrolling
    let pendingStill = 0;
    const onScrollWhileStill = () => {
        if (running || pendingStill || layers.size === 0) return;
        pendingStill = requestAnimationFrame(() => {
            pendingStill = 0;
            renderOnce();
        });
    };
    window.addEventListener('scroll', onScrollWhileStill, { passive: true });

    const timer = new Timer();
    timer.connect(document);
    let frame = 0;

    const tick = (timestamp) => {
        timer.update(timestamp);
        const delta = Math.min(timer.getDelta(), 0.1);
        const now = performance.now();
        const idle = now - input.lastActivity > IDLE_MS;

        frame += 1;
        // Half rate while idle: the sky only twinkles, so 30 fps is indistinguishable
        if (idle && frame % 2 === 1) return;
        const step = idle ? delta * 2 : delta;

        trackPerformance(step, idle);

        // Ease the time-of-day colours
        const colorEase = damp(step, 1.5);
        palette.primary.value.lerp(targets.primary, colorEase);
        palette.accent.value.lerp(targets.accent, colorEase);
        palette.light.value.lerp(targets.light, colorEase);

        // Scroll: travel forward, streak when fast (velocity in screens per second)
        const { width, height } = input.size;
        const scrollY = window.scrollY;
        const rawVelocity = (scrollY - input.lastScrollY) / Math.max(step, 1e-3) / height;
        input.lastScrollY = scrollY;
        input.velocity += (rawVelocity - input.velocity) * damp(step, 8);

        const streakTarget = Math.min(Math.max(Math.abs(input.velocity) * 1.4 - 0.35, 0), 4);
        uniforms.streak.value += (streakTarget - uniforms.streak.value) * damp(step, 10);
        uniforms.travel.value += ((scrollY / height) * TRAVEL_PER_SCREEN - uniforms.travel.value) * damp(step, 4);

        // Mouse parallax and torch (desktop pointers only)
        const pointerDamp = damp(step, 3);
        camera.position.x += ((input.pointer.x - 0.5) * 1.1 - camera.position.x) * pointerDamp;
        camera.position.y += (-(input.pointer.y - 0.5) * 0.7 - camera.position.y) * pointerDamp;
        camera.lookAt(0, 0, -10);
        uniforms.camera.value.set(camera.position.x, camera.position.y);
        uniforms.pointer.value.lerp(input.pointer, damp(step, 12));
        uniforms.torch.value += (input.torchTarget - uniforms.torch.value) * damp(step, 4);

        // The nebula is brightest behind the hero and recedes behind reading content
        const firstScreen = Math.min(scrollY / height, 1);
        uniforms.nebulaOpacity.value = 1 - firstScreen * 0.45;
        if (nebula) {
            const progress = scrollY / Math.max(1, input.docHeight - height);
            nebula.mesh.rotation.z = -0.12 - progress * 0.5;
        }

        const frameState = { delta: step, time: timer.getElapsed(), scrollY, width, height, idle };
        layers.forEach((layer) => layer.update?.(frameState));

        render();
    };

    const updateLoop = () => {
        const shouldRun = initialized && !paused && !reducedMotion && !disposed;
        if (shouldRun === running) return;
        running = shouldRun;
        renderer.setAnimationLoop(shouldRun ? tick : null)?.catch?.(() => {});
        if (!shouldRun) renderOnce();
    };

    const ready = (async () => {
        await renderer.init();
        if (disposed) return;
        initialized = true;
        await yieldToMain();
        nebula = createNebula({ renderer, palette, uniforms });
        scene.add(nebula.mesh);
        resize();
        await yieldToMain();
        // Compile shaders without blocking the main thread, before the first frame needs them
        await renderer.compileAsync(scene, camera);
        if (disposed) return;
        resizeObserver.observe(container);
        docObserver.observe(document.body);
        renderOnce();
        updateLoop();
    })();

    return {
        ready,
        renderer,
        palette,
        overlay,
        reducedMotion,
        isSmall,
        setColors: (next) => {
            targets.primary.set(next.primary);
            targets.accent.set(next.accent);
            targets.light.set(next.light);
            if (!running) {
                palette.primary.value.copy(targets.primary);
                palette.accent.value.copy(targets.accent);
                palette.light.value.copy(targets.light);
                renderOnce();
            }
        },
        setPaused: (value) => {
            paused = value;
            updateLoop();
        },
        addLayer: (layer) => {
            layers.add(layer);
            if (!layer.object) return;
            // Compile the layer's shaders off the main thread in a scene of its own (compileAsync skips
            // hidden objects), then move it into the overlay, so scrolling into a section doesn't stutter
            const staging = new Scene();
            staging.add(layer.object);
            renderer.compileAsync(staging, overlayCamera, overlay)
                .catch(() => {})
                .finally(() => {
                    if (disposed || !layers.has(layer)) return;
                    overlay.add(layer.object);
                    renderOnce();
                });
        },
        removeLayer: (layer) => {
            layers.delete(layer);
            if (layer.object) overlay.remove(layer.object);
            renderOnce();
        },
        // Layers call this after changing state while the loop is stopped (reduced motion / paused)
        requestRender: () => {
            if (!running) renderOnce();
        },
        isAnimating: () => running,
        dispose: () => {
            disposed = true;
            // setAnimationLoop initialises the renderer if it isn't yet, so only call it once initialised
            if (initialized) renderer.setAnimationLoop(null)?.catch?.(() => {});
            resizeObserver.disconnect();
            docObserver.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('scroll', markActive);
            window.removeEventListener('scroll', onScrollWhileStill);
            cancelAnimationFrame(pendingStill);
            window.removeEventListener('keydown', markActive);
            document.documentElement.removeEventListener('pointerleave', onPointerLeave);
            layers.forEach((layer) => layer.dispose?.());
            layers.clear();
            timer.dispose();
            stars.material.dispose();
            nebula?.dispose();
            try {
                renderer.dispose();
            } catch {
                // A renderer that never initialised has nothing to release
            }
            renderer.domElement.remove();
        },
    };
};
