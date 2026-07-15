import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Layers, MapPin, Ruler, Sparkles } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { SectionSeam } from '../components/SectionSeam.jsx';
import { findProjectBySlug } from '../models/ProjectModel.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianOrdinal } from '../utils/persianNumber.js';
import { getProjectDetailPath, getProjectSlugFromPath } from '../utils/routing.js';

function categoryLabel(primaryCategory) {
    if (primaryCategory === 'sports') return 'ورزشی';
    if (primaryCategory === 'decorative') return 'تزیینی';
    return '';
}

function ProjectNotFound() {
    return (
        <section className="section project-detail project-detail--empty">
            <div className="container">
                <ScrollReveal className="empty-state">
                    <strong>این نمونه کار پیدا نشد.</strong>
                    <p>ممکن است لینک اشتباه باشد یا پروژه حذف شده باشد.</p>
                    <a className="btn btn--primary" href="/projects">
                        بازگشت به نمونه کارها
                        <ArrowLeft size={18} />
                    </a>
                </ScrollReveal>
            </div>
        </section>
    );
}

export function ProjectDetailPage({ slug: slugProp = '' }) {
    const { projects } = useSiteContent();
    const items = projects?.items || [];
    const slug = slugProp || getProjectSlugFromPath(window.location.pathname);
    const project = findProjectBySlug(items, slug);

    const gallery = useMemo(() => {
        if (!project) return [];
        const list = project.gallery?.length
            ? project.gallery
            : [{ url: project.image, alt: project.imageAlt || project.title }];
        return list;
    }, [project]);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [project?.slug]);

    const related = useMemo(() => {
        if (!project) return [];
        return items
            .filter((item) => item.slug !== project.slug)
            .filter(
                (item) =>
                    item.primaryCategory === project.primaryCategory ||
                    item.subcategory === project.subcategory,
            )
            .slice(0, 3);
    }, [items, project]);

    if (!project) {
        return <ProjectNotFound />;
    }

    const activeImage = gallery[Math.min(activeIndex, gallery.length - 1)] || gallery[0];
    const storyHtml = project.contentHtml?.trim();
    const storyText = project.contentText || project.description;
    const typeLabel = categoryLabel(project.primaryCategory);

    const facts = [
        project.location
            ? { icon: MapPin, label: 'موقعیت', value: project.location }
            : null,
        project.meta ? { icon: Ruler, label: 'مشخصات', value: project.meta } : null,
        typeLabel ? { icon: Layers, label: 'دسته', value: typeLabel } : null,
        project.subcategoryLabel
            ? { icon: Sparkles, label: 'کاربری', value: project.subcategoryLabel }
            : null,
    ].filter(Boolean);

    const highlights = [
        'زیرسازی و زهکشی متناسب با نوع فضا',
        'انتخاب مدل چمن بر اساس نور و میزان تردد',
        'اجرای دقیق لبه‌کاری و جزئیات پایانی',
        'نتیجه نهایی قابل بازدید و قابل استعلام',
    ];

    return (
        <>
            <section
                className="project-detail-hero"
                style={{ '--project-hero-image': `url(${project.image})` }}
            >
                <div className="project-detail-hero__veil" />
                <div className="container project-detail-hero__inner">
                    <ScrollReveal className="project-detail-hero__copy">
                        <div className="project-detail-hero__tags">
                            {typeLabel ? <span>{typeLabel}</span> : null}
                            {project.subcategoryLabel ? <span>{project.subcategoryLabel}</span> : null}
                        </div>
                        <h1>{project.title}</h1>
                        {project.description ? <p>{project.description}</p> : null}
                        <div className="project-detail-hero__actions">
                            <a className="btn btn--primary" href="tel:+989123365430">
                                مشاوره درباره این پروژه
                                <ArrowLeft size={18} />
                            </a>
                            <a className="btn btn--ghost" href="/projects">
                                همه نمونه کارها
                            </a>
                        </div>
                    </ScrollReveal>
                </div>
                <SectionSeam variant="slash" tone="paper" className="project-detail-hero__seam" />
            </section>

            <section className="section project-detail">
                <div className="container project-detail__layout">
                    <div className="project-detail__main">
                        <ScrollReveal className="project-detail__gallery">
                            <div className="project-detail__stage">
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.alt || project.title}
                                    key={activeImage.url}
                                />
                            </div>
                            {gallery.length > 1 ? (
                                <div className="project-detail__thumbs" role="list">
                                    {gallery.map((item, index) => (
                                        <button
                                            type="button"
                                            className={`project-detail__thumb${index === activeIndex ? ' is-active' : ''}`}
                                            key={`${item.url}-${index}`}
                                            onClick={() => setActiveIndex(index)}
                                            aria-label={`تصویر ${toPersianOrdinal(index)}`}
                                        >
                                            <img src={item.url} alt="" loading="lazy" decoding="async" />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </ScrollReveal>

                        <ScrollReveal className="project-detail__story" delay={80}>
                            <span className="eyebrow">معرفی پروژه</span>
                            <h2>داستان اجرا و جزئیات کار</h2>
                            {storyHtml ? (
                                <div
                                    className="project-detail__richtext"
                                    dangerouslySetInnerHTML={{ __html: storyHtml }}
                                />
                            ) : (
                                <p>{storyText}</p>
                            )}
                        </ScrollReveal>

                        <ScrollReveal className="project-detail__highlights" delay={120}>
                            <h3>آنچه در این اجرا رعایت شد</h3>
                            <ul>
                                {highlights.map((item) => (
                                    <li key={item}>
                                        <CheckCircle2 size={18} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>

                    <aside className="project-detail__side">
                        <ScrollReveal className="project-detail__panel" delay={60}>
                            <h3>شناسنامه پروژه</h3>
                            <dl>
                                {facts.map((fact) => {
                                    const Icon = fact.icon;
                                    return (
                                        <div key={fact.label}>
                                            <dt>
                                                <Icon size={16} />
                                                {fact.label}
                                            </dt>
                                            <dd>{fact.value}</dd>
                                        </div>
                                    );
                                })}
                            </dl>
                            <a className="btn btn--primary project-detail__panel-cta" href="/contact">
                                درخواست پروژه مشابه
                                <ArrowLeft size={17} />
                            </a>
                        </ScrollReveal>
                    </aside>
                </div>
            </section>

            {related.length > 0 ? (
                <section className="section project-detail-related">
                    <div className="container">
                        <ScrollReveal className="project-detail-related__head">
                            <span className="eyebrow">پروژه‌های مرتبط</span>
                            <h2>نمونه‌های مشابه این فضا</h2>
                        </ScrollReveal>
                        <div className="project-detail-related__grid">
                            {related.map((item, index) => (
                                <ScrollReveal
                                    className="project-detail-related__card"
                                    delay={index * 70}
                                    key={item.slug || item.id}
                                >
                                    <a href={item.href || getProjectDetailPath(item)}>
                                        <img
                                            src={item.image}
                                            alt={item.imageAlt || item.title}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div>
                                            {item.subcategoryLabel ? <span>{item.subcategoryLabel}</span> : null}
                                            <strong>{item.title}</strong>
                                            {item.meta ? <small>{item.meta}</small> : null}
                                            <em>
                                                مشاهده جزئیات
                                                <ArrowLeft size={15} />
                                            </em>
                                        </div>
                                    </a>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <ContactCTA />
        </>
    );
}
