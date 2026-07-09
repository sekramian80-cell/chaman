import { CheckCircle2 } from "lucide-react";
import heroImage from "../assets/hero-artificial-grass.png";
import { productHighlights } from "../content/products.js";
import { ScrollReveal } from "./ScrollReveal.jsx";

export function ProductShowcase() {
    return (
        <section id="products" className="section product-showcase">
            <div className="container product-showcase__layout">
                <ScrollReveal className="product-showcase__media">
                    <img src={heroImage} alt="نمای نزدیک از چمن مصنوعی اجرا شده در فضای مدرن" />
                    <div className="quality-badge">
                        <CheckCircle2 size={20} />
                        <span>نصب تمیز، برش دقیق، تحویل آماده استفاده</span>
                    </div>
                </ScrollReveal>

                <div className="product-showcase__content">
                    <ScrollReveal>
                        <span className="eyebrow">محصولات پیشنهادی</span>
                        <h2>ظاهر طبیعی با نگهداری ساده‌تر</h2>
                        <p>
                            برای هر پروژه چند مدل چمن با تراکم و ارتفاع متفاوت پیشنهاد می‌شود تا بین بودجه، ظاهر، نرمی و
                            دوام بهترین تعادل را داشته باشید.
                        </p>
                    </ScrollReveal>

                    <div className="highlight-list">
                        {productHighlights.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <ScrollReveal className="highlight-item" delay={index * 70} key={item.title}>
                                    <Icon size={24} />
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
