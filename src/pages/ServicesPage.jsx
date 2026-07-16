import { CheckCircle2 } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { Services } from '../components/Services.jsx';
import servicesHero from '../assets/hero-services-football.jpg';
import { pageHeros } from '../content/contact.js';
import { servicePlans, serviceChecklist } from '../content/services.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber, toPersianOrdinal } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

export function ServicesPage() {
    const { services } = useSiteContent();
    const count = services?.items?.length || 0;
    const hero = pageHeros.services;

    const description =
        count > 0
            ? `${toPersianNumber(count)} خدمت تخصصی از مشاوره و انتخاب مدل تا زیرسازی، نصب و نگهداری برای فضاهای مسکونی، تجاری و ورزشی.`
            : hero.description;

    return (
        <div className="services-page">
            <PageHero
                image={servicesHero}
                eyebrow={hero.eyebrow}
                title={hero.title}
                description={description}
                primaryLabel={hero.primaryLabel}
                secondaryLabel={hero.secondaryLabel}
                secondaryHref="/projects"
                seam="wave"
            />

            <Services />

            <section className="section page-section service-plans service-plans--premium">
                <div className="container">
                    <ScrollReveal className="service-plans__intro" variant="scale">
                        <span className="eyebrow">پکیج‌های پیشنهادی</span>
                        <h2>سه مسیر شفاف برای شروع پروژه</h2>
                        <p>بسته به نوع فضا و زمان تحویل، یکی از این پکیج‌ها نقطه شروع خوبی برای استعلام است.</p>
                    </ScrollReveal>

                    <div className="page-grid page-grid--three service-plans__grid">
                        {servicePlans.map((plan, index) => {
                            const Icon = plan.icon;

                            return (
                                <ScrollReveal
                                    className="service-plan-card service-plan-card--premium"
                                    delay={index * 100}
                                    key={plan.title}
                                    variant={index === 1 ? 'scale' : 'up'}
                                >
                                    <article className="service-plan-card__inner">
                                        <div className="service-plan-card__media">
                                            <img
                                                src={plan.image}
                                                alt={plan.imageAlt}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            <span className="service-plan-card__shine" aria-hidden="true" />
                                            <span className="service-plan-card__index">
                                                {toPersianOrdinal(index)}
                                            </span>
                                            <span className="service-plan-card__icon">
                                                <Icon size={24} />
                                            </span>
                                        </div>
                                        <div className="service-plan-card__body">
                                            <h3>{plan.title}</h3>
                                            <p>{plan.text}</p>
                                        </div>
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section section--dark compact-band service-checklist service-checklist--premium">
                <div className="container">
                    <ScrollReveal className="service-checklist__intro" variant="right">
                        <span className="eyebrow">مسیر همکاری</span>
                        <h2>از بازدید تا تحویل نهایی</h2>
                    </ScrollReveal>
                    <div className="checklist-band checklist-band--premium">
                        {serviceChecklist.map((item, index) => (
                            <ScrollReveal
                                className="check-pill check-pill--premium"
                                delay={index * 90}
                                key={item}
                                variant="up"
                            >
                                <span className="check-pill__step">{toPersianOrdinal(index)}</span>
                                <CheckCircle2 size={20} />
                                <span>{item}</span>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}
