import { MapPin, Ruler, Sparkles } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProjectGallery } from '../components/ProjectGallery.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import projectsHero from '../assets/hero-projects-football.png';
import { PageHero } from './PageHero.jsx';

const projectStats = [
  { icon: Ruler, value: '۴۵۰ متر', label: 'نمونه متراژ ماهانه' },
  { icon: MapPin, value: 'تهران و کرج', label: 'مناطق پرتکرار اجرا' },
  { icon: Sparkles, value: '۳ سبک', label: 'مسکونی، تجاری، روف' },
];

export function ProjectsPage() {
  return (
    <>
      <PageHero
        image={projectsHero}
        eyebrow="صفحه نمونه کار"
        title="نمونه پروژه‌های دمو برای نمایش کیفیت اجرا"
        description="در این بخش چند سناریوی پیشفرض از پروژه‌ها، متراژها و کاربردهای رایج قرار گرفته تا صفحه نمونه‌کار کامل‌تر باشد."
        primaryLabel="درخواست بازدید"
        secondaryLabel="مشاهده خدمات"
        secondaryHref="#/services"
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
