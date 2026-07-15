import { ArrowLeft, MessageCircle, PlayCircle } from "lucide-react";
import heroImage from "../assets/hero-football-field.jpg";
import { heroContent, heroStats } from "../content/hero.js";
import { SectionSeam } from "./SectionSeam.jsx";

export function Hero() {
    return (
        <section id="top" className="hero" style={{ "--hero-image": `url(${heroImage})` }}>
            <div className="hero__overlay" />
            <div className="hero__content">
                <div className="hero__copy">
                    <span className="eyebrow">{heroContent.eyebrow}</span>
                    <h1>{heroContent.title}</h1>
                    <div className="hero__fifa-badge">{heroContent.fifaBadge}</div>
                    <p>{heroContent.description}</p>
                    <div className="hero__actions">
                        <a className="btn btn--primary" href={heroContent.primaryCta.href}>
                            {heroContent.primaryCta.label}
                            <ArrowLeft size={18} />
                        </a>
                        <a className="btn btn--ghost" href={heroContent.secondaryCta.href}>
                            <PlayCircle size={19} />
                            {heroContent.secondaryCta.label}
                        </a>
                    </div>
                </div>

                <div className="hero__panel" aria-label="ویژگی‌های سریع">
                    <MessageCircle size={22} />
                    <strong>{heroContent.panel.title}</strong>
                    <span>{heroContent.panel.subtitle}</span>
                </div>
            </div>

            <div className="hero__stats" aria-label="آمار کسب‌وکار">
                {heroStats.map((stat) => (
                    <div key={stat.label}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </div>
                ))}
            </div>

            <SectionSeam variant="wave" tone="paper" className="hero__seam" />
        </section>
    );
}
