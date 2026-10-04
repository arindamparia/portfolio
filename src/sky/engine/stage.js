import { Group } from 'three/webgpu';

/**
 * A stage pins a group of overlay objects (actors, links) to a DOM element, so stars line up
 * with the text and controls around them at any screen size.
 *
 * Coordinates inside the group are CSS pixels relative to the element's top-left corner.
 * The element's rectangle is read once per frame, and only while it is near the viewport.
 */
export const createStage = (element) => {
    const group = new Group();
    let rect = element.getBoundingClientRect();
    let near = true;

    const observer = new IntersectionObserver(
        ([entry]) => {
            near = entry.isIntersecting;
            group.visible = near;
        },
        { rootMargin: '25% 0px' }
    );
    observer.observe(element);

    return {
        group,
        element,
        get rect() {
            return rect;
        },
        get visible() {
            return near;
        },
        /** Re-read the element position; call once per frame before drawing */
        sync() {
            if (!near) return rect;
            rect = element.getBoundingClientRect();
            group.position.set(rect.left, -rect.top, 0);
            return rect;
        },
        dispose() {
            observer.disconnect();
        },
    };
};
