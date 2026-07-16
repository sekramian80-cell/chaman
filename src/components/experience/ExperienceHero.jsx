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

/**
 * Arrival moment — cinematic hero that dissolves into the landscape as you scroll
 */
export function ExperienceHero() {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();
    const motionReduced = useReducedMotion();
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 48, damping: 22 });
    const sy = useSpring(my, { stiffness: 48, damping: 22 });
    const layer2x = useSpring(mx, { stiffness: 30, damping: 18 });
    const layer2y = useSpring(my, { stiffness: 30, damping: 18 });

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: '+=120%',
                    scrub: 0.9,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.to('.exp-hero__bg', { scale: 1.22, yPercent: 8, ease: 'none' }, 0)
                .to('.exp-hero__content', { yPercent: -28, opacity: 0, filter: 'blur(8px)', ease: 'power1.in' }, 0)
                .to('.exp-hero__floats', { yPercent: 40, opacity: 0, ease: 'power1.in' }, 0)
                .to('.exp-hero__veil', { opacity: 1, ease: 'none' }, 0.15)
                .to('.exp-hero__scroll', { opacity: 0 }, 0);

            gsap.fromTo(
                '.exp-hero__light',
                { opacity: 0.2, scale: 0.8 },
                { opacity: 1, scale: 1.15, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 },
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
                mx.set((event.clientX - rect.width / 2) / 28);
                my.set((event.clientY - rect.height / 2) / 28);
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
                        backgroundImage: `linear-gradient(195deg, rgba(2,8,5,0.15) 0%, rgba(2,8,5,0.55) 45%, rgba(2,8,5,0.96) 88%), url(${heroImage})`,
                    }}
                />
                <span className="exp-hero__light" aria-hidden="true" />
                <motion.div className="exp-hero__layer exp-hero__layer--mid" style={{ x: layer2x, y: layer2y }} />
                <motion.div className="exp-hero__layer exp-hero__layer--front" style={{ x: sx, y: sy }} />
                <AuroraMesh className="exp-aurora--hero" />
                <div className="exp-hero__vignette" aria-hidden="true" />
                <div className="exp-hero__grain" aria-hidden="true" />
                <div className="exp-hero__veil" aria-hidden="true" />
            </div>

            <div className="container exp-hero__content">
                <p className="exp-hero__brand">فراز چمن</p>
                <span className="exp-hero__eyebrow">{heroContent.eyebrow}</span>

                <TextChoreography
                    as="h1"
                    className="exp-hero__title"
                    text={heroContent.title}
                    delay={0.25}
                    stagger={0.02}
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

            <div className="exp-hero__floats">
                {floatCards.map((card) => (
                    <TiltSurface key={card.title} className={`exp-hero__float exp-hero__float--${card.offset}`}>
                        <strong>{card.title}</strong>
                        <span>{card.sub}</span>
                    </TiltSurface>
                ))}
            </div>

            <div className="exp-hero__scroll" aria-hidden="true">
                <span>ورود به فضا</span>
                <i className="exp-hero__scroll-line" />
            </div>
        </section>
    );
}
