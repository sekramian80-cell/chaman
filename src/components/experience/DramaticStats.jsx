import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Magnitude — oversized numbers that bloom with scroll, not a stats row
 */
export function DramaticStats({ stats = [] }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.exp-stats__horizon',
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top 80%',
                        end: 'top 35%',
                        scrub: true,
                    },
                },
            );

            gsap.utils.toArray('.exp-stat').forEach((stat, index) => {
                gsap.fromTo(
                    stat,
                    { y: 120, opacity: 0, rotateX: -28 },
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: stat,
                            start: 'top 92%',
                            end: 'top 55%',
                            scrub: 0.7,
                        },
                    },
                );

                gsap.fromTo(
                    stat.querySelector('strong'),
                    { letterSpacing: '0.18em', scale: 0.88 },
                    {
                        letterSpacing: '-0.04em',
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: stat,
                            start: 'top 85%',
                            end: 'top 45%',
                            scrub: true,
                        },
                    },
                );

                gsap.to(stat, {
                    y: (index - 1) * -24,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced, stats.length]);

    return (
        <section className="exp-stats" ref={rootRef}>
            <div className="exp-stats__horizon" aria-hidden="true" />
            <div className="exp-stats__constellation">
                {stats.map((stat) => (
                    <article className="exp-stat" key={stat.id}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </article>
                ))}
            </div>
        </section>
    );
}
