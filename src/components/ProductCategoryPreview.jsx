import { ArrowLeft } from 'lucide-react';
import { ProductProjectCard } from './ProductProjectCard.jsx';
import { ScrollReveal } from './ScrollReveal.jsx';

export function ProductCategoryPreview({ category, items = [] }) {
    const previewItems = items.slice(0, category.previewLimit || 4);

    return (
        <section className="section product-category-section" id={`products-${category.slug}`}>
            <div className="container">
                <ScrollReveal className="product-category-section__header">
                    <span className="eyebrow">{category.eyebrow}</span>
                    <h2>{category.title}</h2>
                    <p>{category.description}</p>
                </ScrollReveal>

                <div className="product-category-grid">
                    {previewItems.map((project, index) => (
                        <ProductProjectCard delay={index * 80} key={project.id ?? project.title} project={project} />
                    ))}
                </div>

                <ScrollReveal className="product-category-section__footer" delay={previewItems.length * 80}>
                    <a className="btn btn--ghost product-category-section__more" href={category.path}>
                        مشاهده بیشتر
                        <ArrowLeft size={18} />
                    </a>
                </ScrollReveal>
            </div>
        </section>
    );
}
