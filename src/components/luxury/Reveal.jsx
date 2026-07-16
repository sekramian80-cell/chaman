import { motion, useReducedMotion } from 'framer-motion';

const variants = {
    up: { hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.94, y: 24 }, show: { opacity: 1, scale: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
    clip: {
        hidden: { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 24px)' },
        show: { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)' },
    },
};

export function Reveal({
    children,
    className = '',
    variant = 'up',
    delay = 0,
    once = true,
}) {
    const reduced = useReducedMotion();
    const preset = variants[variant] || variants.up;

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount: 0.22, margin: '0px 0px -8% 0px' }}
            variants={preset}
            transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
