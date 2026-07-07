import { CalendarCheck, FileText, Hammer, MessagesSquare } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { Process } from '../components/Process.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { PageHero } from './PageHero.jsx';

const timeline = [
  { icon: MessagesSquare, title: 'گفت‌وگوی اولیه', text: 'کاربری فضا، بودجه، زمان تحویل و سبک بصری مورد نظر ثبت می‌شود.' },
  { icon: FileText, title: 'پیشنهاد و پیش‌فاکتور', text: 'چند مدل مناسب همراه با بازه قیمت و جزئیات نصب پیشنهاد می‌شود.' },
  { icon: Hammer, title: 'زیرسازی و نصب', text: 'سطح آماده، برش‌ها دقیق و اتصال‌ها تمیز اجرا می‌شوند.' },
  { icon: CalendarCheck, title: 'تحویل و پشتیبانی', text: 'بعد از برس‌کشی، نکات نگهداری و شستشو توضیح داده می‌شود.' },
];

export function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="صفحه روند اجرا"
        title="روند همکاری سریع، شفاف و مرحله‌به‌مرحله"
        description="این صفحه برای توضیح دمو از مسیر اجرای پروژه طراحی شده تا مشتری بداند از اولین تماس تا تحویل چه اتفاقی می‌افتد."
        primaryLabel="شروع پروژه"
        secondaryLabel="دیدن نمونه اجرا"
      />
      <Process />
      <section className="section page-section">
        <div className="container timeline-list">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal className="timeline-item" delay={index * 90} key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
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
