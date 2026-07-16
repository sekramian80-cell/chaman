import { BeforeAfter } from '../luxury/BeforeAfter.jsx';
import { useInView } from '../../hooks/useInView.js';

export function MorphReveal({ beforeSrc, afterSrc, beforeLabel, afterLabel }) {
    const { ref, visible } = useInView();

    return (
        <section className={`exp-morph ${visible ? 'exp-morph--visible' : ''}`.trim()} ref={ref}>
            <div className="container exp-morph__inner">
                <h2 className="exp-morph__title">قبل و بعد را لمس کنید</h2>
                <p className="exp-morph__lead">سطح خام به یک تجربه زندگی تبدیل می‌شود.</p>
                <div className="exp-morph__compare">
                    <BeforeAfter
                        beforeSrc={beforeSrc}
                        afterSrc={afterSrc}
                        beforeLabel={beforeLabel}
                        afterLabel={afterLabel}
                        className="exp-compare"
                    />
                </div>
            </div>
        </section>
    );
}
