import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';
import { ElasticButton } from './ElasticButton.jsx';
import { TextChoreography } from './TextChoreography.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizon dissolve — finale that blooms open, no boxed CTA panel
 */
export function FinaleDissolve() {
    const rootRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced || !rootRef.current) return undefined;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.exp-finale__bloom',
                { scale: 0.4, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top 85%',
                        end: 'top 35%',
                        scrub: 0.7,
                    },
                },
            );

            gsap.fromTo(
                '.exp-finale__content',
                { y: 80, opacity: 0.2 },
                {
                    y: 0,
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: rootRef.current,
                        start: 'top 75%',
                        end: 'top 40%',
                        scrub: true,
                    },
                },
            );
        }, rootRef);

        return () => ctx.revert();
    }, [reduced]);

    return (
        <section className="exp-finale" ref={rootRef}>
            <div className="exp-finale__bloom" aria-hidden="true" />
            <div className="exp-finale__content container">
                <TextChoreography
                    as="h2"
                    className="exp-finale__title"
                    text="فضای شما آماده یک سطح ماندگار است؟"
                    mode="words"
                    stagger={0.05}
                />
                <p>متراژ و چند عکس بفرستید — پیشنهاد مدل و بازه قیمت دقیق‌تری دریافت کنید.</p>
                <div className="exp-finale__actions">
                    <ElasticButton className="exp-btn exp-btn--primary" href="tel:+989123365430">
                        تماس مستقیم
                        <ArrowLeft size={17} />
                    </ElasticButton>
                    <ElasticButton className="exp-btn exp-btn--ghost" href="https://wa.me/989123365430" glow={false}>
                        پیام در واتساپ
                    </ElasticButton>
                </div>
            </div>
        </section>
    );
}
