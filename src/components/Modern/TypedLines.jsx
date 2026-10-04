import React, { useEffect, useState } from 'react';
import { waitForCurtain } from '../../utils/curtain';

/**
 * Types out a few lines, one after another, once the page curtain has lifted.
 *
 * - The full text is laid out invisibly first, so typing never shifts the page
 * - Screen readers get the complete text immediately; the typed copy is aria-hidden
 * - With reduced motion the text simply appears
 *
 * lines: [{ text, className, speed (ms per character), pause (ms before the line) }]
 */
const TypedLines = ({ lines, reducedMotion }) => {
    const total = lines.reduce((sum, line) => sum + line.text.length, 0);
    const [typed, setTyped] = useState(reducedMotion ? total : 0);

    useEffect(() => {
        if (reducedMotion) return undefined;
        let cancelled = false;
        let timer = 0;

        // Build a schedule: each character's delay, including the pause before each line
        const delays = [];
        lines.forEach((line) => {
            for (let i = 0; i < line.text.length; i++) delays.push(i === 0 ? line.pause ?? 0 : line.speed ?? 40);
        });

        const tick = (index) => {
            if (cancelled || index >= delays.length) return;
            timer = setTimeout(() => {
                setTyped(index + 1);
                tick(index + 1);
            }, delays[index]);
        };
        waitForCurtain().then(() => tick(0));

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [lines, reducedMotion]);

    // Characters typed so far on each line (lines are typed in order)
    const starts = lines.map((_, i) => lines.slice(0, i).reduce((sum, line) => sum + line.text.length, 0));
    const shown = lines.map((line, i) => line.text.slice(0, Math.max(0, Math.min(typed - starts[i], line.text.length))));
    // The caret sits on the line being typed and disappears once everything is typed
    const caretLine = shown.findIndex((text, i) => text.length < lines[i].text.length);

    return (
        <>
            {lines.map((line, i) => (
                <p key={line.text} className={`typed-line ${line.className ?? ''}`}>
                    <span className="visually-hidden">{line.text}</span>
                    <span className="typed-ghost" aria-hidden="true">{line.text}</span>
                    <span className="typed-live" aria-hidden="true">
                        {shown[i]}
                        {i === caretLine && shown[i].length > 0 && <span className="typed-caret" />}
                    </span>
                </p>
            ))}
        </>
    );
};

export default TypedLines;
