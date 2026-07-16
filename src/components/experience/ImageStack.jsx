import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

export function ImageStack({ items = [] }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();
    const stack = items.slice(0, 6);

    useEffect(() => {
        if (reduced || !rootRef.current || stack.length < 2) return undefined;

        const mm = window.matchMedia('(max-width: 768px)');
        if (mm.matches) return undefined;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.exp-stack__card');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top+=64',
                    end: () => `+=${window.innerHeight * (stack.length + 0.5)}`,
                    scrub: 0.8,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            cards.forEach((card, index) => {
                if (index === 0) return;
                tl.fromTo(
                    card,
                    { yPercent: 110, scale: 0.92, rotate: index % 2 ? 3 : -3, opacity: 0.4 },
                    { yPercent: 0, scale: 1, rotate: 0, opacity: 1, ease: 'power2.out' },
                    index * 0.85,
                );
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced, stack.length]);

    if (!stack.length) return null;

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

    if (reduced || isMobile) {
        return (
            <div className="exp-stack exp-stack--grid">
                <div className="container exp-stack__grid">
                    {stack.map((item) => (
                        <article className="exp-stack__card exp-stack__card--static" key={item.id ?? item.title}>
                            <img src={item.image} alt={item.imageAlt || item.title} loading="lazy" decoding="async" />
                            <div className="exp-stack__caption">
                                <span>{item.subcategoryLabel || item.meta}</span>
                                <h3>{item.title}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="exp-stack" ref={rootRef}>
            <div className="exp-stack__stage">
                {stack.map((item, index) => (
                    <article
                        className="exp-stack__card"
                        key={item.id ?? item.title}
                        style={{ zIndex: index + 1 }}
                    >
                        <img src={item.image} alt={item.imageAlt || item.title} loading="lazy" decoding="async" />
                        <div className="exp-stack__caption">
                            <span>{item.subcategoryLabel || item.meta}</span>
                            <h3>{item.title}</h3>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
