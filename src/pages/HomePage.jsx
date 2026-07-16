import { ArrowLeft } from 'lucide-react';
import villaImage from '../assets/services/villa-yard.jpg';
import beforeImage from '../assets/services/residential-balcony.jpg';
import afterImage from '../assets/hero-artificial-grass.jpg';
import { CinematicHero } from '../components/luxury/CinematicHero.jsx';
import { BeforeAfter } from '../components/luxury/BeforeAfter.jsx';
import { FloatingCTA } from '../components/luxury/FloatingCTA.jsx';
import { GlassCard } from '../components/luxury/GlassCard.jsx';
import { MagneticButton } from '../components/luxury/MagneticButton.jsx';
import { Marquee } from '../components/luxury/Marquee.jsx';
import { ParallaxImage } from '../components/luxury/ParallaxImage.jsx';
import { Reveal } from '../components/luxury/Reveal.jsx';
import { AnimatedHeading } from '../components/luxury/AnimatedHeading.jsx';
import { BentoGrid, HorizontalShowcase, Section } from '../components/luxury/Section.jsx';
import { StatCounter } from '../components/luxury/StatCounter.jsx';
import { heroContent, heroStats } from '../content/hero.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianOrdinal } from '../utils/persianNumber.js';
import '../styles/luxury.css';

const homeHighlights = [
    'انتخاب مدل بر اساس متراژ، نور و میزان رفت‌وآمد',
    'اجرای تمیز برای تراس، ویلا، روف گاردن و فضای تجاری',
    'تحویل سریع همراه با آموزش نگهداری و شستشو',
];

const marqueeItems = [
    'چمن ورزشی استاندارد',
    'روف گاردن لوکس',
    'ویلا و محوطه',
    'تراس و بالکن',
    'نصب سریع',
    'زهکشی حرفه‌ای',
    'الیاف UV-stable',
    'ظاهر طبیعی',
];

export function HomePage() {
    const { projects, trust } = useSiteContent();
    const projectItems = (projects?.items || []).slice(0, 8);
    const trustList = trust?.items || [];

    return (
        <div className="lux-home">
            <CinematicHero />

            <Marquee items={marqueeItems} />

            <Section className="lux-trust" tone="mist">
                <div className="lux-trust__grid">
                    {trustList.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Reveal key={item.id ?? item.label} delay={index * 0.08} variant="scale">
                                <GlassCard className="lux-trust__card">
                                    {Icon ? <Icon size={22} /> : null}
                                    <span>{item.label}</span>
                                </GlassCard>
                            </Reveal>
                        );
                    })}
                </div>
            </Section>

            <Section className="lux-story" tone="dark">
                <div className="lux-story__grid">
                    <div className="lux-story__copy">
                        <Reveal>
                            <span className="lux-kicker">چرا فراز چمن</span>
                            <AnimatedHeading as="h2" className="lux-story__title" text="فضای بیرونی، مثل یک صحنه سینمایی" />
                            <p>
                                از انتخاب مدل تا نصب نهایی، مسیر پروژه شفاف است؛ برای فضای شما مدل مناسب پیشنهاد
                                می‌شود و اجرا با جزئیات تمیز تحویل داده می‌شود.
                            </p>
                            <MagneticButton className="lux-btn lux-btn--ghost" href="/process">
                                مشاهده روند اجرا
                                <ArrowLeft size={17} />
                            </MagneticButton>
                        </Reveal>
                    </div>

                    <Reveal variant="clip" className="lux-story__visual">
                        <ParallaxImage src={villaImage} alt="حیاط ویلایی با چمن مصنوعی" strength={28} />
                    </Reveal>
                </div>

                <BentoGrid className="lux-story__bento">
                    {homeHighlights.map((item, index) => (
                        <Reveal key={item} delay={index * 0.1} variant="up">
                            <GlassCard className="lux-bento-card">
                                <span className="lux-bento-card__index">{toPersianOrdinal(index)}</span>
                                <strong>{item}</strong>
                            </GlassCard>
                        </Reveal>
                    ))}
                    <Reveal delay={0.28} variant="scale">
                        <GlassCard className="lux-bento-card lux-bento-card--accent">
                            <strong>{heroContent.panel.title}</strong>
                            <span>{heroContent.panel.subtitle}</span>
                            <MagneticButton className="lux-btn lux-btn--primary lux-btn--compact" href="/products">
                                مشاهده محصولات
                                <ArrowLeft size={16} />
                            </MagneticButton>
                        </GlassCard>
                    </Reveal>
                </BentoGrid>
            </Section>

            <Section className="lux-stats" tone="deep" container={false}>
                <div className="container lux-stats__inner">
                    <Reveal>
                        <span className="lux-kicker">اعداد واقعی</span>
                        <h2>نتیجه‌ای که قابل اندازه‌گیری است</h2>
                    </Reveal>
                    <div className="lux-stats__row">
                        {heroStats.map((stat, index) => (
                            <Reveal key={stat.id} delay={index * 0.1} variant="scale">
                                <StatCounter value={stat.value} label={stat.label} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Section>

            <Section className="lux-showcase" tone="dark" container={false}>
                <div className="container">
                    <Reveal>
                        <span className="lux-kicker">گالری حرکت</span>
                        <h2>پروژه‌هایی که فضا را دوباره تعریف می‌کنند</h2>
                    </Reveal>
                </div>
                <HorizontalShowcase items={projectItems} />
                <div className="container lux-showcase__cta">
                    <MagneticButton className="lux-btn lux-btn--primary" href="/projects">
                        همه نمونه‌کارها
                        <ArrowLeft size={17} />
                    </MagneticButton>
                </div>
            </Section>

            <Section className="lux-transform" tone="mist">
                <div className="lux-transform__grid">
                    <Reveal>
                        <span className="lux-kicker">تحول فضا</span>
                        <h2>قبل و بعد را لمس کنید</h2>
                        <p>اسلایدر را بکشید و تفاوت سطح خام با اجرای نهایی چمن مصنوعی را ببینید.</p>
                    </Reveal>
                    <Reveal variant="clip">
                        <BeforeAfter beforeSrc={beforeImage} afterSrc={afterImage} beforeLabel="قبل" afterLabel="بعد" />
                    </Reveal>
                </div>
            </Section>

            <Section className="lux-finale" tone="deep">
                <Reveal variant="scale" className="lux-finale__panel">
                    <span className="lux-kicker">شروع پروژه</span>
                    <h2>فضای شما آماده یک سطح سبز ماندگار است؟</h2>
                    <p>متراژ و چند عکس بفرستید تا پیشنهاد مدل و بازه قیمت دقیق‌تری دریافت کنید.</p>
                    <div className="lux-finale__actions">
                        <MagneticButton className="lux-btn lux-btn--primary" href="tel:+989123365430">
                            تماس مستقیم
                            <ArrowLeft size={17} />
                        </MagneticButton>
                        <MagneticButton className="lux-btn lux-btn--ghost" href="https://wa.me/989123365430">
                            پیام در واتساپ
                        </MagneticButton>
                    </div>
                </Reveal>
            </Section>

            <FloatingCTA />
        </div>
    );
}
