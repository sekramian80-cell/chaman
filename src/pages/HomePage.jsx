import { ContactCTA } from '../components/ContactCTA.jsx';
import { Hero } from '../components/Hero.jsx';
import { PulseRibbon } from '../components/experience/PulseRibbon.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { SubcategorySlider } from '../components/SubcategorySlider.jsx';
import { TrustStrip } from '../components/TrustStrip.jsx';
import { heroContent } from '../content/hero.js';
import { toPersianOrdinal } from '../utils/persianNumber.js';

const homeHighlights = [
    'انتخاب مدل بر اساس متراژ، نور و میزان رفت‌وآمد',
    'اجرای تمیز برای تراس، ویلا، روف گاردن و فضای تجاری',
    'تحویل سریع همراه با آموزش نگهداری و شستشو',
];

const pulseItems = [
    'چمن ورزشی استاندارد',
    'روف گاردن لوکس',
    'ویلا و محوطه',
    'تراس و بالکن',
    'نصب سریع',
    'زهکشی حرفه‌ای',
    'الیاف UV-stable',
    'ظاهر طبیعی',
    'معماری فضای سبز',
];

export function HomePage() {
    return (
        <div className="home-page">
            <Hero />
            <PulseRibbon items={pulseItems} />
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

            <ContactCTA />
        </div>
    );
}
