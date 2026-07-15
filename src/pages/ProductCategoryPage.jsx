import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProductProjectCard } from '../components/ProductProjectCard.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import decorativeHero from '../assets/hero-artificial-grass.jpg';
import sportsHero from '../assets/services/sports-field.jpg';
import { productCategoryConfig } from '../content/productCategories.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { PageHero } from './PageHero.jsx';

const categoryHeroImages = {
    sports: sportsHero,
    decorative: decorativeHero,
};

export function ProductCategoryPage({ categorySlug }) {
    const { products } = useSiteContent();
    const category = productCategoryConfig[categorySlug];
    const items = products?.byCategory?.[categorySlug] || [];

    if (!category) {
        return null;
    }

    return (
        <>
            <PageHero
                image={categoryHeroImages[categorySlug]}
                eyebrow={category.eyebrow}
                title={category.title}
                description={category.description}
                primaryLabel="استعلام قیمت"
                secondaryLabel="بازگشت به محصولات"
                secondaryHref="/products"
                seam="wave"
            />

            <section className="section page-section">
                <div className="container">
                    <ScrollReveal className="product-category-page__intro">
                        <span className="eyebrow">نمونه پروژه‌ها</span>
                        <h2>گالری اجراهای {category.title}</h2>
                        <p>مجموعه‌ای از پروژه‌های اجرا شده در این دسته؛ برای مشاوره و استعلام قیمت با ما در تماس باشید.</p>
                    </ScrollReveal>

                    {items.length > 0 ? (
                        <div className="product-category-grid product-category-grid--full">
                            {items.map((project, index) => (
                                <ProductProjectCard delay={index * 70} key={project.id ?? project.title} project={project} />
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal className="empty-state">
                            <strong>به‌زودی نمونه پروژه‌های این دسته اضافه می‌شود.</strong>
                            <p>برای دیدن نمونه‌کارها یا دریافت مشاوره درباره «{category.title}» با ما تماس بگیرید.</p>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            <ContactCTA />
        </>
    );
}

export function ProductSportsPage() {
    return <ProductCategoryPage categorySlug="sports" />;
}

export function ProductDecorativePage() {
    return <ProductCategoryPage categorySlug="decorative" />;
}
