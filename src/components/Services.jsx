import { services } from "../content/services.js";
import { ScrollReveal } from "./ScrollReveal.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Services() {
    return (
        <section id="services" className="section section--warm">
            <div className="container">
                <SectionHeader
                    eyebrow="خدمات"
                    title="برای هر فضا، چمن مناسب همان فضا"
                    description="انتخاب چمن فقط به ظاهر آن محدود نیست؛ تراکم، ارتفاع، زیرسازی و نوع استفاده تعیین می‌کند پروژه چقدر تمیز و بادوام بماند."
                />

                <div className="service-grid">
                    {services.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <ScrollReveal className="service-card" delay={index * 90} key={service.title}>
                                <div className="service-card__media">
                                    <img src={service.image} alt={service.imageAlt} loading="lazy" decoding="async" />
                                    <div className="service-card__icon">
                                        <Icon size={25} />
                                    </div>
                                </div>
                                <div className="service-card__body">
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
