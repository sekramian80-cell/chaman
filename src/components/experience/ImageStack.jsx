import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Archive — stacked project frames that peel forward with scroll
 */
export function ImageStack({ items = [] }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();
    const stack = items.slice(0, 6);
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const update = () => setIsCompact(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (reduced || isCompact || !rootRef.current || stack.length < 2) return undefined;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.exp-stack__card');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top+=48',
                    end: () => `+=${window.innerHeight * (stack.length + 0.8)}`,
                    scrub: 0.75,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            cards.forEach((card, index) => {
                if (index === 0) {
                    gsap.set(card, { zIndex: 1, scale: 1, rotate: -1.5 });
                    return;
                }

                tl.fromTo(
                    card,
                    {
                        yPercent: 115,
                        scale: 0.9,
                        rotate: index % 2 ? 5 : -5,
                        opacity: 0.35,
                        filter: 'blur(6px)',
                    },
                    {
                        yPercent: 0,
                        scale: 1,
                        rotate: index % 2 ? 1.2 : -1.2,
                        opacity: 1,
                        filter: 'blur(0px)',
                        ease: 'power2.out',
                    },
                    index * 0.75,
                );

                if (index > 0) {
                    tl.to(
                        cards[index - 1],
                        {
                            scale: 0.94 - index * 0.01,
                            yPercent: -6 * index,
                            opacity: 0.55,
                            filter: 'blur(2px)',
                            ease: 'none',
                        },
                        index * 0.75,
                    );
                }
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced, isCompact, stack.length]);

    if (!stack.length) return null;

    if (reduced || isCompact) {
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
            <div className="exp-stack__hint">
                <span>آرشیو فضا</span>
            </div>
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
