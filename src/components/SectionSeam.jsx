/**
 * جداکننده تزئینی بین هیرو / سکشن‌ها
 */
const PATHS = {
    wave: 'M0,48 C180,92 300,8 520,44 C740,80 860,16 1080,52 C1240,78 1360,36 1440,48 L1440,120 L0,120 Z',
    slash: 'M0,72 L360,28 L780,78 L1100,22 L1440,64 L1440,120 L0,120 Z',
    petal: 'M0,56 C120,56 140,18 240,28 C340,38 360,92 480,78 C600,64 640,12 760,30 C880,48 920,96 1060,70 C1180,48 1260,28 1440,46 L1440,120 L0,120 Z',
    ridge: 'M0,64 L80,40 L160,70 L260,28 L360,68 L470,34 L580,72 L700,30 L820,66 L940,36 L1080,70 L1200,32 L1320,64 L1440,42 L1440,120 L0,120 Z',
};

const ACCENTS = {
    wave: 'M0,52 C180,96 300,12 520,48 C740,84 860,20 1080,56 C1240,82 1360,40 1440,52',
    slash: 'M0,78 L360,34 L780,84 L1100,28 L1440,70',
    petal: 'M0,62 C140,62 180,28 280,36 C400,46 420,96 540,84 C680,68 700,24 840,40 C980,56 1020,100 1180,74 C1300,56 1360,40 1440,52',
    ridge: 'M0,70 L80,46 L160,76 L260,34 L360,74 L470,40 L580,78 L700,36 L820,72 L940,42 L1080,76 L1200,38 L1320,70 L1440,48',
};

/**
 * @param {'wave'|'slash'|'petal'|'ridge'} [variant]
 * @param {'paper'|'warm'|'dark'|'ink'} [tone]
 * @param {string} [className]
 */
export function SectionSeam({ variant = 'wave', tone = 'paper', className = '' }) {
    const fillPath = PATHS[variant] || PATHS.wave;
    const accentPath = ACCENTS[variant] || ACCENTS.wave;

    return (
        <div
            className={`section-seam section-seam--${variant} section-seam--${tone} ${className}`.trim()}
            aria-hidden="true"
        >
            <svg className="section-seam__svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path className="section-seam__fill" d={fillPath} />
                <path className="section-seam__accent" d={accentPath} fill="none" />
                <path className="section-seam__glow" d={accentPath} fill="none" />
            </svg>
            <span className="section-seam__spark section-seam__spark--a" />
            <span className="section-seam__spark section-seam__spark--b" />
            <span className="section-seam__spark section-seam__spark--c" />
        </div>
    );
}
