import { ContactCTA } from "../components/ContactCTA.jsx";
import { ProjectGallery } from "../components/ProjectGallery.jsx";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import projectsHero from "../assets/hero-projects-football.jpg";
import { PageHero } from "./PageHero.jsx";
import { projectStats } from "../content/projects.js";

export function ProjectsPage() {
    return (
        <>
            <PageHero
                image={projectsHero}
                eyebrow="صفحه نمونه کارها"
                title="نمونه کارهای اجرا شده و کیفیت کار ما"
                description="مجموعه‌ای از پروژه‌های واقعی در کاربردهای ورزشی و تزیینی که کیفیت و دقت اجرای ما را نشان می‌دهد."
                primaryLabel="درخواست بازدید"
                secondaryLabel="مشاهده محصولات"
                secondaryHref="/products"
            />
            <ProjectGallery />
            <section className="section section--warm">
                <div className="container metric-row">
                    {projectStats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <ScrollReveal className="metric-card" delay={index * 90} key={stat.label}>
                                <Icon size={25} />
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>
            <ContactCTA />
        </>
    );
}
