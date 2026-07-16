import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { TextChoreography, LineReveal } from './TextChoreography.jsx';
import { ElasticButton } from './ElasticButton.jsx';
import { MaskReveal } from './MaskReveal.jsx';
import { ArrowLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function PinnedNarrative({ image, imageAlt, highlights = [], panel }) {
    const rootRef = useRef(null);
    const copyRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current || !copyRef.current) return undefined;

        const mm = window.matchMedia('(max-width: 900px)');
        if (mm.matches) return undefined;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: rootRef.current,
                start: 'top top+=72',
                end: () => `+=${copyRef.current.offsetHeight - window.innerHeight * 0.3}`,
                pin: '.exp-narrative__visual',
                pinSpacing: true,
            });
        }, rootRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <section className="exp-narrative" ref={rootRef}>
            <div className="container exp-narrative__grid">
                <div className="exp-narrative__visual">
                    <MaskReveal src={image} alt={imageAlt} />
                </div>
                <div className="exp-narrative__copy" ref={copyRef}>
                    <LineReveal>
                        <span className="exp-kicker">۰۲ — چرا فراز چمن</span>
                    </LineReveal>
                    <TextChoreography
                        as="h2"
                        className="exp-narrative__title"
                        text="فضای بیرونی، مثل یک صحنه سینمایی"
                        mode="words"
                        stagger={0.06}
                    />
                    <LineReveal delay={0.15}>
                        <p className="exp-narrative__text">
                            از انتخاب مدل تا نصب نهایی، مسیر پروژه شفاف است؛ برای فضای شما مدل مناسب پیشنهاد
                            می‌شود و اجرا با جزئیات تمیز تحویل داده می‌شود.
                        </p>
                    </LineReveal>

                    <div className="exp-narrative__list">
                        {highlights.map((item, index) => (
                            <LineReveal key={item} delay={0.1 + index * 0.08}>
                                <div className="exp-narrative__item">
                                    <span>{String(index + 1).padStart(2, '0')}</span>
                                    <p>{item}</p>
                                </div>
                            </LineReveal>
                        ))}
                    </div>

                    {panel ? (
                        <LineReveal delay={0.35}>
                            <div className="exp-narrative__panel">
                                <strong>{panel.title}</strong>
                                <span>{panel.subtitle}</span>
                                <ElasticButton className="exp-btn exp-btn--primary exp-btn--compact" href="/products">
                                    مشاهده محصولات
                                    <ArrowLeft size={16} />
                                </ElasticButton>
                            </div>
                        </LineReveal>
                    ) : null}

                    <ElasticButton className="exp-btn exp-btn--ghost" href="/process" glow={false}>
                        مشاهده روند اجرا
                        <ArrowLeft size={17} />
                    </ElasticButton>
                </div>
            </div>
        </section>
    );
}
