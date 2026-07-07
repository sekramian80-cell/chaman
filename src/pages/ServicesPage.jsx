import { CheckCircle2, ClipboardList, Sparkles, Timer } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { Services } from '../components/Services.jsx';
import { PageHero } from './PageHero.jsx';

const servicePlans = [
  { icon: Sparkles, title: 'پکیج فضای مسکونی', text: 'برای حیاط، بالکن، دور استخر و مسیرهای باغی با ظاهر طبیعی و نگهداری ساده.' },
  { icon: Timer, title: 'پکیج اجرای سریع', text: 'مناسب پروژه‌هایی که زمان تحویل کوتاه دارند و نیاز به برش و نصب دقیق دارند.' },
  { icon: ClipboardList, title: 'پکیج تجاری', text: 'برای کافه، شوروم و ورودی ساختمان با تمرکز روی دوام، شستشوی راحت و رفت‌وآمد بالا.' },
];

const serviceChecklist = ['بازدید و اندازه‌گیری', 'پیشنهاد مدل و بودجه', 'آماده‌سازی سطح', 'نصب و تحویل نهایی'];

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="صفحه خدمات"
        title="خدمات چمن مصنوعی برای هر نوع فضا"
        description="در این بخش نمونه خدمات دمو را می‌بینید؛ از مشاوره و انتخاب مدل تا زیرسازی، نصب و نگهداری."
        primaryLabel="درخواست مشاوره"
        secondaryLabel="دیدن نمونه اجرا"
      />
      <Services />
      <section className="section page-section">
        <div className="container page-grid page-grid--three">
          {servicePlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <ScrollReveal className="demo-card" delay={index * 90} key={plan.title}>
                <Icon size={28} />
                <h3>{plan.title}</h3>
                <p>{plan.text}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
      <section className="section section--dark compact-band">
        <div className="container checklist-band">
          {serviceChecklist.map((item, index) => (
            <ScrollReveal className="check-pill" delay={index * 70} key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
