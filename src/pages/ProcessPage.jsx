import { ContactCTA } from "../components/ContactCTA.jsx";
import { Process } from "../components/Process.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import processHero from "../assets/hero-process-football.png";
import { PageHero } from "./PageHero.jsx";
import { processTimeline } from "../content/process.js";

export function ProcessPage() {
    return (
        <>
            <PageHero
                image={processHero}
                eyebrow="صفحه روند اجرا"
                title="روند همکاری سریع، شفاف و مرحله‌به‌مرحله"
                description="این صفحه برای توضیح دمو از مسیر اجرای پروژه طراحی شده تا مشتری بداند از اولین تماس تا تحویل چه اتفاقی می‌افتد."
                primaryLabel="شروع پروژه"
                secondaryLabel="دیدن نمونه اجرا"
            />
            <Process />
            <section className="section page-section">
                <div className="container timeline-list">
                    {processTimeline.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <ScrollReveal className="timeline-item" delay={index * 90} key={item.title}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <Icon size={26} />
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>
            <ContactCTA />
        </>
    );
}
