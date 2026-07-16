import { motion, useReducedMotion, useSpring, useMotionValue } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

export function ElasticButton({
    children,
    href,
    className = '',
    strength = 0.42,
    glow = true,
    ...props
}) {
    const reduced = useReducedMotion();
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, { stiffness: 280, damping: 18 });
    const y = useSpring(rawY, { stiffness: 280, damping: 18 });

    if (reduced) {
        return (
            <a className={`exp-elastic ${className}`.trim()} href={href} data-cursor="hover" {...props}>
                <span className="exp-elastic__glow" aria-hidden="true" />
                {children}
            </a>
        );
    }

    return (
        <motion.a
            className={`exp-elastic ${glow ? 'exp-elastic--glow' : ''} ${className}`.trim()}
            href={href}
            data-cursor="hover"
            style={{ x, y }}
            whileTap={{ scale: 0.94 }}
            onMouseMove={(event) => {
                const node = event.currentTarget;
                const rect = node.getBoundingClientRect();
                rawX.set((event.clientX - rect.left - rect.width / 2) * strength);
                rawY.set((event.clientY - rect.top - rect.height / 2) * strength);
            }}
            onMouseLeave={() => {
                rawX.set(0);
                rawY.set(0);
            }}
            {...props}
        >
            <motion.span
                className="exp-elastic__inner"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.35, ease }}
            >
                {children}
            </motion.span>
            {glow ? <span className="exp-elastic__glow" aria-hidden="true" /> : null}
        </motion.a>
    );
}
