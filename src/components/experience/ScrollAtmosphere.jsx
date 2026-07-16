import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven atmospheric background — light, hue, and grain shift across the journey
 */
export function ScrollAtmosphere() {
    const ref = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !ref.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                '--exp-atmo-shift': 1,
                ease: 'none',
                scrollTrigger: {
                    scrub: 1.4,
                    start: 0,
                    end: 'max',
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <div className="exp-atmosphere" ref={ref} aria-hidden="true">
            <div className="exp-atmosphere__layer exp-atmosphere__layer--dawn" />
            <div className="exp-atmosphere__layer exp-atmosphere__layer--dusk" />
            <div className="exp-atmosphere__layer exp-atmosphere__layer--night" />
            <div className="exp-atmosphere__grain" />
            <div className="exp-atmosphere__topo">
                <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
                    <path d="M0,400 Q150,320 300,380 T600,360 T900,400 T1200,350" />
                    <path d="M0,480 Q200,420 400,470 T800,450 T1200,500" />
                    <path d="M0,560 Q180,520 360,550 T720,540 T1200,580" />
                    <path d="M0,200 Q250,140 500,190 T1000,170 T1200,220" />
                </svg>
            </div>
        </div>
    );
}
