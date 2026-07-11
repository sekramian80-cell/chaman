import { CheckCircle2 } from "lucide-react";
import { ContactCTA } from "../components/ContactCTA.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import servicesHero from "../assets/hero-services-football.jpg";
import { Services } from "../components/Services.jsx";
import { PageHero } from "./PageHero.jsx";
import { servicePlans, serviceChecklist } from "../content/services.js";

export function ServicesPage() {
    return (
        <>
            <PageHero
                image={servicesHero}
                eyebrow="صفحه خدمات"
                title="خدمات چمن مصنوعی برای هر نوع فضا"
                description="در این بخش نمونه خدمات دمو را می‌بینید؛ از مشاوره و انتخاب مدل تا زیرسازی، نصب و نگهداری."
                primaryLabel="درخواست مشاوره"
                secondaryLabel="دیدن نمونه اجرا"
            />
            <Services />
            <section className="section page-section">
                <div className="container page-grid page-grid--three">
                    {servicePlans.map((plan, index) => {
                        const Icon = plan.icon;

                        return (
                            <ScrollReveal className="service-plan-card" delay={index * 90} key={plan.title}>
                                <div className="service-plan-card__media">
                                    <img src={plan.image} alt={plan.imageAlt} loading="lazy" decoding="async" />
                                    <span className="service-plan-card__icon">
                                        <Icon size={24} />
                                    </span>
                                </div>
                                <div className="service-plan-card__body">
                                    <h3>{plan.title}</h3>
                                    <p>{plan.text}</p>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>
            <section className="section section--dark compact-band">
                <div className="container checklist-band">
                    {serviceChecklist.map((item, index) => (
                        <ScrollReveal className="check-pill" delay={index * 70} key={item}>
                            <CheckCircle2 size={20} />
                            <span>{item}</span>
                        </ScrollReveal>
                    ))}
                </div>
            </section>
            <ContactCTA />
        </>
    );
}
