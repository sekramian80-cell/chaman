import { useEffect, useState } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { ElasticButton } from './ElasticButton.jsx';

export function OrbitCTA({ href = 'tel:+989123365430', label = 'مشاوره رایگان' }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.65);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <div className="exp-orbit-cta exp-orbit-cta--visible">
            <ElasticButton className="exp-orbit-cta__btn" href={href}>
                <Phone size={18} />
                {label}
                <ArrowLeft size={16} />
            </ElasticButton>
        </div>
    );
}
