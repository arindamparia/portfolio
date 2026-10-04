/**
 * Sample points that fill the text of a DOM element, in CSS pixels relative to the element.
 *
 * Each word is drawn into an offscreen canvas at the exact box the browser laid it out in
 * (via Range rects), so the points line up with the real heading, including line wraps.
 */
export const sampleTextPoints = async (element, count, random = Math.random) => {
    const style = getComputedStyle(element);
    const fontSize = parseFloat(style.fontSize);
    const font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;

    // Make sure the display face is loaded before measuring, or we'd sample the fallback font
    try {
        await document.fonts.load(font, element.textContent);
    } catch {
        // Font loading API unavailable; sample whatever is rendered
    }

    const rect = element.getBoundingClientRect();
    const scale = fontSize < 60 ? 3 : 2;
    const width = Math.ceil(rect.width * scale);
    const height = Math.ceil(rect.height * scale);
    if (!width || !height) return new Float32Array(0);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize * scale}px ${style.fontFamily}`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    if ('letterSpacing' in ctx && style.letterSpacing !== 'normal') {
        ctx.letterSpacing = `${parseFloat(style.letterSpacing) * scale}px`;
    }

    const range = document.createRange();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (const match of node.textContent.matchAll(/\S+/g)) {
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const box = range.getBoundingClientRect();
            const metrics = ctx.measureText(match[0]);
            const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
            const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
            // The inline box is the font's content area, centred in the line box
            const top = (box.top - rect.top) * scale + (box.height * scale - (ascent + descent)) / 2;
            ctx.fillText(match[0], (box.left - rect.left) * scale, top + ascent);
        }
    }

    const pixels = ctx.getImageData(0, 0, width, height).data;
    const candidates = [];
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            if (pixels[(y * width + x) * 4 + 3] > 140) candidates.push(x, y);
        }
    }

    const available = candidates.length / 2;
    if (available === 0) return new Float32Array(0);

    // Uniformly random subset of the filled pixels: a partial Fisher–Yates shuffle is enough
    // (repeats only happen if the text is tiny)
    const indices = Uint32Array.from({ length: available }, (_, i) => i);
    const picks = Math.min(count, available);
    for (let i = 0; i < picks; i++) {
        const j = i + Math.floor(random() * (available - i));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const points = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
        const k = indices[i % picks];
        points[i * 2] = (candidates[k * 2] + random() * 0.6) / scale;
        points[i * 2 + 1] = (candidates[k * 2 + 1] + random() * 0.6) / scale;
    }
    return points;
};
