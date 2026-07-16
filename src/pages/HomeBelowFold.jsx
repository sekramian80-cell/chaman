import villaImage from '../assets/services/villa-yard.jpg';
import beforeImage from '../assets/services/residential-balcony.jpg';
import afterImage from '../assets/hero-artificial-grass.jpg';
import { TerrainBridge } from '../components/experience/TerrainBridge.jsx';
import { PinnedNarrative } from '../components/experience/PinnedNarrative.jsx';
import { DramaticStats } from '../components/experience/DramaticStats.jsx';
import { ImageStack } from '../components/experience/ImageStack.jsx';
import { MorphReveal } from '../components/experience/MorphReveal.jsx';
import { FinaleDissolve } from '../components/experience/FinaleDissolve.jsx';
import { ElasticButton } from '../components/experience/ElasticButton.jsx';
import { heroContent, heroStats } from '../content/hero.js';
import { ArrowLeft } from 'lucide-react';

const homeHighlights = [
    'انتخاب مدل بر اساس متراژ، نور و میزان رفت‌وآمد',
    'اجرای تمیز برای تراس، ویلا، روف گاردن و فضای تجاری',
    'تحویل سریع همراه با آموزش نگهداری و شستشو',
];

export function HomeBelowFold({ projectItems = [] }) {
    return (
        <>
            <TerrainBridge variant="canyon" />
            <PinnedNarrative
                image={villaImage}
                imageAlt="حیاط ویلایی با چمن مصنوعی"
                highlights={homeHighlights}
                panel={heroContent.panel}
            />

            <TerrainBridge variant="mist" invert />
            <DramaticStats stats={heroStats} />

            <div className="exp-gallery">
                <div className="exp-gallery__whisper container">
                    <p>هر پروژه، یک لایه از معماری بیرونی</p>
                </div>
                <ImageStack items={projectItems} />
                <div className="container exp-gallery__cta">
                    <ElasticButton className="exp-btn exp-btn--primary" href="/projects">
                        همه نمونه‌کارها
                        <ArrowLeft size={17} />
                    </ElasticButton>
                </div>
            </div>

            <TerrainBridge variant="ridge" invert />
            <MorphReveal
                beforeSrc={beforeImage}
                afterSrc={afterImage}
                beforeLabel="قبل"
                afterLabel="بعد"
            />

            <TerrainBridge variant="dune" />
            <FinaleDissolve />
        </>
    );
}
