import { useRef } from 'react';
import { motion, useReducedMotion, useSpring, useMotionValue } from 'framer-motion';

export function TiltSurface({ children, className = '', intensity = 14, float = true, style = {} }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springX = useSpring(rotateX, { stiffness: 180, damping: 22 });
    const springY = useSpring(rotateY, { stiffness: 180, damping: 22 });

    if (reduced) {
        return <div className={`exp-tilt ${className}`.trim()} style={style}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            className={`exp-tilt ${float ? 'exp-tilt--float' : ''} ${className}`.trim()}
            data-cursor="hover"
            style={{
                rotateX: springX,
                rotateY: springY,
                transformPerspective: 900,
                transformStyle: 'preserve-3d',
                ...style,
            }}
            onMouseMove={(event) => {
                const node = ref.current;
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const px = (event.clientX - rect.left) / rect.width - 0.5;
                const py = (event.clientY - rect.top) / rect.height - 0.5;
                rotateY.set(px * intensity);
                rotateX.set(-py * intensity);
            }}
            onMouseLeave={() => {
                rotateX.set(0);
                rotateY.set(0);
            }}
        >
            <span className="exp-tilt__sheen" aria-hidden="true" />
            <span className="exp-tilt__edge" aria-hidden="true" />
            {children}
        </motion.div>
    );
}
