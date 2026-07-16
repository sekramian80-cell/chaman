import { useEffect, useRef } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import gsap from 'gsap';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import heroImage from '../../assets/hero-football-field.jpg';
import { heroContent } from '../../content/hero.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { AnimatedHeading } from './AnimatedHeading.jsx';
import { DustField } from './DustField.jsx';
import { MagneticButton } from './MagneticButton.jsx';

export function CinematicHero() {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();
    const motionReduced = useReducedMotion();
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 60, damping: 18 });
    const sy = useSpring(my, { stiffness: 60, damping: 18 });

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.lux-hero__orb',
                { scale: 0.7, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out', stagger: 0.12 },
            );
            gsap.fromTo(
                '.lux-hero__scroll',
                { opacity: 0, y: -12 },
                { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power2.out' },
            );
        }, rootRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <section
            id="top"
            className="lux-hero"
            ref={rootRef}
            onMouseMove={(event) => {
                if (motionReduced) return;
                const rect = event.currentTarget.getBoundingClientRect();
                mx.set((event.clientX - rect.width / 2) / 40);
                my.set((event.clientY - rect.height / 2) / 40);
            }}
            onMouseLeave={() => {
                mx.set(0);
                my.set(0);
            }}
        >
            <div className="lux-hero__media" style={{ '--hero-image': `url(${heroImage})` }}>
                <motion.div className="lux-hero__bg" style={{ x: sx, y: sy }} />
                <div className="lux-hero__overlay" />
                <div className="lux-hero__grain" aria-hidden="true" />
                <DustField density={32} />
            </div>

            <span className="lux-hero__orb lux-hero__orb--a" aria-hidden="true" />
            <span className="lux-hero__orb lux-hero__orb--b" aria-hidden="true" />
            <span className="lux-hero__orb lux-hero__orb--c" aria-hidden="true" />

            <div className="container lux-hero__content">
                <p className="lux-hero__brand">فراز چمن</p>
                <span className="lux-hero__eyebrow">{heroContent.eyebrow}</span>
                <AnimatedHeading className="lux-hero__title" text={heroContent.title} delay={0.15} />
                <p className="lux-hero__lead">{heroContent.description}</p>

                <div className="lux-hero__actions">
                    <MagneticButton className="lux-btn lux-btn--primary" href={heroContent.primaryCta.href}>
                        {heroContent.primaryCta.label}
                        <ArrowLeft size={18} />
                    </MagneticButton>
                    <MagneticButton className="lux-btn lux-btn--ghost" href={heroContent.secondaryCta.href}>
                        <PlayCircle size={18} />
                        {heroContent.secondaryCta.label}
                    </MagneticButton>
                </div>

                {heroContent.fifaBadge ? <p className="lux-hero__note">{heroContent.fifaBadge}</p> : null}

                <div className="lux-hero__glass-row">
                    <div className="lux-hero__glass">
                        <strong>همیشه سبز</strong>
                        <span>بدون فصل زرد</span>
                    </div>
                    <div className="lux-hero__glass">
                        <strong>اجرای دقیق</strong>
                        <span>لبه‌کاری مخفی</span>
                    </div>
                    <div className="lux-hero__glass">
                        <strong>فیفا‌کوالیتی</strong>
                        <span>زمین ورزشی</span>
                    </div>
                </div>
            </div>

            <div className="lux-hero__scroll" aria-hidden="true">
                <span>اسکرول کنید</span>
                <i />
            </div>
        </section>
    );
}
