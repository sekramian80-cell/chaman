import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

export function PulseRibbon({ items = [] }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();
    const doubled = [...items, ...items];

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const tween = gsap.to('.exp-pulse__track', {
            xPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: rootRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
            },
        });

        return () => tween.kill();
    }, [reduced, items.length]);

    return (
        <div className="exp-pulse" ref={rootRef} aria-hidden="true">
            <div className="exp-pulse__track">
                {doubled.map((item, index) => (
                    <span key={`${item}-${index}`} className="exp-pulse__item">
                        <i />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
