import { ArrowLeft } from 'lucide-react';
import { useInView } from '../../hooks/useInView.js';
import { ElasticButton } from './ElasticButton.jsx';

export function PinnedNarrative({ image, imageAlt, highlights = [], panel }) {
    const { ref, visible } = useInView();

    return (
        <section className={`exp-narrative ${visible ? 'exp-narrative--visible' : ''}`.trim()} ref={ref}>
            <div className="exp-narrative__stage">
                <div className="exp-narrative__visual">
                    <figure className="exp-living exp-narrative__living">
                        <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
                    </figure>
                </div>

                <div className="exp-narrative__copy">
                    <div className="exp-narrative__step">
                        <h2 className="exp-narrative__title">فضایی که مثل معماری لوکس روایت می‌شود</h2>
                    </div>

                    <div className="exp-narrative__step">
                        <p className="exp-narrative__text">
                            از انتخاب مدل تا نصب نهایی، مسیر پروژه شفاف است؛ برای فضای شما مدل مناسب پیشنهاد
                            می‌شود و اجرا با جزئیات تمیز تحویل داده می‌شود.
                        </p>
                    </div>

                    {highlights.map((item, index) => (
                        <div className="exp-narrative__step exp-narrative__item" key={item}>
                            <em>{String(index + 1).padStart(2, '0')}</em>
                            <p>{item}</p>
                        </div>
                    ))}

                    {panel ? (
                        <div className="exp-narrative__step exp-narrative__panel">
                            <strong>{panel.title}</strong>
                            <span>{panel.subtitle}</span>
                            <ElasticButton className="exp-btn exp-btn--primary exp-btn--compact" href="/products">
                                مشاهده محصولات
                                <ArrowLeft size={16} />
                            </ElasticButton>
                        </div>
                    ) : null}

                    <div className="exp-narrative__step">
                        <ElasticButton className="exp-btn exp-btn--ghost" href="/process" glow={false}>
                            مشاهده روند اجرا
                            <ArrowLeft size={17} />
                        </ElasticButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
