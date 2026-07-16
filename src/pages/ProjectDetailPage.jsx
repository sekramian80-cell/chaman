import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Layers, MapPin, Ruler, Sparkles } from 'lucide-react';
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
                <ScrollReveal className="empty-state" variant="scale">
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
    const [imageVisible, setImageVisible] = useState(true);

    useEffect(() => {
        setActiveIndex(0);
    }, [project?.slug]);

    useEffect(() => {
        setImageVisible(false);
        const id = requestAnimationFrame(() => setImageVisible(true));
        return () => cancelAnimationFrame(id);
    }, [activeIndex]);

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

    useEffect(() => {
        if (gallery.length < 2) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                setActiveIndex((current) => (current + 1) % gallery.length);
            }
            if (event.key === 'ArrowRight') {
                setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [gallery.length]);

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

    function goPrev() {
        setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length);
    }

    function goNext() {
        setActiveIndex((current) => (current + 1) % gallery.length);
    }

    return (
        <div className="project-detail-page">
            <section
                className="project-detail-hero project-detail-hero--premium"
                style={{ '--project-hero-image': `url(${project.image})` }}
            >
                <div className="project-detail-hero__veil" />
                <div className="project-detail-hero__orbit" aria-hidden="true" />
                <div className="container project-detail-hero__inner">
                    <ScrollReveal className="project-detail-hero__copy" variant="scale">
                        <div className="project-detail-hero__tags">
                            {typeLabel ? <span>{typeLabel}</span> : null}
                            {project.subcategoryLabel ? <span>{project.subcategoryLabel}</span> : null}
                        </div>
                        <p className="project-detail-hero__brand">فراز چمن</p>
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

            <section className="section project-detail project-detail--premium">
                <div className="container project-detail__layout">
                    <div className="project-detail__main">
                        <ScrollReveal className="project-detail__gallery" variant="scale">
                            <div className={`project-detail__stage${imageVisible ? ' is-ready' : ''}`}>
                                <img
                                    src={activeImage.url}
                                    alt={activeImage.alt || project.title}
                                    key={activeImage.url}
                                />
                                {gallery.length > 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            className="project-detail__nav project-detail__nav--prev"
                                            aria-label="تصویر قبلی"
                                            onClick={goPrev}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            className="project-detail__nav project-detail__nav--next"
                                            aria-label="تصویر بعدی"
                                            onClick={goNext}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                    </>
                                ) : null}
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

                        <ScrollReveal className="project-detail__story" delay={90} variant="up">
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

                        <ScrollReveal className="project-detail__highlights" delay={140}>
                            <h3>آنچه در این اجرا رعایت شد</h3>
                            <ul>
                                {highlights.map((item, index) => (
                                    <li key={item} style={{ transitionDelay: `${index * 70}ms` }}>
                                        <CheckCircle2 size={18} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>

                    <aside className="project-detail__side">
                        <ScrollReveal className="project-detail__panel" delay={80} variant="left">
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
                <section className="section project-detail-related project-detail-related--premium">
                    <div className="container">
                        <ScrollReveal className="project-detail-related__head" variant="scale">
                            <span className="eyebrow">پروژه‌های مرتبط</span>
                            <h2>نمونه‌های مشابه این فضا</h2>
                        </ScrollReveal>
                        <div className="project-detail-related__grid">
                            {related.map((item, index) => (
                                <ScrollReveal
                                    className="project-detail-related__card"
                                    delay={index * 90}
                                    variant="up"
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
        </div>
    );
}
