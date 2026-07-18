import { useMemo, useState, useTransition } from 'react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProductProjectCard } from '../components/ProductProjectCard.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import decorativeHero from '../assets/hero-artificial-grass.jpg';
import sportsHero from '../assets/services/sports-field.jpg';
import { productCategoryConfig } from '../content/productCategories.js';
import { productSubcategories } from '../content/productSubcategories.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { getProductDetailPath } from '../utils/routing.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

const categoryHeroImages = {
    sports: sportsHero,
    decorative: decorativeHero,
};

export function ProductCategoryPage({ categorySlug }) {
    const { products } = useSiteContent();
    const category = productCategoryConfig[categorySlug];
    const items = products?.byCategory?.[categorySlug] || [];
    const [activeFilter, setActiveFilter] = useState('all');
    const [isPending, startTransition] = useTransition();

    const availableSubcategories = useMemo(() => {
        const used = new Set(items.map((item) => item.subcategory).filter(Boolean));
        return (productSubcategories[categorySlug] || []).filter((item) => used.has(item.slug));
    }, [categorySlug, items]);

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return items;
        return items.filter((item) => item.subcategory === activeFilter);
    }, [activeFilter, items]);

    if (!category) {
        return null;
    }

    function onFilter(id) {
        startTransition(() => setActiveFilter(id));
    }

    return (
        <div className={`product-category-page product-category-page--${categorySlug}`}>
            <PageHero
                image={categoryHeroImages[categorySlug]}
                eyebrow={category.eyebrow}
                title={category.title}
                description={
                    items.length > 0
                        ? `${toPersianNumber(items.length)} نمونه اجرا در دستهٔ ${category.title}؛ جزئیات پروژه و متای هر مورد از محتوای ثبت‌شده خوانده می‌شود.`
                        : category.description
                }
                primaryLabel="استعلام قیمت"
                secondaryLabel="بازگشت به محصولات"
                secondaryHref="/products"
                seam="wave"
            />

            <section className="section page-section product-category-page__gallery">
                <div className="container">
                    <ScrollReveal className="product-category-page__intro" variant="scale">
                        <span className="eyebrow">گالری اجرا</span>
                        <h2>نمونه‌های واقعی {category.title}</h2>
                        <p>
                            مجموعه‌ای از پروژه‌های اجرا‌شده در این دسته؛ برای مشاوره و استعلام قیمت با ما در تماس
                            باشید.
                        </p>
                        <div className="product-category-page__stats">
                            <div>
                                <strong>{items.length ? toPersianNumber(items.length) : '—'}</strong>
                                <span>کل نمونه</span>
                            </div>
                            <div>
                                <strong>
                                    {filtered.length ? toPersianNumber(filtered.length) : '—'}
                                </strong>
                                <span>نمایش فعلی</span>
                            </div>
                            <div>
                                <strong>
                                    {availableSubcategories.length
                                        ? toPersianNumber(availableSubcategories.length)
                                        : '—'}
                                </strong>
                                <span>زیردسته فعال</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {availableSubcategories.length > 0 ? (
                        <ScrollReveal className="project-filters product-category-page__filters" delay={50}>
                            <div role="tablist" aria-label={`فیلتر ${category.title}`} className="project-filters__row">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeFilter === 'all'}
                                    className={`project-filter${activeFilter === 'all' ? ' is-active' : ''}`}
                                    onClick={() => onFilter('all')}
                                >
                                    همه
                                </button>
                                {availableSubcategories.map((item) => (
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeFilter === item.slug}
                                        className={`project-filter project-filter--child${activeFilter === item.slug ? ' is-active' : ''}`}
                                        key={item.slug}
                                        onClick={() => onFilter(item.slug)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </ScrollReveal>
                    ) : null}

                    {filtered.length > 0 ? (
                        <div
                            className={`product-category-grid product-category-grid--full${isPending ? ' is-pending' : ''}`}
                            key={activeFilter}
                        >
                            {filtered.map((project, index) => (
                                <ProductProjectCard
                                    delay={Math.min(index, 8) * 70}
                                    index={index}
                                    key={project.id ?? `${project.title}-${index}`}
                                    project={project}
                                    revealVariant={index === 0 ? 'scale' : index % 3 === 0 ? 'left' : 'up'}
                                    variant={index === 0 ? 'featured' : 'default'}
                                    href={project.slug ? getProductDetailPath(project) : undefined}
                                    enableCart
                                />
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal className="empty-state">
                            <strong>
                                {items.length === 0
                                    ? 'به‌زودی نمونه پروژه‌های این دسته اضافه می‌شود.'
                                    : 'در این فیلتر نمونه‌ای یافت نشد.'}
                            </strong>
                            <p>
                                {items.length === 0
                                    ? `برای دیدن نمونه‌کارها یا دریافت مشاوره درباره «${category.title}» با ما تماس بگیرید.`
                                    : 'فیلتر دیگری را انتخاب کنید یا همه نمونه‌ها را ببینید.'}
                            </p>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}

export function ProductSportsPage() {
    return <ProductCategoryPage categorySlug="sports" />;
}

export function ProductDecorativePage() {
    return <ProductCategoryPage categorySlug="decorative" />;
}
