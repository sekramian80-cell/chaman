import { ContactCTA } from '../components/ContactCTA.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import faqHero from '../assets/hero-faq-football.jpg';
import { pageHeros } from '../content/contact.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

export function FAQPage() {
    const { faq } = useSiteContent();
    const items = faq?.items || [];
    const support = faq?.support || [];
    const hero = pageHeros.faq;

    const description =
        items.length > 0
            ? `${toPersianNumber(items.length)} پاسخ پرتکرار درباره مدل، قیمت و نگهداری تا تصمیم‌گیری ساده‌تر شود.`
            : hero.description;

    return (
        <div className="faq-page">
            <PageHero
                image={faqHero}
                eyebrow={hero.eyebrow}
                title={hero.title}
                description={description}
                primaryLabel={hero.primaryLabel}
                secondaryLabel={hero.secondaryLabel}
                secondaryHref="/products"
                seam="ridge"
            />

            <FAQ />

            <section className="section page-section faq-support faq-support--premium">
                <div className="container">
                    <ScrollReveal className="faq-support__intro" variant="scale">
                        <span className="eyebrow">پشتیبانی تصمیم</span>
                        <h2>اگر هنوز مردد هستید</h2>
                        <p>از راهنمای انتخاب تا تماس سریع؛ مسیر کوتاهی تا پیشنهاد مناسب فضای شما.</p>
                    </ScrollReveal>

                    <div className="page-grid page-grid--three faq-support__grid">
                        {support.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <ScrollReveal
                                    className="faq-support-card"
                                    delay={index * 100}
                                    key={item.title}
                                    variant={index === 1 ? 'scale' : 'up'}
                                >
                                    <article className="faq-support-card__inner">
                                        <span className="faq-support-card__icon" aria-hidden="true">
                                            <Icon size={24} />
                                        </span>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                        <span className="faq-support-card__shine" aria-hidden="true" />
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}
