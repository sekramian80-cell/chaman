import { useEffect, useState } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MagneticButton } from './MagneticButton.jsx';

export function FloatingCTA({ href = 'tel:+989123365430', label = 'مشاوره رایگان' }) {
    const [visible, setVisible] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible ? (
                <motion.div
                    className="lux-float-cta"
                    initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <MagneticButton className="lux-float-cta__btn" href={href}>
                        <Phone size={18} />
                        {label}
                        <ArrowLeft size={16} />
                    </MagneticButton>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
