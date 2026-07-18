import { useState } from 'react';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { toPersianNumber } from '../utils/persianNumber.js';
import { useCart } from '../hooks/useCart.js';
import { ScrollReveal } from './ScrollReveal.jsx';

function AddToCartButton({ product }) {
    const { add } = useCart();
    const [added, setAdded] = useState(false);

    function onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        add(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
    }

    return (
        <button type="button" className="product-project-card__add" onClick={onClick}>
            {added ? (
                <>
                    اضافه شد
                    <Check size={16} />
                </>
            ) : (
                <>
                    افزودن به سبد
                    <ShoppingCart size={16} />
                </>
            )}
        </button>
    );
}

/**
 * @param {object} props
 * @param {object} props.project
 * @param {number} [props.delay]
 * @param {string} [props.className]
 * @param {number} [props.index]
 * @param {'default'|'featured'|'compact'} [props.variant]
 * @param {'up'|'scale'|'left'|'right'} [props.revealVariant]
 * @param {string} [props.href]
 * @param {boolean} [props.enableCart] نمایش دکمهٔ افزودن به سبد
 */
export function ProductProjectCard({
    project,
    delay = 0,
    className = '',
    index,
    variant = 'default',
    revealVariant = 'up',
    href,
    enableCart = false,
}) {
    const indexLabel =
        typeof index === 'number' ? toPersianNumber(String(index + 1).padStart(2, '0')) : null;

    const showCart = enableCart && project?.priceAmount > 0;

    const body = (
        <article className="product-project-card__inner">
            <div className="product-project-card__media">
                <img
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    loading={variant === 'featured' || (typeof index === 'number' && index < 2) ? 'eager' : 'lazy'}
                    decoding="async"
                />
                <span className="product-project-card__shine" aria-hidden="true" />
                {indexLabel ? <span className="product-project-card__index">{indexLabel}</span> : null}
            </div>
            <div className="product-project-card__body">
                <div className="product-project-card__labels">
                    {project.subcategoryLabel ? <span>{project.subcategoryLabel}</span> : null}
                    {project.primaryCategory === 'sports' ? (
                        <span className="product-project-card__chip">ورزشی</span>
                    ) : project.primaryCategory === 'decorative' ? (
                        <span className="product-project-card__chip">تزیینی</span>
                    ) : null}
                </div>
                <h3>{project.title}</h3>
                {project.priceLabel ? (
                    <span className="product-project-card__price">{project.priceLabel}</span>
                ) : project.meta ? (
                    <small>{project.meta}</small>
                ) : null}
                {project.text ? <p>{project.text}</p> : null}
                {href ? (
                    <span className="product-project-card__cta">
                        جزئیات بیشتر
                        <ArrowLeft size={15} />
                    </span>
                ) : null}
            </div>
        </article>
    );

    return (
        <ScrollReveal
            className={`product-project-card product-project-card--${variant} ${className}`.trim()}
            delay={delay}
            variant={revealVariant}
        >
            {href ? (
                <a className="product-project-card__link" href={href}>
                    {body}
                </a>
            ) : (
                body
            )}
            {showCart ? (
                <div className="product-project-card__actions">
                    <AddToCartButton product={project} />
                </div>
            ) : null}
        </ScrollReveal>
    );
}
