/**
 * Organic terrain bridge — replaces hard section separators
 */
export function TerrainBridge({ variant = 'ridge', invert = false, className = '' }) {
    const paths = {
        ridge: 'M0,80 C180,20 360,140 540,70 C720,0 900,110 1080,50 C1200,20 1320,80 1440,40 L1440,160 L0,160 Z',
        dune: 'M0,100 C240,160 480,20 720,90 C960,160 1200,40 1440,110 L1440,160 L0,160 Z',
        canyon: 'M0,40 C120,120 280,10 420,90 C560,170 700,30 860,100 C1020,170 1200,50 1440,80 L1440,160 L0,160 Z',
        mist: 'M0,120 C200,60 400,140 600,80 C800,20 1000,130 1200,70 C1320,40 1400,100 1440,90 L1440,160 L0,160 Z',
    };

    return (
        <div
            className={`exp-terrain exp-terrain--${variant} ${invert ? 'exp-terrain--invert' : ''} ${className}`.trim()}
            aria-hidden="true"
        >
            <svg viewBox="0 0 1440 160" preserveAspectRatio="none">
                <path className="exp-terrain__fill" d={paths[variant] || paths.ridge} />
                <path
                    className="exp-terrain__line"
                    fill="none"
                    d={(paths[variant] || paths.ridge).replace(' L1440,160 L0,160 Z', '')}
                />
            </svg>
            <span className="exp-terrain__haze" />
        </div>
    );
}
