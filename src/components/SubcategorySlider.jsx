import { subcategorySliderItems } from '../content/subcategorySlider.js';

export function SubcategorySlider() {
    const loopItems = [...subcategorySliderItems, ...subcategorySliderItems];

    return (
        <section className="section subcategory-slider-section" aria-label="کاربردهای چمن مصنوعی">
            <div className="container">
                <div className="subcategory-slider-section__header">
                    <span className="eyebrow">کاربردهای مختلف</span>
                    <h2>چمن مصنوعی برای هر نوع فضا</h2>
                    <p>از زمین ورزشی تا تراس و ویلا — مدل و اجرای مناسب هر کاربرد را ببینید.</p>
                </div>
            </div>

            <div className="subcategory-slider" dir="ltr">
                <div className="subcategory-slider__fade subcategory-slider__fade--start" aria-hidden="true" />
                <div className="subcategory-slider__fade subcategory-slider__fade--end" aria-hidden="true" />
                <div className="subcategory-slider__track">
                    {loopItems.map((item, index) => (
                        <a
                            className="subcategory-slider__card"
                            dir="rtl"
                            href={item.href}
                            key={`${item.slug}-${index}`}
                        >
                            <div className="subcategory-slider__media">
                                <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                            </div>
                            <div className="subcategory-slider__body">
                                <h3>{item.title}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
