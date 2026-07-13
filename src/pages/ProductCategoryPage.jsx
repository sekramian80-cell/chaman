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
            />

            <section className="section page-section">
                <div className="container">
                    <ScrollReveal className="product-category-page__intro">
                        <span className="eyebrow">نمونه پروژه‌ها</span>
                        <h2>گالری اجراهای {category.title}</h2>
                        <p>این بخش نمونه پروژه‌های این دسته را نشان می‌دهد. محتوای واقعی از وردپرس خوانده می‌شود.</p>
                    </ScrollReveal>

                    {items.length > 0 ? (
                        <div className="product-category-grid product-category-grid--full">
                            {items.map((project, index) => (
                                <ProductProjectCard delay={index * 70} key={project.id ?? project.title} project={project} />
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal className="empty-state">
                            <strong>هنوز پروژه‌ای برای این دسته ثبت نشده است.</strong>
                            <p>در وردپرس یک محصول جدید بسازید و دسته «{category.title}» را برایش انتخاب کنید.</p>
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
