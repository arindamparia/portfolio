/**
 * The page curtain: a dark cover (defined inline in index.html) that hides the first frames
 * while fonts load and the hero's stars get into position, so nobody sees styles being applied.
 *
 * liftCurtain() fades it out (idempotent). waitForCurtain() resolves once it has lifted, so
 * intro animations start when the visitor can actually see them.
 */

const LIFTED_EVENT = 'curtain:lifted';
let lifted = typeof document === 'undefined' || !document.getElementById('curtain');

export const isCurtainLifted = () => lifted;

export const liftCurtain = () => {
    if (lifted) return;
    lifted = true;
    const curtain = document.getElementById('curtain');
    if (curtain) {
        curtain.classList.add('lifted');
        setTimeout(() => curtain.remove(), 600);
    }
    window.dispatchEvent(new Event(LIFTED_EVENT));
};

// Resolves when the web fonts are actually applied (or after `timeout`), so the page never
// appears in fallback fonts and then visibly changes
const FONTS = ['400 1em "Libre Caslon Display"', '400 1em "IBM Plex Sans"', '500 1em "IBM Plex Sans"'];

export const waitForFonts = (timeout = 1500) => Promise.race([
    Promise.all(FONTS.map((font) => document.fonts?.load(font).catch(() => null))),
    new Promise((resolve) => setTimeout(resolve, timeout)),
]);

export const waitForCurtain = () => (lifted
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener(LIFTED_EVENT, () => resolve(), { once: true })));
