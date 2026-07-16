import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

/**
 * Split-line / word reveal for Persian headings
 */
export function AnimatedHeading({
    text,
    as: Tag = 'h1',
    className = '',
    delay = 0,
    stagger = 0.045,
}) {
    const ref = useRef(null);
    const reduced = usePrefersReducedMotion();
    const words = String(text || '').split(/\s+/).filter(Boolean);

    useLayoutEffect(() => {
        if (!ref.current || reduced) return undefined;

        const targets = ref.current.querySelectorAll('.lux-word__inner');
        const tween = gsap.fromTo(
            targets,
            { yPercent: 110, rotate: 4, opacity: 0 },
            {
                yPercent: 0,
                rotate: 0,
                opacity: 1,
                duration: 1.05,
                ease: 'power3.out',
                stagger,
                delay,
            },
        );

        return () => tween.kill();
    }, [text, delay, stagger, reduced]);

    return (
        <Tag className={`lux-heading ${className}`.trim()} ref={ref}>
            {words.map((word, index) => (
                <span className="lux-word" key={`${word}-${index}`}>
                    <span className="lux-word__inner">{word}</span>
                </span>
            ))}
        </Tag>
    );
}
