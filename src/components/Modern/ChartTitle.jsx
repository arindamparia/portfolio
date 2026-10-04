import React from 'react';

/**
 * A section heading set like a plate in a star atlas: the title, a hairline running across the
 * column, and (where the section's demo is shown) the algorithm its stars are running.
 */
const ChartTitle = ({ children, algorithm }) => (
    <div className={`chart-head ${algorithm ? 'has-algorithm' : ''}`}>
        <h2 className="chart-title">{children}</h2>
        <span className="chart-rule" aria-hidden="true" />
        {algorithm && (
            <span className="chart-algorithm">
                <span className="chart-algorithm-mark" aria-hidden="true">✦</span>
                {algorithm}
            </span>
        )}
    </div>
);

export default ChartTitle;
