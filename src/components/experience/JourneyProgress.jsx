import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Thin journey progress — feels like a film timeline, not a website scrollbar
 */
export function JourneyProgress() {
    const barRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !barRef.current) return undefined;

        const tween = gsap.fromTo(
            barRef.current,
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    scrub: 0.35,
                    start: 0,
                    end: 'max',
                },
            },
        );

        return () => tween.kill();
    }, [reduced]);

    if (reduced) return null;

    return (
        <div className="exp-progress" aria-hidden="true">
            <span className="exp-progress__track">
                <i ref={barRef} className="exp-progress__fill" />
            </span>
        </div>
    );
}
