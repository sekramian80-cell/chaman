import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Character-level typography choreography
 */
export function TextChoreography({
    text,
    as: Tag = 'h1',
    className = '',
    delay = 0,
    stagger = 0.028,
    mode = 'chars',
}) {
    const ref = useRef(null);
    const reduced = usePrefersReducedMotion();
    const units =
        mode === 'words'
            ? String(text || '').split(/\s+/).filter(Boolean)
            : Array.from(String(text || ''));

    useLayoutEffect(() => {
        if (!ref.current || reduced) return undefined;

        const targets = ref.current.querySelectorAll('.exp-char__inner');
        const tween = gsap.fromTo(
            targets,
            { yPercent: 120, rotateX: -28, opacity: 0, filter: 'blur(8px)' },
            {
                yPercent: 0,
                rotateX: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.1,
                ease: 'power4.out',
                stagger,
                delay,
            },
        );

        return () => tween.kill();
    }, [text, delay, stagger, reduced, mode]);

    return (
        <Tag className={`exp-type ${className}`.trim()} ref={ref}>
            {units.map((unit, index) => (
                <span
                    className={`exp-char ${unit === ' ' ? 'exp-char--space' : ''}`.trim()}
                    key={`${unit}-${index}`}
                >
                    <span className="exp-char__inner">{unit === ' ' ? '\u00a0' : unit}</span>
                </span>
            ))}
        </Tag>
    );
}

/**
 * Scroll-triggered line reveal
 */
export function LineReveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const reduced = usePrefersReducedMotion();

    useLayoutEffect(() => {
        if (!ref.current || reduced) return undefined;

        const tween = gsap.fromTo(
            ref.current,
            { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0 },
            {
                clipPath: 'inset(0% 0 0 0)',
                y: 0,
                opacity: 1,
                duration: 1.2,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse',
                },
            },
        );

        return () => tween.kill();
    }, [delay, reduced]);

    return (
        <div className={`exp-line-reveal ${className}`.trim()} ref={ref}>
            {children}
        </div>
    );
}
