import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export function MagneticButton({
    children,
    href,
    className = '',
    strength = 0.35,
    as: Comp = 'a',
    ...props
}) {
    const reduced = useReducedMotion();

    if (reduced) {
        const Tag = href ? 'a' : Comp;
        return (
            <Tag className={`lux-magnetic ${className}`.trim()} href={href} {...props}>
                {children}
            </Tag>
        );
    }

    return (
        <motion.a
            className={`lux-magnetic ${className}`.trim()}
            href={href}
            {...props}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseMove={(event) => {
                const node = event.currentTarget;
                const rect = node.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;
                node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'translate3d(0, 0, 0)';
            }}
            style={{ transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
            <motion.span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }} transition={{ ease }}>
                {children}
            </motion.span>
        </motion.a>
    );
}
