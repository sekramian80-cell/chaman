import { useEffect, useRef, useState } from 'react';

/**
 * One-shot intersection observer — cheap reveal without scroll listeners.
 */
export function useInView(options = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || visible) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -6% 0px',
                ...options,
            },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [visible]);

    return { ref, visible };
}
