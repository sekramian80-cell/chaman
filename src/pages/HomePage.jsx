import { lazy, Suspense } from 'react';
import { ExperienceShell } from '../components/experience/ExperienceShell.jsx';
import { ExperienceHero } from '../components/experience/ExperienceHero.jsx';
import { PulseRibbon } from '../components/experience/PulseRibbon.jsx';
import { TerrainBridge } from '../components/experience/TerrainBridge.jsx';
import { FloatingIslands } from '../components/experience/FloatingIslands.jsx';
import { OrbitCTA } from '../components/experience/OrbitCTA.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';
import '../styles/experience.css';

const HomeBelowFold = lazy(() =>
    import('./HomeBelowFold.jsx').then((module) => ({ default: module.HomeBelowFold })),
);

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
    const trustList = trust?.items || [];
    const projectItems = (projects?.items || []).slice(0, 8);

    return (
        <ExperienceShell>
            <div className="exp-home exp-continuum">
                <ExperienceHero />
                <TerrainBridge variant="ridge" />
                <PulseRibbon items={pulseItems} />
                <TerrainBridge variant="dune" invert />
                <FloatingIslands items={trustList} />

                <Suspense fallback={<div className="exp-deferred" aria-hidden="true" />}>
                    <HomeBelowFold projectItems={projectItems} />
                </Suspense>

                <OrbitCTA />
            </div>
        </ExperienceShell>
    );
}
