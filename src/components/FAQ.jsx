import { ChevronDown } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber, toPersianOrdinal } from '../utils/persianNumber.js';
import { ScrollReveal } from './ScrollReveal.jsx';

export function FAQ() {
    const { faq } = useSiteContent();
    const items = faq?.items || [];

    return (
        <section id="faq" className="section section--warm faq-showcase faq-showcase--premium">
            <div className="container faq-layout faq-layout--premium">
                <ScrollReveal className="faq-showcase__intro" variant="scale">
                    <span className="eyebrow">سوالات متداول</span>
                    <h2>قبل از انتخاب چمن مصنوعی بهتر است این‌ها را بدانید</h2>
                    <p>
                        پاسخ‌های کوتاه برای تصمیم‌گیری سریع‌تر؛ جزئیات دقیق‌تر بعد از بازدید و بررسی شرایط فضا مشخص
                        می‌شود.
                    </p>
                    <div className="faq-showcase__stats">
                        <div>
                            <strong>{items.length ? toPersianNumber(items.length) : '—'}</strong>
                            <span>سوال پرتکرار</span>
                        </div>
                        <div>
                            <strong>{toPersianNumber(24)}</strong>
                            <span>ساعت پاسخ‌گویی</span>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="faq-list faq-list--premium">
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <ScrollReveal
                                delay={Math.min(index, 8) * 70}
                                key={item.id ?? item.question}
                                variant={index % 2 === 0 ? 'up' : 'left'}
                            >
                                <details className="faq-item faq-item--premium">
                                    <summary>
                                        <span className="faq-item__index" aria-hidden="true">
                                            {toPersianOrdinal(index)}
                                        </span>
                                        <span className="faq-item__question">{item.question}</span>
                                        <ChevronDown size={20} aria-hidden="true" />
                                    </summary>
                                    <p>{item.answer}</p>
                                </details>
                            </ScrollReveal>
                        ))
                    ) : (
                        <ScrollReveal className="empty-state">
                            <strong>هنوز سوالی ثبت نشده است.</strong>
                            <p>با ثبت FAQ در وردپرس، این بخش به‌صورت خودکار به‌روز می‌شود.</p>
                        </ScrollReveal>
                    )}
                </div>
            </div>
        </section>
    );
}
