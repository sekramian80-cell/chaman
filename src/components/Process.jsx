import { processSteps } from '../data/content.js';
import { ScrollReveal } from './ScrollReveal.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export function Process() {
  return (
    <section id="process" className="section section--dark">
      <div className="container">
        <SectionHeader
          eyebrow="روند همکاری"
          title="از ایده تا اجرای نهایی، مرحله‌ها شفاف است"
          description="پروژه با انتخاب درست شروع می‌شود و با نصب تمیز، برس‌کشی و آموزش نگهداری به پایان می‌رسد."
        />

        <div className="process-line">
          {processSteps.map((item, index) => (
            <ScrollReveal className="process-step" delay={index * 90} key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
