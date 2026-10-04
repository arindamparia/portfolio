import React from 'react';
import { SPEEDS } from '../demos/stepper';

/**
 * Shared pieces for algorithm demos: the stage the stars perform on, a caption that screen
 * readers announce, and Play / Step / Replay / Speed controls.
 */

export const DemoStage = React.forwardRef(({ label, className = '', children, ...rest }, ref) => (
    <div ref={ref} className={`sky-stage ${className}`} role="img" aria-label={label} {...rest}>
        {children}
    </div>
));
DemoStage.displayName = 'DemoStage';

export const DemoCaption = ({ children }) => (
    <p className="demo-caption" aria-live="polite">
        {children}
    </p>
);

export const DemoControls = ({ state, call, label, onShuffle }) => {
    if (!state) return null;

    const nextSpeed = SPEEDS[(SPEEDS.indexOf(state.speed) + 1) % SPEEDS.length];

    // Always available: "Pause the sky" and reduced motion only stop demos from playing on their own
    return (
        <div className="demo-controls" role="group" aria-label={`${label} controls`}>
            <button type="button" className="demo-button" onClick={() => call('toggle')} aria-pressed={state.playing}>
                {state.playing ? 'Pause' : state.done ? 'Play again' : 'Play'}
            </button>
            <button type="button" className="demo-button" onClick={() => call('step')}>
                Step
            </button>
            <button type="button" className="demo-button" onClick={() => call('replay')}>
                Replay
            </button>
            <button
                type="button"
                className="demo-button"
                onClick={() => call('setSpeed', nextSpeed)}
                aria-label={`${state.speed}× speed, change to ${nextSpeed}×`}
            >
                {state.speed}×
            </button>
            {onShuffle && (
                <button type="button" className="demo-button" onClick={onShuffle}>
                    Shuffle
                </button>
            )}
        </div>
    );
};
