import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProjectGallery } from '../components/ProjectGallery.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import projectsHero from '../assets/hero-projects-football.jpg';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { PageHero } from './PageHero.jsx';
import { projectStats } from '../content/projects.js';

export function ProjectsPage() {
    const { projects } = useSiteContent();
    const count = projects?.items?.length || 0;

    return (
        <>
            <PageHero
                image={projectsHero}
                eyebrow="نمونه کارها"
                title="اجراهایی که کیفیت فراز چمن را نشان می‌دهند"
                description={
                    count > 0
                        ? `${count} نمونه کار واقعی از فضاهای ورزشی و تزیینی؛ انتخاب، نصب و جزئیات پایانی با دقت ثبت شده‌اند.`
                        : 'مجموعه‌ای از پروژه‌های ورزشی و تزیینی که کیفیت اجرا، دقت نصب و نتیجه نهایی را نشان می‌دهد.'
                }
                primaryLabel="درخواست بازدید"
                secondaryLabel="مشاهده محصولات"
                secondaryHref="/products"
            />
            <ProjectGallery />
            <section className="section section--warm projects-metrics">
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
