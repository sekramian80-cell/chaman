import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

export function DramaticStats({ stats = [] }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.utils.toArray('.exp-stat').forEach((stat, index) => {
                gsap.fromTo(
                    stat,
                    { y: 80, opacity: 0, scale: 0.88 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        delay: index * 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: stat,
                            start: 'top 88%',
                            toggleActions: 'play none none reverse',
                        },
                    },
                );
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced, stats.length]);

    return (
        <section className="exp-stats" ref={rootRef}>
            <div className="container">
                <span className="exp-kicker">۰۴ — اعداد</span>
                <h2>نتیجه‌ای که قابل لمس است</h2>
            </div>
            <div className="exp-stats__row">
                {stats.map((stat) => (
                    <article className="exp-stat" key={stat.id}>
                        <strong data-value={stat.value}>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </article>
                ))}
            </div>
        </section>
    );
}
