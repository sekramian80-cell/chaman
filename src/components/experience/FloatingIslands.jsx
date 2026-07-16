import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { TiltSurface } from './TiltSurface.jsx';

gsap.registerPlugin(ScrollTrigger);

const orbits = [
    { x: '72%', y: '18%', rot: -6 },
    { x: '58%', y: '42%', rot: 4 },
    { x: '18%', y: '14%', rot: 8 },
    { x: '28%', y: '58%', rot: -3 },
    { x: '78%', y: '68%', rot: 5 },
    { x: '48%', y: '28%', rot: -8 },
];

/**
 * Constellation of trust signals — free-floating, not a card grid
 */
export function FloatingIslands({ items = [] }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.utils.toArray('.exp-island').forEach((node, index) => {
                gsap.fromTo(
                    node,
                    {
                        opacity: 0,
                        y: 80 + index * 12,
                        scale: 0.86,
                        rotate: orbits[index % orbits.length].rot * 2,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: orbits[index % orbits.length].rot,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: node,
                            start: 'top 92%',
                            end: 'top 55%',
                            scrub: 0.8,
                        },
                    },
                );

                gsap.to(node, {
                    y: (index % 2 === 0 ? -1 : 1) * (18 + index * 4),
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
    }, [reduced, items.length]);

    return (
        <section className="exp-islands" ref={rootRef}>
            <div className="exp-islands__aura" aria-hidden="true" />
            <div className="container exp-islands__whisper">
                <p>فضایی که پیش از حرف زدن، اعتماد می‌سازد</p>
            </div>
            <div className="exp-islands__field">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const orbit = orbits[index % orbits.length];
                    return (
                        <TiltSurface
                            key={item.id ?? item.label}
                            className="exp-island"
                            intensity={12}
                            style={{
                                left: orbit.x,
                                top: orbit.y,
                                '--island-rot': `${orbit.rot}deg`,
                            }}
                        >
                            {Icon ? <Icon size={22} /> : <span className="exp-island__dot" />}
                            <span>{item.label}</span>
                        </TiltSurface>
                    );
                })}
            </div>
        </section>
    );
}
