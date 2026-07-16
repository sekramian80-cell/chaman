import villaImage from '../assets/services/villa-yard.jpg';
import beforeImage from '../assets/services/residential-balcony.jpg';
import afterImage from '../assets/hero-artificial-grass.jpg';
import { ExperienceShell } from '../components/experience/ExperienceShell.jsx';
import { ExperienceHero } from '../components/experience/ExperienceHero.jsx';
import { PulseRibbon } from '../components/experience/PulseRibbon.jsx';
import { LiquidMorph } from '../components/experience/LiquidMorph.jsx';
import { FloatingIslands } from '../components/experience/FloatingIslands.jsx';
import { PinnedNarrative } from '../components/experience/PinnedNarrative.jsx';
import { DramaticStats } from '../components/experience/DramaticStats.jsx';
import { ImageStack } from '../components/experience/ImageStack.jsx';
import { OrbitCTA } from '../components/experience/OrbitCTA.jsx';
import { ElasticButton } from '../components/experience/ElasticButton.jsx';
import { BeforeAfter } from '../components/luxury/BeforeAfter.jsx';
import { LineReveal } from '../components/experience/TextChoreography.jsx';
import { heroContent, heroStats } from '../content/hero.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { ArrowLeft } from 'lucide-react';
import '../styles/experience.css';

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
    const { projects, trust } = useSiteContent();
    const projectItems = (projects?.items || []).slice(0, 8);
    const trustList = trust?.items || [];

    return (
        <ExperienceShell>
            <div className="exp-home">
                <ExperienceHero />

                <PulseRibbon items={pulseItems} />
                <LiquidMorph />

                <FloatingIslands items={trustList} />

                <PinnedNarrative
                    image={villaImage}
                    imageAlt="حیاط ویلایی با چمن مصنوعی"
                    highlights={homeHighlights}
                    panel={heroContent.panel}
                />

                <DramaticStats stats={heroStats} />

                <section className="exp-gallery">
                    <div className="container exp-gallery__head">
                        <span className="exp-kicker">۰۵ — گالری</span>
                        <h2>پروژه‌هایی که فضا را دوباره می‌نویسند</h2>
                        <p>هر کارت یک لحظه — با اسکرول، تصاویر روی هم می‌نشینند.</p>
                    </div>
                    <ImageStack items={projectItems} />
                    <div className="container exp-gallery__cta">
                        <ElasticButton className="exp-btn exp-btn--primary" href="/projects">
                            همه نمونه‌کارها
                            <ArrowLeft size={17} />
                        </ElasticButton>
                    </div>
                </section>

                <section className="exp-transform">
                    <div className="container exp-transform__grid">
                        <LineReveal>
                            <span className="exp-kicker">۰۶ — تحول</span>
                            <h2>قبل و بعد را لمس کنید</h2>
                            <p>اسلایدر را بکشید — تفاوت سطح خام با اجرای نهایی را ببینید.</p>
                        </LineReveal>
                        <div className="exp-transform__compare">
                            <BeforeAfter
                                beforeSrc={beforeImage}
                                afterSrc={afterImage}
                                beforeLabel="قبل"
                                afterLabel="بعد"
                                className="exp-compare"
                            />
                        </div>
                    </div>
                </section>

                <section className="exp-finale">
                    <div className="exp-finale__aurora" aria-hidden="true" />
                    <LineReveal className="exp-finale__panel container">
                        <span className="exp-kicker">۰۷ — شروع</span>
                        <h2>فضای شما آماده یک سطح سبز ماندگار است؟</h2>
                        <p>متراژ و چند عکس بفرستید تا پیشنهاد مدل و بازه قیمت دقیق‌تری دریافت کنید.</p>
                        <div className="exp-finale__actions">
                            <ElasticButton className="exp-btn exp-btn--primary" href="tel:+989123365430">
                                تماس مستقیم
                                <ArrowLeft size={17} />
                            </ElasticButton>
                            <ElasticButton className="exp-btn exp-btn--ghost" href="https://wa.me/989123365430" glow={false}>
                                پیام در واتساپ
                            </ElasticButton>
                        </div>
                    </LineReveal>
                </section>

                <OrbitCTA />
            </div>
        </ExperienceShell>
    );
}
