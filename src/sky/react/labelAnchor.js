/**
 * Anchor a stage label by where it sits across the stage (nx from 0 to 1): left-aligned at the
 * left edge, centred in the middle, right-aligned at the right edge, so labels never spill out.
 */
export const labelAnchor = (nx) => ({ transform: `translateX(-${Math.round(Math.min(Math.max(nx, 0), 1) * 100)}%)` });
