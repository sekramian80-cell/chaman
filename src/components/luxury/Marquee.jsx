export function Marquee({ items = [], className = '', speed = 42 }) {
    const doubled = [...items, ...items];

    return (
        <div className={`lux-marquee ${className}`.trim()} style={{ '--marquee-duration': `${speed}s` }}>
            <div className="lux-marquee__track">
                {doubled.map((item, index) => (
                    <span className="lux-marquee__item" key={`${item}-${index}`}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
