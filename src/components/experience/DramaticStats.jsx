import { useInView } from '../../hooks/useInView.js';

export function DramaticStats({ stats = [] }) {
    const { ref, visible } = useInView();

    return (
        <section className={`exp-stats ${visible ? 'exp-stats--visible' : ''}`.trim()} ref={ref}>
            <div className="exp-stats__horizon" aria-hidden="true" />
            <div className="exp-stats__constellation">
                {stats.map((stat) => (
                    <article className="exp-stat" key={stat.id}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </article>
                ))}
            </div>
        </section>
    );
}
