export function ElasticButton({
    children,
    href,
    className = '',
    glow = true,
    ...props
}) {
    return (
        <a
            className={`exp-elastic ${glow ? 'exp-elastic--glow' : ''} ${className}`.trim()}
            href={href}
            {...props}
        >
            <span className="exp-elastic__inner">{children}</span>
            {glow ? <span className="exp-elastic__glow" aria-hidden="true" /> : null}
        </a>
    );
}
