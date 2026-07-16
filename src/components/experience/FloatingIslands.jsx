import { TiltSurface } from './TiltSurface.jsx';

const offsets = ['a', 'b', 'c', 'd', 'e', 'f'];

export function FloatingIslands({ items = [] }) {
    return (
        <section className="exp-islands">
            <div className="exp-islands__header container">
                <span className="exp-kicker">۰۳ — اعتماد</span>
                <h2>نشانه‌هایی که قبل از تماس حس می‌شوند</h2>
            </div>
            <div className="exp-islands__field">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const offset = offsets[index % offsets.length];
                    return (
                        <TiltSurface
                            key={item.id ?? item.label}
                            className={`exp-island exp-island--${offset}`}
                            intensity={10}
                        >
                            {Icon ? <Icon size={24} /> : <span className="exp-island__dot" />}
                            <span>{item.label}</span>
                        </TiltSurface>
                    );
                })}
            </div>
        </section>
    );
}
