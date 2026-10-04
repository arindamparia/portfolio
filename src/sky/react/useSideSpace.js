import { useSyncExternalStore } from 'react';

/**
 * True when the screen is wide enough for a demo to sit beside the text (≥ 1024px).
 * On narrower screens section demos are skipped entirely, so they never push content down
 * (or cost anything to load); the hero's star-drawn name still shows everywhere.
 */
const QUERY = '(min-width: 1024px)';

const subscribe = (onChange) => {
    const media = window.matchMedia(QUERY);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

export const useSideSpace = () => useSyncExternalStore(subscribe, getSnapshot, () => false);
