import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

export function Section({
    children,
    className = '',
    id,
    tone = 'dark',
    container = true,
}) {
    return (
        <section id={id} className={`lux-section lux-section--${tone} ${className}`.trim()}>
            <div className="lux-section__glow" aria-hidden="true" />
            {container ? <div className="container lux-section__inner">{children}</div> : children}
        </section>
    );
}

export function BentoGrid({ children, className = '' }) {
    return <div className={`lux-bento ${className}`.trim()}>{children}</div>;
}

export function HorizontalShowcase({ items = [] }) {
    const pinRef = useRef(null);
    const trackRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !pinRef.current || !trackRef.current || items.length < 2) {
            return undefined;
        }

        const mm = window.matchMedia('(max-width: 768px)');
        if (mm.matches) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            const track = trackRef.current;
            const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

            gsap.fromTo(
                track,
                { x: 0 },
                {
                    x: () => -getTravel(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: pinRef.current,
                        start: 'top top+=72',
                        end: () => `+=${getTravel()}`,
                        scrub: 0.85,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                },
            );
        }, pinRef);

        return () => ctx.revert();
    }, [reduced, items.length]);

    return (
        <div className="lux-hscroll" ref={pinRef}>
            <div className="lux-hscroll__track" ref={trackRef}>
                {items.map((item) => (
                    <article className="lux-hscroll__card" key={item.id ?? item.title}>
                        <div className="lux-hscroll__media">
                            <img src={item.image} alt={item.imageAlt || item.title} loading="lazy" decoding="async" />
                        </div>
                        <div className="lux-hscroll__body">
                            <span>{item.subcategoryLabel || item.meta}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description || item.text}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
