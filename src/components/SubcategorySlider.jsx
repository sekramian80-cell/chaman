import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { subcategorySliderItems } from '../content/subcategorySlider.js';

const AUTOPLAY_MS = 4200;

export function SubcategorySlider() {
    const items = subcategorySliderItems;
    const trackRef = useRef(null);
    const pausedRef = useRef(false);
    const [index, setIndex] = useState(0);
    const [step, setStep] = useState(0);
    const [animate, setAnimate] = useState(true);

    const cloneCount = Math.min(items.length, 8);
    const rendered = [...items, ...items.slice(0, cloneCount)];

    useEffect(() => {
        function measure() {
            const track = trackRef.current;
            if (!track || !track.children.length) return;
            const first = track.children[0];
            const styles = getComputedStyle(track);
            const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
            setStep(first.getBoundingClientRect().width + gap);
        }

        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            if (pausedRef.current) return;
            setIndex((current) => current + 1);
        }, AUTOPLAY_MS);

        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (animate) return;
        const raf = requestAnimationFrame(() => setAnimate(true));
        return () => cancelAnimationFrame(raf);
    }, [animate]);

    const handleTransitionEnd = useCallback(() => {
        if (index >= items.length) {
            setAnimate(false);
            setIndex(index - items.length);
        }
    }, [index, items.length]);

    const goNext = useCallback(() => setIndex((current) => current + 1), []);

    const goPrev = useCallback(() => {
        setIndex((current) => {
            if (current <= 0) {
                setAnimate(false);
                return items.length - 1;
            }
            return current - 1;
        });
    }, [items.length]);

    if (!items.length) return null;

    const offset = -(index * step);

    return (
        <section className="section subcategory-slider-section" aria-label="کاربردهای چمن مصنوعی">
            <div className="container">
                <div className="subcategory-slider-section__header">
                    <span className="eyebrow">کاربردهای مختلف</span>
                    <h2>چمن مصنوعی برای هر نوع فضا</h2>
                    <p>از زمین ورزشی تا تراس و ویلا — مدل و اجرای مناسب هر کاربرد را ببینید.</p>
                </div>
            </div>

            <div
                className="subcategory-slider"
                dir="ltr"
                onMouseEnter={() => {
                    pausedRef.current = true;
                }}
                onMouseLeave={() => {
                    pausedRef.current = false;
                }}
            >
                <button
                    type="button"
                    className="subcategory-slider__nav subcategory-slider__nav--prev"
                    aria-label="قبلی"
                    onClick={goPrev}
                >
                    <ChevronLeft size={22} />
                </button>
                <button
                    type="button"
                    className="subcategory-slider__nav subcategory-slider__nav--next"
                    aria-label="بعدی"
                    onClick={goNext}
                >
                    <ChevronRight size={22} />
                </button>

                <div
                    className="subcategory-slider__track"
                    ref={trackRef}
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                        transform: `translate3d(${offset}px, 0, 0)`,
                        transition: animate ? 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                    }}
                >
                    {rendered.map((item, position) => (
                        <a
                            className="subcategory-slider__card"
                            dir="rtl"
                            href={item.href}
                            key={`${item.slug}-${position}`}
                        >
                            <div className="subcategory-slider__media">
                                <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                            </div>
                            <div className="subcategory-slider__body">
                                <h3>{item.title}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
