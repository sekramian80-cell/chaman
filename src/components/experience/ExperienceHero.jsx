import { useEffect, useRef } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import heroImage from '../../assets/hero-football-field.jpg';
import { heroContent } from '../../content/hero.js';
import { useLiteExperience } from '../../hooks/useLiteExperience.js';
import { ElasticButton } from './ElasticButton.jsx';
import { TiltSurface } from './TiltSurface.jsx';

const floatCards = [
    { title: 'همیشه سبز', sub: 'بدون فصل زرد', offset: 'a' },
    { title: 'اجرای دقیق', sub: 'لبه‌کاری مخفی', offset: 'b' },
    { title: 'فیفا‌کوالیتی', sub: 'زمین ورزشی', offset: 'c' },
];

export function ExperienceHero() {
    const rootRef = useRef(null);
    const lite = useLiteExperience();

    useEffect(() => {
        if (lite || !rootRef.current) return undefined;

        let cancelled = false;
        let ctx;

        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, stModule]) => {
            if (cancelled) return;

            const gsap = gsapModule.default;
            const { ScrollTrigger } = stModule;
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

            ctx = gsap.context(() => {
                gsap.to('.exp-hero__bg', {
                    scale: 1.06,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.5,
                    },
                });
            }, rootRef);
        });

        return () => {
            cancelled = true;
            ctx?.revert();
        };
    }, [lite]);

    return (
        <section id="top" className="exp-hero" ref={rootRef}>
            <div className="exp-hero__stage">
                <div
                    className="exp-hero__bg"
                    style={{
                        backgroundImage: `linear-gradient(195deg, rgba(2,8,5,0.15) 0%, rgba(2,8,5,0.55) 45%, rgba(2,8,5,0.96) 88%), url(${heroImage})`,
                    }}
                />
                {!lite ? <span className="exp-hero__light" aria-hidden="true" /> : null}
                <div className="exp-hero__layer exp-hero__layer--mid" aria-hidden="true" />
                <div className="exp-hero__layer exp-hero__layer--front" aria-hidden="true" />
                <div className="exp-hero__vignette" aria-hidden="true" />
                {!lite ? <div className="exp-hero__grain" aria-hidden="true" /> : null}
            </div>

            <div className="container exp-hero__content">
                <h1 className="exp-hero__title">{heroContent.title}</h1>

                {heroContent.fifaBadge ? (
                    <div className="exp-hero__fifa">
                        <span className="exp-hero__fifa-shine" aria-hidden="true" />
                        <span className="exp-hero__fifa-text">{heroContent.fifaBadge}</span>
                    </div>
                ) : null}

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
            </div>

            {!lite ? (
                <div className="exp-hero__floats">
                    {floatCards.map((card) => (
                        <TiltSurface key={card.title} className={`exp-hero__float exp-hero__float--${card.offset}`} float={false}>
                            <strong>{card.title}</strong>
                            <span>{card.sub}</span>
                        </TiltSurface>
                    ))}
                </div>
            ) : null}

            <div className="exp-hero__scroll" aria-hidden="true">
                <span>ورود به فضا</span>
                <i className="exp-hero__scroll-line" />
            </div>
        </section>
    );
}
