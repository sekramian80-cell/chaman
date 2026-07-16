import { ArrowLeft, PlayCircle } from "lucide-react";
import heroImage from "../assets/hero-football-field.jpg";
import { heroContent } from "../content/hero.js";
import { SectionSeam } from "./SectionSeam.jsx";

export function Hero() {
    return (
        <section id="top" className="hero hero--premium" style={{ "--hero-image": `url(${heroImage})` }}>
            <div className="hero__overlay" />
            <div className="hero__veil" aria-hidden="true" />

            <div className="hero__content">
                <div className="hero__copy">
                    <p className="hero__brand">فراز چمن</p>
                    <span className="eyebrow">{heroContent.eyebrow}</span>
                    <h1>{heroContent.title}</h1>
                    <p className="hero__lead">{heroContent.description}</p>
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
                    {heroContent.fifaBadge ? (
                        <div className="hero__fifa">{heroContent.fifaBadge}</div>
                    ) : null}
                </div>
            </div>

            <SectionSeam variant="wave" tone="paper" className="hero__seam" />
        </section>
    );
}
