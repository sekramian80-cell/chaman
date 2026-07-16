import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function ParallaxImage({ src, alt, className = '', strength = 18 }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [strength, -strength]);
    const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.12, 1]);

    return (
        <div className={`lux-parallax ${className}`.trim()} ref={ref}>
            <motion.img src={src} alt={alt} style={{ y, scale }} loading="lazy" decoding="async" />
            <span className="lux-parallax__veil" aria-hidden="true" />
        </div>
    );
}
