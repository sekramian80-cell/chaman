import { ContactCTA } from '../components/ContactCTA.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { Process } from '../components/Process.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import processHero from '../assets/hero-process-football.jpg';
import { pageHeros } from '../content/contact.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber, toPersianOrdinal } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

export function ProcessPage() {
    const { process } = useSiteContent();
    const timeline = process?.timeline || [];
    const stepsCount = process?.steps?.length || 0;
    const hero = pageHeros.process;

    const description =
        stepsCount > 0
            ? `${toPersianNumber(stepsCount)} مرحله شفاف از اولین تماس تا تحویل نهایی؛ تا پروژه را با خیال راحت پیش ببرید.`
            : hero.description;

    return (
        <div className="process-page">
            <PageHero
                image={processHero}
                eyebrow={hero.eyebrow}
                title={hero.title}
                description={description}
                primaryLabel={hero.primaryLabel}
                secondaryLabel={hero.secondaryLabel}
                secondaryHref="/projects"
                seam="ridge"
            />

            <Process />

            <section className="section page-section process-timeline process-timeline--premium">
                <div className="container">
                    <ScrollReveal className="process-timeline__intro" variant="scale">
                        <span className="eyebrow">جزئیات مسیر</span>
                        <h2>هر تماس، یک قدم مشخص به جلو</h2>
                        <p>از گفت‌وگوی اولیه تا پشتیبانی بعد از تحویل، همه چیز مرحله‌به‌مرحله ثبت و پیگیری می‌شود.</p>
                    </ScrollReveal>

                    <div className="timeline-list timeline-list--premium">
                        {timeline.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <ScrollReveal
                                    className="timeline-item timeline-item--premium"
                                    delay={index * 100}
                                    key={item.title}
                                    variant={index % 2 === 0 ? 'right' : 'left'}
                                >
                                    <article className="timeline-item__inner">
                                        <span className="timeline-item__index">{toPersianOrdinal(index)}</span>
                                        <span className="timeline-item__icon">
                                            <Icon size={24} />
                                        </span>
                                        <div className="timeline-item__body">
                                            <h3>{item.title}</h3>
                                            <p>{item.text}</p>
                                        </div>
                                        <span className="timeline-item__shine" aria-hidden="true" />
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            <FAQ />
            <ContactCTA />
        </div>
    );
}
