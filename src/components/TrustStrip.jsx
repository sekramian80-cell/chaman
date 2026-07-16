import { trustItems } from "../content/trust.js";
import { heroStats } from "../content/hero.js";
import { ScrollReveal } from "./ScrollReveal.jsx";

export function TrustStrip() {
    return (
        <section className="trust-band" aria-label="اعتماد و تجربه">
            <div className="container trust-band__inner">
                <ScrollReveal className="trust-band__stats">
                    {heroStats.map((stat) => (
                        <div className="trust-band__stat" key={stat.id ?? stat.label}>
                            <strong>{stat.value}</strong>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </ScrollReveal>

                <div className="trust-band__items" aria-label="مزیت‌های کلیدی">
                    {trustItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <ScrollReveal
                                className="trust-band__item"
                                delay={index * 70}
                                key={item.id ?? item.label}
                            >
                                <span className="trust-band__icon">
                                    <Icon size={20} aria-hidden />
                                </span>
                                <span>{item.label}</span>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
