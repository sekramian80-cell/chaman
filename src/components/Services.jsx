import { useSiteContent } from '../hooks/useSiteContent.js';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export function Services() {
    const { services } = useSiteContent();
    const items = services.items;

    return (
        <section id="services" className="section section--warm">
            <div className="container">
                <SectionHeader
                    eyebrow="خدمات"
                    title="برای هر فضا، چمن مناسب همان فضا"
                    description="از ویلا و تراس تا روف گاردن، زمین ورزشی و اجرای سریع؛ هر فضا راه‌حل مخصوص خودش را دارد."
                />

                <div className="service-grid service-grid--rich">
                    {items.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <ScrollReveal className="service-card" delay={index * 80} key={service.id ?? service.title}>
                                <div className="service-card__media">
                                    <span className="service-card__index">{String(index + 1).padStart(2, '0')}</span>
                                    {service.tag ? <span className="service-card__tag">{service.tag}</span> : null}
                                    <img src={service.image} alt={service.imageAlt} loading="lazy" decoding="async" />
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
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
