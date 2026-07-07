import { ArrowLeft, Quote } from 'lucide-react';
import { projects } from '../data/content.js';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export function ProjectGallery() {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <SectionHeader
          eyebrow="نمونه اجرا"
          title="پروژه‌هایی که برای استفاده واقعی طراحی شده‌اند"
          description="فضاهای مختلف به راه‌حل متفاوت نیاز دارند؛ این نمونه‌ها نشان می‌دهد تمرکز روی جزئیات نصب چقدر روی نتیجه نهایی اثر دارد."
        />

        <div className="project-grid">
          {projects.map((project, index) => (
            <ScrollReveal className="project-card" delay={index * 80} key={project.title}>
              <span className="project-card__number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{project.title}</h3>
              <small>{project.meta}</small>
              <p>{project.description}</p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="testimonial">
          <Quote size={34} />
          <p>
            «چمن سبزپوشان ظاهر فضای ما را کاملا عوض کرد؛ مهم‌تر اینکه نصب تمیز و
            زمان‌بندی‌شان دقیقا مطابق توافق انجام شد.»
          </p>
          <div>
            <strong>مدیر مجموعه کافه باغ</strong>
            <a href="#contact">
              درخواست بازدید
              <ArrowLeft size={17} />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
