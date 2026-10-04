import { useSyncExternalStore } from 'react';
import { getLayoutClass, subscribeLayoutClass } from '../../utils/layoutClass';

/**
 * True when the screen is wide enough for a demo to sit beside the text (≥ 1024px).
 * On narrower screens section demos are skipped entirely, so they never push content down
 * (or cost anything to load); the hero's star-drawn name still shows everywhere.
 * Follows the page's layout class, so the switch happens inside the same View Transition.
 */
export const useSideSpace = () => useSyncExternalStore(subscribeLayoutClass, () => !getLayoutClass().narrow, () => false);
