import { useEffect, useRef } from 'react';

/**
 * Normalized pointer position (-1..1) with RAF smoothing
 */
export function useMouse(smoothing = 0.12) {
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const frame = useRef(0);

    useEffect(() => {
        const onMove = (event) => {
            target.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            target.current.y = (event.clientY / window.innerHeight) * 2 - 1;
        };

        const tick = () => {
            current.current.x += (target.current.x - current.current.x) * smoothing;
            current.current.y += (target.current.y - current.current.y) * smoothing;
            frame.current = requestAnimationFrame(tick);
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        frame.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('pointermove', onMove);
            cancelAnimationFrame(frame.current);
        };
    }, [smoothing]);

    return current;
}
