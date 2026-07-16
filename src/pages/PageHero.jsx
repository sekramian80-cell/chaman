import { ArrowLeft } from "lucide-react";
import { SectionSeam } from "../components/SectionSeam.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";

export function PageHero({
    eyebrow,
    title,
    description,
    primaryLabel,
    secondaryLabel,
    secondaryHref = "/projects",
    image,
    seam = "slash",
}) {
    const heroStyle = image ? { "--page-hero-image": `url(${image})` } : undefined;

    return (
        <section className="page-hero page-hero--premium" style={heroStyle}>
            <div className="page-hero__glow" />
            <div className="page-hero__veil" aria-hidden="true" />
            <div className="container page-hero__inner">
                <ScrollReveal className="page-hero__copy">
                    <p className="page-hero__brand">فراز چمن</p>
                    <span className="eyebrow">{eyebrow}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <div className="hero__actions">
                        {primaryLabel && (
                            <a className="btn btn--primary" href="tel:+989123365430">
                                {primaryLabel}
                                <ArrowLeft size={18} />
                            </a>
                        )}
                        {secondaryLabel && (
                            <a className="btn btn--ghost page-hero__ghost" href={secondaryHref}>
                                {secondaryLabel}
                            </a>
                        )}
                    </div>
                </ScrollReveal>
            </div>
            <SectionSeam variant={seam} tone="paper" className="page-hero__seam" />
        </section>
    );
}
