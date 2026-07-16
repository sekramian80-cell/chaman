export function PulseRibbon({ items = [] }) {
    const doubled = [...items, ...items];

    return (
        <div className="exp-pulse" aria-hidden="true">
            <div className="exp-pulse__track">
                {doubled.map((item, index) => (
                    <span key={`${item}-${index}`} className="exp-pulse__item">
                        <i />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
