/**
 * Plays a recorded algorithm one step at a time.
 *
 * The demo supplies `apply(i)` (draw step i), `reset()` (back to the start) and optionally
 * `finish()` (jump to the end state). The stepper owns timing, speed and play/pause, and calls
 * `onChange` whenever something a caption or control would show has changed.
 */
export const SPEEDS = [1, 2, 4];

export const createStepper = ({ total, interval, apply, reset, finish, onChange, sky }) => {
    let index = 0;
    let playing = false;
    let speed = 1;
    let clock = 0;
    let count = total;
    let release = null;

    const state = () => ({ index, total: count, playing, speed, done: index >= count });

    // While playing, keep the sky's animation loop awake (it may be paused or in reduced motion)
    const syncHold = () => {
        if (playing && !release && sky) release = sky.holdAnimation();
        if (!playing && release) {
            release();
            release = null;
        }
    };

    const changed = () => {
        syncHold();
        onChange?.(state());
    };

    const advance = () => {
        if (index >= count) return false;
        apply(index);
        index += 1;
        if (index >= count) playing = false;
        return true;
    };

    return {
        get state() {
            return state();
        },
        setTotal(next) {
            count = next;
        },
        play() {
            if (index >= count) {
                reset();
                index = 0;
            }
            playing = true;
            clock = 0;
            changed();
        },
        pause() {
            playing = false;
            changed();
        },
        toggle() {
            if (playing) this.pause();
            else this.play();
        },
        step() {
            playing = false;
            if (index >= count) {
                reset();
                index = 0;
            }
            advance();
            changed();
        },
        replay() {
            reset();
            index = 0;
            playing = true;
            clock = 0;
            changed();
        },
        /** Jump straight to the end state (used for reduced motion and skipping) */
        complete() {
            playing = false;
            if (finish) {
                finish();
                index = count;
            } else {
                while (index < count) advance();
            }
            changed();
        },
        restart() {
            playing = false;
            reset();
            index = 0;
            changed();
        },
        setSpeed(next) {
            speed = next;
            changed();
        },
        dispose() {
            playing = false;
            syncHold();
        },
        /** Call every frame; returns true if any step was drawn */
        update(delta) {
            if (!playing) return false;
            clock += delta * speed;
            let advanced = false;
            while (clock >= interval && playing) {
                clock -= interval;
                advanced = advance() || advanced;
            }
            if (advanced) changed();
            return advanced;
        },
    };
};
