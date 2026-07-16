import { useEffect } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

export function CustomCursor() {
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return undefined;

        const coarse = window.matchMedia('(pointer: coarse)').matches;
        if (coarse) return undefined;

        document.body.classList.add('exp-cursor-on');
        const root = document.documentElement;

        const onMove = (event) => {
            root.style.setProperty('--exp-cx', `${event.clientX}px`);
            root.style.setProperty('--exp-cy', `${event.clientY}px`);
        };

        const onOver = (event) => {
            const interactive = event.target.closest('a, button, input, [data-cursor="hover"]');
            root.classList.toggle('exp-cursor-hover', Boolean(interactive));
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('mouseover', onOver);

        return () => {
            document.body.classList.remove('exp-cursor-on');
            root.classList.remove('exp-cursor-hover');
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('mouseover', onOver);
        };
    }, [reduced]);

    if (reduced) return null;

    return (
        <>
            <div className="exp-cursor__dot" aria-hidden="true" />
            <div className="exp-cursor__ring" aria-hidden="true" />
        </>
    );
}
