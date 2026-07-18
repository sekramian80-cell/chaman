import { useMemo, useState, useTransition } from 'react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProductProjectCard } from '../components/ProductProjectCard.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import decorativeHero from '../assets/hero-artificial-grass.jpg';
import sportsHero from '../assets/services/sports-field.jpg';
import productsHero from '../assets/hero-products-football.jpg';
import { productCategoryConfig } from '../content/productCategories.js';
import { findCategoryNode } from '../models/categoryTree.js';
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
    const tree = products?.tree || [];
    const node = findCategoryNode(tree, categorySlug);
    const config = productCategoryConfig[categorySlug];

    const items = products?.byCategory?.[categorySlug] || [];
    const [activeFilter, setActiveFilter] = useState('all');
    const [isPending, startTransition] = useTransition();

    // زیردسته‌ها: از درختِ داینامیک (فرزندانِ این دسته که محصول دارند)
    const subcategories = useMemo(() => node?.children || [], [node]);

    const filtered = useMemo(() => {
        if (activeFilter === 'all') return items;
        return items.filter(
            (item) =>
                item.subcategory === activeFilter || item.categories?.includes(activeFilter),
        );
    }, [activeFilter, items]);

    // عنوان/توضیح: کپیِ خوشگلِ هاردکد برای دسته‌های شناخته‌شده، وگرنه از ووکامرس
    const title = config?.title || node?.title || categorySlug;
    const eyebrow = config?.eyebrow || 'دستهٔ محصولات';
    const description =
        config?.description ||
        `محصولات دستهٔ «${title}»؛ برای مشاوره و استعلام قیمت با ما در تماس باشید.`;
    const heroImage = categoryHeroImages[categorySlug] || node?.image || productsHero;

    function onFilter(id) {
        startTransition(() => setActiveFilter(id));
    }

    return (
        <div className={`product-category-page product-category-page--${categorySlug}`}>
            <PageHero
                image={heroImage}
                eyebrow={eyebrow}
                title={title}
                description={
                    items.length > 0
                        ? `${toPersianNumber(items.length)} محصول در دستهٔ ${title}؛ جزئیات هر مورد از پیشخوان ووکامرس خوانده می‌شود.`
                        : description
                }
                primaryLabel="استعلام قیمت"
                secondaryLabel="بازگشت به محصولات"
                secondaryHref="/products"
                seam="wave"
            />

            <section className="section page-section product-category-page__gallery">
                <div className="container">
                    <ScrollReveal className="product-category-page__intro" variant="scale">
                        <span className="eyebrow">محصولات این دسته</span>
                        <h2>{title}</h2>
                        <p>{description}</p>
                        <div className="product-category-page__stats">
                            <div>
                                <strong>{items.length ? toPersianNumber(items.length) : '—'}</strong>
                                <span>کل محصول</span>
                            </div>
                            <div>
                                <strong>
                                    {filtered.length ? toPersianNumber(filtered.length) : '—'}
                                </strong>
                                <span>نمایش فعلی</span>
                            </div>
                            <div>
                                <strong>
                                    {subcategories.length
                                        ? toPersianNumber(subcategories.length)
                                        : '—'}
                                </strong>
                                <span>زیردسته فعال</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {subcategories.length > 0 ? (
                        <ScrollReveal className="project-filters product-category-page__filters" delay={50}>
                            <div role="tablist" aria-label={`فیلتر ${title}`} className="project-filters__row">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeFilter === 'all'}
                                    className={`project-filter${activeFilter === 'all' ? ' is-active' : ''}`}
                                    onClick={() => onFilter('all')}
                                >
                                    همه
                                </button>
                                {subcategories.map((item) => (
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeFilter === item.slug}
                                        className={`project-filter project-filter--child${activeFilter === item.slug ? ' is-active' : ''}`}
                                        key={item.slug}
                                        onClick={() => onFilter(item.slug)}
                                    >
                                        {item.title}
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
                                    ? 'به‌زودی محصولات این دسته اضافه می‌شود.'
                                    : 'در این فیلتر محصولی یافت نشد.'}
                            </strong>
                            <p>
                                {items.length === 0
                                    ? `برای دیدن محصولات یا دریافت مشاوره دربارهٔ «${title}» با ما تماس بگیرید.`
                                    : 'فیلتر دیگری را انتخاب کنید یا همه را ببینید.'}
                            </p>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}
