import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { ScrollReveal } from './ScrollReveal.jsx';

export function Process() {
    const { process } = useSiteContent();
    const steps = process?.steps || [];

    return (
        <section id="process" className="section section--dark process-showcase process-showcase--premium">
            <div className="container">
                <ScrollReveal className="process-showcase__intro" variant="scale">
                    <span className="eyebrow">روند همکاری</span>
                    <h2>از ایده تا اجرای نهایی، مرحله‌ها شفاف است</h2>
                    <p>
                        پروژه با انتخاب درست شروع می‌شود و با نصب تمیز، برس‌کشی و آموزش نگهداری به پایان می‌رسد.
                    </p>
                    <div className="process-showcase__stats">
                        <div>
                            <strong>{steps.length ? toPersianNumber(steps.length) : '—'}</strong>
                            <span>مرحله اصلی</span>
                        </div>
                        <div>
                            <strong>{toPersianNumber(1)}</strong>
                            <span>مسیر شفاف</span>
                        </div>
                        <div>
                            <strong>{toPersianNumber(100)}٪</strong>
                            <span>هماهنگی قبل از نصب</span>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="process-line process-line--premium">
                    {steps.map((item, index) => (
                        <ScrollReveal
                            className="process-step process-step--premium"
                            delay={index * 110}
                            key={item.step}
                            variant={index % 2 === 0 ? 'up' : 'scale'}
                        >
                            <article className="process-step__inner">
                                <span className="process-step__index">{item.step}</span>
                                <span className="process-step__rail" aria-hidden="true" />
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                                <span className="process-step__shine" aria-hidden="true" />
                            </article>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
