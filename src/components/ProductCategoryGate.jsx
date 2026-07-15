import { ArrowLeft, Flower2, Trophy } from 'lucide-react';
import sportsHero from '../assets/services/sports-field.jpg';
import decorativeHero from '../assets/hero-artificial-grass.jpg';
import { productCategoryList } from '../content/productCategories.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { ScrollReveal } from './ScrollReveal.jsx';

const categoryVisuals = {
    sports: {
        image: sportsHero,
        icon: Trophy,
        accent: 'ورزشی',
    },
    decorative: {
        image: decorativeHero,
        icon: Flower2,
        accent: 'تزیینی',
    },
};

export function ProductCategoryGate({ counts = {} }) {
    return (
        <section className="section product-category-gate">
            <div className="container">
                <ScrollReveal className="product-category-gate__intro" variant="scale">
                    <span className="eyebrow">مسیر انتخاب</span>
                    <h2>از کجا شروع می‌کنید؟</h2>
                    <p>محصولات را بر اساس کاربرد فضا جدا کرده‌ایم تا انتخاب مدل و دیدن نمونه‌ها سریع‌تر شود.</p>
                </ScrollReveal>

                <div className="product-category-gate__grid">
                    {productCategoryList.map((category, index) => {
                        const visual = categoryVisuals[category.slug];
                        const Icon = visual.icon;
                        const count = counts[category.slug] || 0;

                        return (
                            <ScrollReveal
                                className={`product-gate-card product-gate-card--${category.slug}`}
                                delay={index * 120}
                                key={category.slug}
                                variant={index === 0 ? 'right' : 'left'}
                            >
                                <a className="product-gate-card__link" href={category.path}>
                                    <div className="product-gate-card__media">
                                        <img
                                            src={visual.image}
                                            alt={category.title}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <span className="product-gate-card__shine" aria-hidden="true" />
                                    </div>
                                    <div className="product-gate-card__body">
                                        <span className="product-gate-card__icon" aria-hidden="true">
                                            <Icon size={22} />
                                        </span>
                                        <span className="product-gate-card__accent">{visual.accent}</span>
                                        <h3>{category.title}</h3>
                                        <p>{category.description}</p>
                                        <div className="product-gate-card__meta">
                                            <strong>{count ? toPersianNumber(count) : '—'}</strong>
                                            <span>نمونه ثبت‌شده</span>
                                        </div>
                                        <span className="product-gate-card__cta">
                                            ورود به دسته
                                            <ArrowLeft size={16} />
                                        </span>
                                    </div>
                                </a>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
