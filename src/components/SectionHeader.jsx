import { ScrollReveal } from './ScrollReveal.jsx';

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <ScrollReveal className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </ScrollReveal>
  );
}
