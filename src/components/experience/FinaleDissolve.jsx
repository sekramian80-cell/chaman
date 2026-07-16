import { ArrowLeft } from 'lucide-react';
import { useInView } from '../../hooks/useInView.js';
import { ElasticButton } from './ElasticButton.jsx';

export function FinaleDissolve() {
    const { ref, visible } = useInView();

    return (
        <section className={`exp-finale ${visible ? 'exp-finale--visible' : ''}`.trim()} ref={ref}>
            <div className="exp-finale__bloom" aria-hidden="true" />
            <div className="exp-finale__content container">
                <h2 className="exp-finale__title">فضای شما آماده یک سطح ماندگار است؟</h2>
                <p>متراژ و چند عکس بفرستید — پیشنهاد مدل و بازه قیمت دقیق‌تری دریافت کنید.</p>
                <div className="exp-finale__actions">
                    <ElasticButton className="exp-btn exp-btn--primary" href="tel:+989123365430">
                        تماس مستقیم
                        <ArrowLeft size={17} />
                    </ElasticButton>
                    <ElasticButton className="exp-btn exp-btn--ghost" href="https://wa.me/989123365430" glow={false}>
                        پیام در واتساپ
                    </ElasticButton>
                </div>
            </div>
        </section>
    );
}
