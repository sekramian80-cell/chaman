import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

export function MaskReveal({ src, alt, className = '' }) {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !wrapRef.current || !imgRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                wrapRef.current,
                { clipPath: 'polygon(18% 100%, 82% 100%, 100% 0%, 0% 0%)' },
                {
                    clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: wrapRef.current,
                        start: 'top 78%',
                        end: 'top 28%',
                        scrub: 0.6,
                    },
                },
            );

            gsap.fromTo(
                imgRef.current,
                { scale: 1.28, rotate: -2 },
                {
                    scale: 1,
                    rotate: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapRef.current,
                        start: 'top 85%',
                        end: 'top 20%',
                        scrub: true,
                    },
                },
            );
        }, wrapRef);

        return () => ctx.revert();
    }, [reduced, src]);

    return (
        <div className={`exp-mask ${className}`.trim()} ref={wrapRef}>
            <div className="exp-mask__glow" aria-hidden="true" />
            <img ref={imgRef} src={src} alt={alt} loading="lazy" decoding="async" />
        </div>
    );
}
