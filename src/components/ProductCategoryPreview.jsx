import { ArrowLeft } from 'lucide-react';
import { toPersianNumber } from '../utils/persianNumber.js';
import { ProductProjectCard } from './ProductProjectCard.jsx';
import { ScrollReveal } from './ScrollReveal.jsx';

export function ProductCategoryPreview({ category, items = [] }) {
    const previewItems = items.slice(0, category.previewLimit || 4);
    const countLabel = items.length ? toPersianNumber(items.length) : '—';

    return (
        <section
            className={`section product-category-section product-category-section--premium product-category-section--${category.slug}`}
            id={`products-${category.slug}`}
        >
            <div className="container">
                <ScrollReveal className="product-category-section__header" variant="scale">
                    <div className="product-category-section__eyebrow-row">
                        <span className="eyebrow">{category.eyebrow}</span>
                        <span className="product-category-section__count">
                            <strong>{countLabel}</strong>
                            <span>نمونه در این دسته</span>
                        </span>
                    </div>
                    <h2>{category.title}</h2>
                    <p>{category.description}</p>
                </ScrollReveal>

                {previewItems.length > 0 ? (
                    <div className="product-category-grid product-category-grid--preview">
                        {previewItems.map((project, index) => (
                            <ProductProjectCard
                                delay={Math.min(index, 5) * 80}
                                index={index}
                                key={project.id ?? project.title}
                                project={project}
                                revealVariant={index === 0 ? 'scale' : 'up'}
                                variant={index === 0 ? 'featured' : 'default'}
                                href={category.path}
                            />
                        ))}
                    </div>
                ) : (
                    <ScrollReveal className="empty-state">
                        <strong>به‌زودی نمونه پروژه‌های این دسته اضافه می‌شود.</strong>
                        <p>با ثبت محصول در وردپرس، این بخش به‌صورت خودکار به‌روز می‌شود.</p>
                    </ScrollReveal>
                )}

                <ScrollReveal
                    className="product-category-section__footer"
                    delay={previewItems.length * 70}
                    variant="up"
                >
                    <a className="btn btn--ghost product-category-section__more" href={category.path}>
                        مشاهده همهٔ {category.title}
                        <ArrowLeft size={18} />
                    </a>
                </ScrollReveal>
            </div>
        </section>
    );
}
