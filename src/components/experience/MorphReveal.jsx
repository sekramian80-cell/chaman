import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { BeforeAfter } from '../luxury/BeforeAfter.jsx';
import { TextChoreography } from './TextChoreography.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * Transformation moment — compare slider emerges from a morphing mask
 */
export function MorphReveal({ beforeSrc, afterSrc, beforeLabel, afterLabel }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.exp-morph__compare',
                {
                    clipPath: 'circle(0% at 50% 50%)',
                    scale: 0.88,
                    rotate: -3,
                },
                {
                    clipPath: 'circle(75% at 50% 50%)',
                    scale: 1,
                    rotate: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top 85%',
                        end: 'top 30%',
                        scrub: 0.65,
                    },
                },
            );

            gsap.fromTo(
                '.exp-morph__title',
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top 90%',
                        end: 'top 60%',
                        scrub: true,
                    },
                },
            );
        }, rootRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <section className="exp-morph" ref={rootRef}>
            <div className="exp-morph__mist" aria-hidden="true" />
            <div className="container exp-morph__inner">
                <TextChoreography
                    as="h2"
                    className="exp-morph__title"
                    text="قبل و بعد را لمس کنید"
                    mode="words"
                    stagger={0.07}
                />
                <p className="exp-morph__lead">سطح خام به یک تجربه زندگی تبدیل می‌شود.</p>
                <div className="exp-morph__compare">
                    <BeforeAfter
                        beforeSrc={beforeSrc}
                        afterSrc={afterSrc}
                        beforeLabel={beforeLabel}
                        afterLabel={afterLabel}
                        className="exp-compare"
                    />
                </div>
            </div>
        </section>
    );
}
