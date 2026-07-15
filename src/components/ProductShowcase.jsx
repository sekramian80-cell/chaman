import { CheckCircle2 } from 'lucide-react';
import heroImage from '../assets/hero-artificial-grass.jpg';
import { productHighlights } from '../content/products.js';
import { ScrollReveal } from './ScrollReveal.jsx';

export function ProductShowcase() {
    return (
        <section id="products" className="section product-showcase product-showcase--premium">
            <div className="container product-showcase__layout">
                <ScrollReveal className="product-showcase__media" variant="scale">
                    <img
                        src={heroImage}
                        alt="نمای نزدیک از چمن مصنوعی اجرا شده در فضای مدرن"
                        loading="lazy"
                        decoding="async"
                    />
                    <span className="product-showcase__media-shine" aria-hidden="true" />
                    <div className="quality-badge quality-badge--premium">
                        <CheckCircle2 size={20} />
                        <span>نصب تمیز، برش دقیق، تحویل آماده استفاده</span>
                    </div>
                </ScrollReveal>

                <div className="product-showcase__content">
                    <ScrollReveal variant="right">
                        <span className="eyebrow">محصولات پیشنهادی</span>
                        <h2>ظاهر طبیعی با نگهداری ساده‌تر</h2>
                        <p>
                            برای هر پروژه چند مدل چمن با تراکم و ارتفاع متفاوت پیشنهاد می‌شود تا بین بودجه، ظاهر،
                            نرمی و دوام بهترین تعادل را داشته باشید.
                        </p>
                    </ScrollReveal>

                    <div className="highlight-list highlight-list--premium">
                        {productHighlights.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <ScrollReveal
                                    className="highlight-item highlight-item--premium"
                                    delay={index * 90}
                                    variant={index % 2 === 0 ? 'up' : 'left'}
                                    key={item.title}
                                >
                                    <span className="highlight-item__icon">
                                        <Icon size={22} />
                                    </span>
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
