import { ScrollReveal } from './ScrollReveal.jsx';

export function ProductProjectCard({ project, delay = 0, className = '' }) {
    return (
        <ScrollReveal className={`product-project-card ${className}`.trim()} delay={delay}>
            <div className="product-project-card__media">
                <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" decoding="async" />
            </div>
            <div className="product-project-card__body">
                <h3>{project.title}</h3>
                {project.meta ? <small>{project.meta}</small> : null}
                {project.text ? <p>{project.text}</p> : null}
            </div>
        </ScrollReveal>
    );
}
