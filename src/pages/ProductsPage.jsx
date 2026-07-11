import { ContactCTA } from "../components/ContactCTA.jsx";
import { ProductShowcase } from "../components/ProductShowcase.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import productsHero from "../assets/hero-products-football.jpg";
import { PageHero } from "./PageHero.jsx";
import { productCards } from "../content/products.js";

export function ProductsPage() {
    return (
        <>
            <PageHero
                image={productsHero}
                eyebrow="صفحه محصولات"
                title="مدل‌های پیشنهادی چمن مصنوعی"
                description="در این صفحه چند مدل دمو برای مقایسه ظاهر، تراکم، دوام و کاربردهای مختلف قرار گرفته است."
                primaryLabel="استعلام قیمت"
                secondaryLabel="مشاهده پروژه‌ها"
            />
            <ProductShowcase />
            <section className="section section--warm">
                <div className="container page-grid page-grid--four">
                    {productCards.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <ScrollReveal className="demo-card product-demo-card" delay={index * 80} key={item.title}>
                                <Icon size={28} />
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                                <small>دمو محصول</small>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>
            <ContactCTA />
        </>
    );
}
