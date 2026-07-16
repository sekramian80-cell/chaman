import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js';

/**
 * GSAP context cleanup helper
 * @param {(ctx: gsap.Context) => void} factory
 * @param {unknown[]} [deps]
 */
export function useGsap(factory, deps = []) {
    const reduced = usePrefersReducedMotion();
    const scope = useRef(null);

    useLayoutEffect(() => {
        if (!scope.current || reduced) return undefined;

        const ctx = gsap.context(() => factory(gsap), scope);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduced, ...deps]);

    return scope;
}
