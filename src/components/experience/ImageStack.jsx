import { useInView } from '../../hooks/useInView.js';

export function ImageStack({ items = [] }) {
    const stack = items.slice(0, 4);
    const { ref, visible } = useInView();

    if (!stack.length) return null;

    return (
        <div className={`exp-stack exp-stack--grid ${visible ? 'exp-stack--visible' : ''}`.trim()} ref={ref}>
            <div className="container exp-stack__grid">
                {stack.map((item) => (
                    <article className="exp-stack__card exp-stack__card--static" key={item.id ?? item.title}>
                        <img src={item.image} alt={item.imageAlt || item.title} loading="lazy" decoding="async" />
                        <div className="exp-stack__caption">
                            <span>{item.subcategoryLabel || item.meta}</span>
                            <h3>{item.title}</h3>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
