import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { ElasticButton } from './ElasticButton.jsx';
import { LivingImage } from './LivingImage.jsx';
import { TextChoreography } from './TextChoreography.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * Architecture walk — image and copy evolve together through pinned scroll
 */
export function PinnedNarrative({ image, imageAlt, highlights = [], panel }) {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const mm = window.matchMedia('(max-width: 900px)');
        if (mm.matches) return undefined;

        const ctx = gsap.context(() => {
            const steps = gsap.utils.toArray('.exp-narrative__step');

            ScrollTrigger.create({
                trigger: rootRef.current,
                start: 'top top+=56',
                end: () => `+=${Math.max(window.innerHeight * 1.6, steps.length * 340)}`,
                pin: '.exp-narrative__visual',
                scrub: true,
                anticipatePin: 1,
            });

            steps.forEach((step) => {
                gsap.fromTo(
                    step,
                    { opacity: 0.2, x: 40, filter: 'blur(4px)' },
                    {
                        opacity: 1,
                        x: 0,
                        filter: 'blur(0px)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 78%',
                            end: 'top 42%',
                            scrub: 0.6,
                        },
                    },
                );
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced, highlights.length]);

    return (
        <section className="exp-narrative" ref={rootRef}>
            <div className="exp-narrative__stage">
                <div className="exp-narrative__visual">
                    <LivingImage src={image} alt={imageAlt} shape="slit" className="exp-narrative__living" />
                    <div className="exp-narrative__glass" aria-hidden="true">
                        <span />
                        <span />
                    </div>
                </div>

                <div className="exp-narrative__copy">
                    <div className="exp-narrative__step">
                        <TextChoreography
                            as="h2"
                            className="exp-narrative__title"
                            text="فضایی که مثل معماری لوکس روایت می‌شود"
                            mode="words"
                            stagger={0.055}
                        />
                    </div>

                    <div className="exp-narrative__step">
                        <p className="exp-narrative__text">
                            از انتخاب مدل تا نصب نهایی، مسیر پروژه شفاف است؛ برای فضای شما مدل مناسب پیشنهاد
                            می‌شود و اجرا با جزئیات تمیز تحویل داده می‌شود.
                        </p>
                    </div>

                    {highlights.map((item, index) => (
                        <div className="exp-narrative__step exp-narrative__item" key={item}>
                            <em>{String(index + 1).padStart(2, '0')}</em>
                            <p>{item}</p>
                        </div>
                    ))}

                    {panel ? (
                        <div className="exp-narrative__step exp-narrative__panel">
                            <strong>{panel.title}</strong>
                            <span>{panel.subtitle}</span>
                            <ElasticButton className="exp-btn exp-btn--primary exp-btn--compact" href="/products">
                                مشاهده محصولات
                                <ArrowLeft size={16} />
                            </ElasticButton>
                        </div>
                    ) : null}

                    <div className="exp-narrative__step">
                        <ElasticButton className="exp-btn exp-btn--ghost" href="/process" glow={false}>
                            مشاهده روند اجرا
                            <ArrowLeft size={17} />
                        </ElasticButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
