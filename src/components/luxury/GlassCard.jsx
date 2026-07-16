import { motion, useReducedMotion } from 'framer-motion';

export function GlassCard({ children, className = '', hover = true }) {
    const reduced = useReducedMotion();

    return (
        <motion.div
            className={`lux-glass ${className}`.trim()}
            whileHover={hover && !reduced ? { y: -6, scale: 1.01 } : undefined}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
            <span className="lux-glass__shine" aria-hidden="true" />
            {children}
        </motion.div>
    );
}
