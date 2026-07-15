import { ContactCTA } from "../components/ContactCTA.jsx";
import { FAQ } from "../components/FAQ.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import faqHero from "../assets/hero-faq-football.jpg";
import { PageHero } from "./PageHero.jsx";
import { supportItems } from "../content/faq.js";

export function FAQPage() {
    return (
        <>
            <PageHero
                image={faqHero}
                eyebrow="صفحه سوالات"
                title="پاسخ سوالات رایج قبل از خرید و نصب"
                description="پاسخ پرتکرارترین سوال‌ها درباره مدل، قیمت و نگهداری تا تصمیم‌گیری برای شما ساده‌تر شود."
                primaryLabel="پرسیدن سوال"
                secondaryLabel="دیدن محصولات"
                secondaryHref="/products"
                seam="ridge"
            />
            <FAQ />
            <section className="section page-section">
                <div className="container page-grid page-grid--three">
                    {supportItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <ScrollReveal className="demo-card" delay={index * 90} key={item.title}>
                                <Icon size={28} />
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>
            <ContactCTA />
        </>
    );
}
