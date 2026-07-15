import { ArrowLeft, Quote } from 'lucide-react';
import { useMemo, useState } from 'react';
import { productSubcategories } from '../content/productSubcategories.js';
import { testimonial } from '../content/testimonial.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

const filterTabs = [
    { id: 'all', label: 'همه' },
    { id: 'sports', label: 'ورزشی' },
    { id: 'decorative', label: 'تزیینی' },
];

export function ProjectGallery() {
    const { projects } = useSiteContent();
    const items = projects?.items || [];
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return items;
        if (activeFilter === 'sports' || activeFilter === 'decorative') {
            return items.filter((item) => item.primaryCategory === activeFilter);
        }
        return items.filter((item) => item.subcategory === activeFilter);
    }, [activeFilter, items]);

    return (
        <section id="projects" className="section projects">
            <div className="container">
                <SectionHeader
                    eyebrow="نمونه کارها"
                    title="پروژه‌هایی که کیفیت اجرا را نشان می‌دهند"
                    description="از زمین‌های ورزشی تا فضاهای تزیینی؛ هر پروژه با جزئیات نصب و نتیجه نهایی ثبت شده است."
                />

                <div className="project-filters" role="tablist" aria-label="فیلتر نمونه کارها">
                    {filterTabs.map((tab) => (
                        <button
                            type="button"
                            className={`project-filter${activeFilter === tab.id ? ' is-active' : ''}`}
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    {[...productSubcategories.sports, ...productSubcategories.decorative].map((item) => (
                        <button
                            type="button"
                            className={`project-filter project-filter--child${activeFilter === item.slug ? ' is-active' : ''}`}
                            key={item.slug}
                            onClick={() => setActiveFilter(item.slug)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {filtered.length > 0 ? (
                    <div className="project-media-grid">
                        {filtered.map((project, index) => (
                            <ScrollReveal
                                className="project-media-card"
                                delay={Math.min(index, 8) * 60}
                                key={project.id ?? project.title}
                            >
                                <div className="project-media-card__media">
                                    <img
                                        src={project.image}
                                        alt={project.imageAlt || project.title}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div className="project-media-card__body">
                                    {project.subcategoryLabel ? (
                                        <span className="project-media-card__tag">{project.subcategoryLabel}</span>
                                    ) : null}
                                    <h3>{project.title}</h3>
                                    {project.meta ? <small>{project.meta}</small> : null}
                                    {project.description ? <p>{project.description}</p> : null}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                ) : (
                    <ScrollReveal className="empty-state">
                        <strong>به‌زودی نمونه کارهای بیشتری اضافه می‌شود.</strong>
                        <p>برای دیدن پروژه‌های مشابه یا دریافت مشاوره با ما در تماس باشید.</p>
                    </ScrollReveal>
                )}

                <ScrollReveal className="testimonial">
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
