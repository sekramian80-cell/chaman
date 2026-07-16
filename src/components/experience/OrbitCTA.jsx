import { useEffect, useState } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ElasticButton } from './ElasticButton.jsx';

export function OrbitCTA({ href = 'tel:+989123365430', label = 'مشاوره رایگان' }) {
    const [visible, setVisible] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.65);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible ? (
                <motion.div
                    className="exp-orbit-cta"
                    initial={reduced ? false : { opacity: 0, y: 32, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.94 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="exp-orbit-cta__ring" aria-hidden="true" />
                    <ElasticButton className="exp-orbit-cta__btn" href={href}>
                        <Phone size={18} />
                        {label}
                        <ArrowLeft size={16} />
                    </ElasticButton>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
