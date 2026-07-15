import { ArrowLeft } from 'lucide-react';
import { toPersianNumber } from '../utils/persianNumber.js';
import { ScrollReveal } from './ScrollReveal.jsx';

/**
 * @param {object} props
 * @param {object} props.project
 * @param {number} [props.delay]
 * @param {string} [props.className]
 * @param {number} [props.index]
 * @param {'default'|'featured'|'compact'} [props.variant]
 * @param {'up'|'scale'|'left'|'right'} [props.revealVariant]
 * @param {string} [props.href]
 */
export function ProductProjectCard({
    project,
    delay = 0,
    className = '',
    index,
    variant = 'default',
    revealVariant = 'up',
    href,
}) {
    const indexLabel =
        typeof index === 'number' ? toPersianNumber(String(index + 1).padStart(2, '0')) : null;

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
                {project.meta ? <small>{project.meta}</small> : null}
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
        </ScrollReveal>
    );
}
