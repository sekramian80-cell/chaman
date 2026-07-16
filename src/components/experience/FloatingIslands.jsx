import { useInView } from '../../hooks/useInView.js';
import { useLiteExperience } from '../../hooks/useLiteExperience.js';
import { TiltSurface } from './TiltSurface.jsx';

const orbits = [
    { x: '72%', y: '18%', rot: -6 },
    { x: '58%', y: '42%', rot: 4 },
    { x: '18%', y: '14%', rot: 8 },
    { x: '28%', y: '58%', rot: -3 },
    { x: '78%', y: '68%', rot: 5 },
    { x: '48%', y: '28%', rot: -8 },
];

export function FloatingIslands({ items = [] }) {
    const lite = useLiteExperience();
    const { ref, visible } = useInView();

    return (
        <section
            className={`exp-islands ${visible ? 'exp-islands--visible' : ''} ${lite ? 'exp-islands--lite' : ''}`.trim()}
            ref={ref}
        >
            <div className="exp-islands__whisper container">
                <p>فضایی که پیش از حرف زدن، اعتماد می‌سازد</p>
            </div>
            <div className="exp-islands__field">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const orbit = orbits[index % orbits.length];
                    return (
                        <TiltSurface
                            key={item.id ?? item.label}
                            className="exp-island"
                            float={false}
                            style={
                                lite
                                    ? undefined
                                    : {
                                          left: orbit.x,
                                          top: orbit.y,
                                          '--island-rot': `${orbit.rot}deg`,
                                          '--island-delay': `${index * 70}ms`,
                                      }
                            }
                        >
                            {Icon ? <Icon size={22} /> : <span className="exp-island__dot" />}
                            <span>{item.label}</span>
                        </TiltSurface>
                    );
                })}
            </div>
        </section>
    );
}
