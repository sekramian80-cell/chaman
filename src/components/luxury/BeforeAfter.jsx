import { useRef, useState } from 'react';

export function BeforeAfter({ beforeSrc, afterSrc, beforeLabel = 'قبل', afterLabel = 'بعد', className = '' }) {
    const ref = useRef(null);
    const [position, setPosition] = useState(52);

    function updateFromClientX(clientX) {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const next = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(92, Math.max(8, next)));
    }

    return (
        <div
            className={`lux-compare ${className}`.trim()}
            ref={ref}
            onPointerMove={(event) => {
                if (event.buttons !== 1 && event.pointerType !== 'touch') return;
                updateFromClientX(event.clientX);
            }}
            onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                updateFromClientX(event.clientX);
            }}
        >
            <img className="lux-compare__after" src={afterSrc} alt={afterLabel} loading="lazy" decoding="async" />
            <div className="lux-compare__before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
                <img src={beforeSrc} alt={beforeLabel} loading="lazy" decoding="async" />
            </div>
            <div className="lux-compare__handle" style={{ insetInlineStart: `${position}%` }} aria-hidden="true">
                <span />
            </div>
            <span className="lux-compare__label lux-compare__label--before">{beforeLabel}</span>
            <span className="lux-compare__label lux-compare__label--after">{afterLabel}</span>
            <input
                className="lux-compare__range"
                type="range"
                min="8"
                max="92"
                value={position}
                aria-label="مقایسه قبل و بعد"
                onChange={(event) => setPosition(Number(event.target.value))}
            />
        </div>
    );
}
