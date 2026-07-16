import { useEffect, useState } from 'react';

function detectLite() {
    if (typeof window === 'undefined') return true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.matchMedia('(max-width: 1024px)').matches;
    const lowCores = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
    const saveData = navigator.connection?.saveData === true;

    return reduced || coarse || narrow || lowCores || saveData;
}

/**
 * Lightweight experience on mobile, touch, low-end, or save-data connections.
 */
export function useLiteExperience() {
    const [lite, setLite] = useState(detectLite);

    useEffect(() => {
        const update = () => setLite(detectLite());
        update();

        const queries = [
            window.matchMedia('(prefers-reduced-motion: reduce)'),
            window.matchMedia('(pointer: coarse)'),
            window.matchMedia('(max-width: 1024px)'),
        ];

        queries.forEach((mq) => mq.addEventListener('change', update));
        window.addEventListener('resize', update, { passive: true });

        return () => {
            queries.forEach((mq) => mq.removeEventListener('change', update));
            window.removeEventListener('resize', update);
        };
    }, []);

    return lite;
}
