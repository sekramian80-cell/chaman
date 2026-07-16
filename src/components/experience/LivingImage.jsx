import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-bleed image that expands / reveals via clip-path as you scroll past it
 */
export function LivingImage({ src, alt, className = '', shape = 'expand' }) {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !wrapRef.current || !imgRef.current) return undefined;

        const clips = {
            expand: {
                from: 'inset(18% 22% 18% 22% round 40px)',
                to: 'inset(0% 0% 0% 0% round 0px)',
            },
            slit: {
                from: 'inset(0% 48% 0% 48%)',
                to: 'inset(0% 0% 0% 0%)',
            },
            rise: {
                from: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            },
            diamond: {
                from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            },
        };

        const clip = clips[shape] || clips.expand;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                wrapRef.current,
                { clipPath: clip.from },
                {
                    clipPath: clip.to,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapRef.current,
                        start: 'top 90%',
                        end: 'top 25%',
                        scrub: 0.7,
                    },
                },
            );

            gsap.fromTo(
                imgRef.current,
                { scale: 1.35, rotate: shape === 'diamond' ? -4 : 1.5 },
                {
                    scale: 1,
                    rotate: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapRef.current,
                        start: 'top 95%',
                        end: 'top 20%',
                        scrub: true,
                    },
                },
            );
        }, wrapRef);

        return () => ctx.revert();
    }, [reduced, src, shape]);

    return (
        <figure className={`exp-living ${className}`.trim()} ref={wrapRef}>
            <img ref={imgRef} src={src} alt={alt} loading="lazy" decoding="async" />
            <span className="exp-living__bloom" aria-hidden="true" />
        </figure>
    );
}
