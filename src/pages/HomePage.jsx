import beforeImage from '../assets/services/residential-balcony.jpg';
import afterImage from '../assets/hero-artificial-grass.jpg';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { Hero } from '../components/Hero.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { SubcategorySlider } from '../components/SubcategorySlider.jsx';
import { TrustStrip } from '../components/TrustStrip.jsx';
import { BeforeAfter } from '../components/luxury/BeforeAfter.jsx';
import { heroContent } from '../content/hero.js';
import { toPersianOrdinal } from '../utils/persianNumber.js';

const homeHighlights = [
    'انتخاب مدل بر اساس متراژ، نور و میزان رفت‌وآمد',
    'اجرای تمیز برای تراس، ویلا، روف گاردن و فضای تجاری',
    'تحویل سریع همراه با آموزش نگهداری و شستشو',
];

export function HomePage() {
    return (
        <div className="home-page">
            <Hero />
            <TrustStrip />

            <section className="section home-value">
                <div className="container home-value__grid">
                    <ScrollReveal className="home-value__intro">
                        <span className="eyebrow">چرا فراز چمن</span>
                        <h2>کیفیت اجرا، زیبایی ماندگار و نتیجه قابل لمس</h2>
                        <p>
                            از انتخاب مدل تا نصب نهایی، مسیر پروژه شفاف است؛ برای فضای شما مدل مناسب پیشنهاد
                            می‌شود و اجرا با جزئیات تمیز تحویل داده می‌شود.
                        </p>
                        <a className="home-value__link" href="/process">
                            مشاهده روند اجرا
                        </a>
                    </ScrollReveal>

                    <div className="home-value__list" role="list">
                        {homeHighlights.map((item, index) => (
                            <ScrollReveal className="home-value__card" delay={index * 90} key={item}>
                                <span className="home-value__index" aria-hidden>
                                    {toPersianOrdinal(index)}
                                </span>
                                <strong>{item}</strong>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal className="home-value__aside" delay={120}>
                        <strong>{heroContent.panel.title}</strong>
                        <span>{heroContent.panel.subtitle}</span>
                        <a className="btn btn--ghost" href="/products">
                            مشاهده محصولات
                        </a>
                    </ScrollReveal>
                </div>
            </section>

            <SubcategorySlider />

            <section className="section home-transform">
                <div className="container home-transform__grid">
                    <ScrollReveal className="home-transform__copy">
                        <span className="eyebrow">تحول فضا</span>
                        <h2>قبل و بعد را لمس کنید</h2>
                        <p>
                            اسلایدر را بکشید و تفاوت سطح خام با اجرای نهایی چمن مصنوعی را ببینید.
                        </p>
                    </ScrollReveal>
                    <ScrollReveal className="home-transform__compare" delay={120}>
                        <BeforeAfter
                            beforeSrc={beforeImage}
                            afterSrc={afterImage}
                            beforeLabel="قبل"
                            afterLabel="بعد"
                        />
                    </ScrollReveal>
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}
