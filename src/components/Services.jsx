import { ArrowLeft } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber, toPersianOrdinal } from '../utils/persianNumber.js';
import { ScrollReveal } from './ScrollReveal.jsx';

function cardClass(index) {
    if (index === 0) return 'service-card service-card--featured';
    if (index === 1 || index === 2) return 'service-card service-card--tall';
    return 'service-card';
}

export function Services() {
    const { services } = useSiteContent();
    const items = services?.items || [];
    const tagSet = new Set(items.map((item) => item.tag).filter(Boolean));

    return (
        <section id="services" className="section section--warm services-showcase services-showcase--premium">
            <div className="container">
                <ScrollReveal className="services-showcase__intro" variant="scale">
                    <span className="eyebrow">خدمات</span>
                    <h2>برای هر فضا، چمن مناسب همان فضا</h2>
                    <p>
                        از ویلا و تراس تا روف گاردن، زمین ورزشی و اجرای سریع؛ هر فضا راه‌حل مخصوص خودش را دارد.
                    </p>
                    <div className="services-showcase__stats">
                        <div>
                            <strong>{items.length ? toPersianNumber(items.length) : '—'}</strong>
                            <span>نوع خدمت</span>
                        </div>
                        <div>
                            <strong>{tagSet.size ? toPersianNumber(tagSet.size) : '—'}</strong>
                            <span>دسته کاربرد</span>
                        </div>
                        <div>
                            <strong>{toPersianNumber(3)}</strong>
                            <span>پکیج پیشنهادی</span>
                        </div>
                    </div>
                </ScrollReveal>

                {items.length > 0 ? (
                    <div className="service-grid service-grid--premium">
                        {items.map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <ScrollReveal
                                    className={cardClass(index)}
                                    delay={Math.min(index, 6) * 80}
                                    key={service.id ?? service.title}
                                    variant={index === 0 ? 'scale' : index % 2 === 0 ? 'left' : 'up'}
                                >
                                    <article className="service-card__inner">
                                        <div className="service-card__media">
                                            <span className="service-card__index">{toPersianOrdinal(index)}</span>
                                            {service.tag ? (
                                                <span className="service-card__tag">{service.tag}</span>
                                            ) : null}
                                            <img
                                                src={service.image}
                                                alt={service.imageAlt || service.title}
                                                loading={index < 2 ? 'eager' : 'lazy'}
                                                decoding="async"
                                            />
                                            <span className="service-card__shine" aria-hidden="true" />
                                            <div className="service-card__icon">
                                                <Icon size={24} />
                                            </div>
                                        </div>
                                        <div className="service-card__body">
                                            <h3>{service.title}</h3>
                                            <p>{service.description}</p>
                                            {service.highlight ? (
                                                <div className="service-card__footer">
                                                    <span>{service.highlight}</span>
                                                </div>
                                            ) : null}
                                            <a className="service-card__cta" href="/contact">
                                                درخواست این خدمت
                                                <ArrowLeft size={15} />
                                            </a>
                                        </div>
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                ) : (
                    <ScrollReveal className="empty-state">
                        <strong>هنوز خدمتی ثبت نشده است.</strong>
                        <p>با ثبت خدمات در وردپرس، این بخش به‌صورت خودکار به‌روز می‌شود.</p>
                    </ScrollReveal>
                )}
            </div>
        </section>
    );
}
