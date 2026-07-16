import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { toPersianDigits } from '../../utils/persianNumber.js';

function parseStat(value) {
    const raw = String(value);
    const match = raw.match(/([\d۰-۹]+)/);
    if (!match) return { prefix: '', number: null, suffix: raw };

    const index = raw.indexOf(match[0]);
    const persianToEnglish = match[1].replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    return {
        prefix: raw.slice(0, index),
        number: Number(persianToEnglish),
        suffix: raw.slice(index + match[1].length),
    };
}

export function StatCounter({ value, label, className = '' }) {
    const ref = useRef(null);
    const reduced = usePrefersReducedMotion();
    const parsed = parseStat(value);
    const [display, setDisplay] = useState(parsed.number == null ? value : `${parsed.prefix}۰${parsed.suffix}`);

    useEffect(() => {
        if (parsed.number == null || reduced) {
            setDisplay(value);
            return undefined;
        }

        const node = ref.current;
        if (!node) return undefined;

        let frame;
        let started = false;

        const run = () => {
            if (started) return;
            started = true;
            const start = performance.now();
            const duration = 1400;
            const target = parsed.number;

            const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - t, 3);
                const current = Math.round(target * eased);
                setDisplay(`${parsed.prefix}${toPersianDigits(current)}${parsed.suffix}`);
                if (t < 1) frame = requestAnimationFrame(tick);
            };

            frame = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    run();
                    observer.disconnect();
                }
            },
            { threshold: 0.4 },
        );

        observer.observe(node);
        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, [value, parsed.number, parsed.prefix, parsed.suffix, reduced]);

    return (
        <div className={`lux-stat ${className}`.trim()} ref={ref}>
            <strong>{display}</strong>
            <span>{label}</span>
        </div>
    );
}
