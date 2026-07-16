import { useEffect, useRef } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import heroImage from '../../assets/hero-football-field.jpg';
import { heroContent } from '../../content/hero.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { AuroraMesh } from './AuroraMesh.jsx';
import { ElasticButton } from './ElasticButton.jsx';
import { TextChoreography } from './TextChoreography.jsx';
import { TiltSurface } from './TiltSurface.jsx';

gsap.registerPlugin(ScrollTrigger);

const floatCards = [
    { title: 'همیشه سبز', sub: 'بدون فصل زرد', offset: 'a' },
    { title: 'اجرای دقیق', sub: 'لبه‌کاری مخفی', offset: 'b' },
    { title: 'فیفا‌کوالیتی', sub: 'زمین ورزشی', offset: 'c' },
];

export function ExperienceHero() {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();
    const motionReduced = useReducedMotion();
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 50, damping: 20 });
    const sy = useSpring(my, { stiffness: 50, damping: 20 });
    const layer2x = useSpring(mx, { stiffness: 35, damping: 18 });
    const layer2y = useSpring(my, { stiffness: 35, damping: 18 });

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.to('.exp-hero__bg', {
                scale: 1.14,
                ease: 'none',
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            gsap.fromTo(
                '.exp-hero__scroll-line',
                { scaleY: 0 },
                { scaleY: 1, duration: 1.4, delay: 1.4, ease: 'power2.inOut' },
            );
        }, rootRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <section
            id="top"
            className="exp-hero"
            ref={rootRef}
            onMouseMove={(event) => {
                if (motionReduced) return;
                const rect = event.currentTarget.getBoundingClientRect();
                mx.set((event.clientX - rect.width / 2) / 32);
                my.set((event.clientY - rect.height / 2) / 32);
            }}
            onMouseLeave={() => {
                mx.set(0);
                my.set(0);
            }}
        >
            <div className="exp-hero__stage">
                <motion.div
                    className="exp-hero__bg"
                    style={{
                        x: sx,
                        y: sy,
                        backgroundImage: `linear-gradient(185deg, rgba(2,8,5,0.25) 0%, rgba(2,8,5,0.92) 72%), url(${heroImage})`,
                    }}
                />
                <motion.div className="exp-hero__layer exp-hero__layer--mid" style={{ x: layer2x, y: layer2y }} />
                <motion.div className="exp-hero__layer exp-hero__layer--front" style={{ x: sx, y: sy }} />
                <AuroraMesh className="exp-aurora--hero" />
                <div className="exp-hero__vignette" aria-hidden="true" />
                <div className="exp-hero__grain" aria-hidden="true" />
            </div>

            <div className="container exp-hero__content">
                <div className="exp-hero__meta">
                    <span className="exp-hero__index">۰۱</span>
                    <span className="exp-hero__eyebrow">{heroContent.eyebrow}</span>
                </div>

                <TextChoreography
                    as="h1"
                    className="exp-hero__title"
                    text={heroContent.title}
                    delay={0.2}
                    stagger={0.022}
                />

                <p className="exp-hero__lead">{heroContent.description}</p>

                <div className="exp-hero__actions">
                    <ElasticButton className="exp-btn exp-btn--primary" href={heroContent.primaryCta.href}>
                        {heroContent.primaryCta.label}
                        <ArrowLeft size={18} />
                    </ElasticButton>
                    <ElasticButton className="exp-btn exp-btn--ghost" href={heroContent.secondaryCta.href} glow={false}>
                        <PlayCircle size={18} />
                        {heroContent.secondaryCta.label}
                    </ElasticButton>
                </div>

                {heroContent.fifaBadge ? <p className="exp-hero__badge">{heroContent.fifaBadge}</p> : null}
            </div>

            <div className="exp-hero__floats" aria-hidden="true">
                {floatCards.map((card) => (
                    <TiltSurface key={card.title} className={`exp-hero__float exp-hero__float--${card.offset}`}>
                        <strong>{card.title}</strong>
                        <span>{card.sub}</span>
                    </TiltSurface>
                ))}
            </div>

            <div className="exp-hero__scroll" aria-hidden="true">
                <span>کشف کنید</span>
                <i className="exp-hero__scroll-line" />
            </div>
        </section>
    );
}
