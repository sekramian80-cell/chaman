import { ArrowLeft, Quote } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { productSubcategories } from '../content/productSubcategories.js';
import { testimonial } from '../content/testimonial.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { getProjectDetailPath } from '../utils/routing.js';
import { ScrollReveal } from './ScrollReveal.jsx';

function projectHref(project) {
    return project.href || getProjectDetailPath(project);
}

const mainFilters = [
    { id: 'all', label: 'همه' },
    { id: 'sports', label: 'ورزشی' },
    { id: 'decorative', label: 'تزیینی' },
];

function tileClass(index) {
    if (index === 0) return 'project-tile project-tile--hero';
    if (index === 1 || index === 2) return 'project-tile project-tile--tall';
    if (index % 7 === 5) return 'project-tile project-tile--wide';
    return 'project-tile';
}

export function ProjectGallery() {
    const { projects } = useSiteContent();
    const items = projects?.items || [];
    const [activeFilter, setActiveFilter] = useState('all');
    const [, startTransition] = useTransition();

    const availableSubcategories = useMemo(() => {
        const used = new Set(items.map((item) => item.subcategory).filter(Boolean));
        return [...productSubcategories.sports, ...productSubcategories.decorative].filter((item) =>
            used.has(item.slug),
        );
    }, [items]);

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return items;
        if (activeFilter === 'sports' || activeFilter === 'decorative') {
            return items.filter((item) => item.primaryCategory === activeFilter);
        }
        return items.filter((item) => item.subcategory === activeFilter);
    }, [activeFilter, items]);

    const sportsCount = items.filter((item) => item.primaryCategory === 'sports').length;
    const decorativeCount = items.filter((item) => item.primaryCategory === 'decorative').length;

    function onFilter(id) {
        startTransition(() => setActiveFilter(id));
    }

    return (
        <section id="projects" className="section projects-showcase">
            <div className="container">
                <ScrollReveal className="projects-showcase__intro">
                    <span className="eyebrow">گالری اجرا</span>
                    <h2>هر فضا، یک داستان سبز</h2>
                    <p>
                        این مجموعه مستقیماً از نمونه کارهای ثبت‌شده خوانده می‌شود؛ از زمین ورزشی تا ویلا و روف
                        گاردن.
                    </p>
                    <div className="projects-showcase__stats">
                        <div>
                            <strong>{items.length || '—'}</strong>
                            <span>نمونه کار</span>
                        </div>
                        <div>
                            <strong>{sportsCount || '—'}</strong>
                            <span>پروژه ورزشی</span>
                        </div>
                        <div>
                            <strong>{decorativeCount || '—'}</strong>
                            <span>پروژه تزیینی</span>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="project-filters" role="tablist" aria-label="فیلتر نمونه کارها">
                    {mainFilters.map((tab) => (
                        <button
                            type="button"
                            className={`project-filter${activeFilter === tab.id ? ' is-active' : ''}`}
                            key={tab.id}
                            onClick={() => onFilter(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    {availableSubcategories.map((item) => (
                        <button
                            type="button"
                            className={`project-filter project-filter--child${activeFilter === item.slug ? ' is-active' : ''}`}
                            key={item.slug}
                            onClick={() => onFilter(item.slug)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {filtered.length > 0 ? (
                    <div className="project-bento">
                        {filtered.map((project, index) => (
                            <ScrollReveal
                                className={tileClass(index)}
                                delay={Math.min(index, 10) * 55}
                                key={project.id ?? `${project.title}-${index}`}
                            >
                                <a className="project-tile__link" href={projectHref(project)}>
                                    <article className="project-tile__inner">
                                        <div className="project-tile__media">
                                            <img
                                                src={project.image}
                                                alt={project.imageAlt || project.title}
                                                loading={index < 3 ? 'eager' : 'lazy'}
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="project-tile__overlay">
                                            <div className="project-tile__labels">
                                                {project.subcategoryLabel ? (
                                                    <span>{project.subcategoryLabel}</span>
                                                ) : null}
                                                {project.primaryCategory === 'sports' ? (
                                                    <span className="project-tile__chip">ورزشی</span>
                                                ) : project.primaryCategory === 'decorative' ? (
                                                    <span className="project-tile__chip">تزیینی</span>
                                                ) : null}
                                            </div>
                                            <h3>{project.title}</h3>
                                            {project.meta ? <small>{project.meta}</small> : null}
                                            {project.description ? <p>{project.description}</p> : null}
                                            <span className="project-tile__cta">
                                                مشاهده جزئیات
                                                <ArrowLeft size={15} />
                                            </span>
                                        </div>
                                    </article>
                                </a>
                            </ScrollReveal>
                        ))}
                    </div>
                ) : (
                    <ScrollReveal className="empty-state">
                        <strong>هنوز نمونه‌کاری در این دسته ثبت نشده است.</strong>
                        <p>با ثبت نمونه کار در وردپرس، این بخش به‌صورت خودکار به‌روز می‌شود.</p>
                    </ScrollReveal>
                )}

                <ScrollReveal className="testimonial projects-showcase__testimonial">
                    <Quote size={34} />
                    <p>{testimonial.quote}</p>
                    <div>
                        <strong>{testimonial.author}</strong>
                        <a href={testimonial.ctaHref}>
                            {testimonial.cta}
                            <ArrowLeft size={17} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
