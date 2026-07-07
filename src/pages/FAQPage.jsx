import { HelpCircle, MessageCircle, PhoneCall } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { PageHero } from './PageHero.jsx';

const supportItems = [
  { icon: HelpCircle, title: 'راهنمای انتخاب', text: 'اگر بین چند مدل مردد هستید، بر اساس فضا و بودجه پیشنهاد اولیه می‌گیرید.' },
  { icon: MessageCircle, title: 'ارسال عکس در واتساپ', text: 'چند عکس از محیط بفرستید تا محدوده قیمت و آماده‌سازی مشخص شود.' },
  { icon: PhoneCall, title: 'تماس سریع', text: 'برای پروژه‌های فوری، هماهنگی بازدید و زمان اجرا سریع‌تر انجام می‌شود.' },
];

export function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="صفحه سوالات"
        title="پاسخ سوالات رایج قبل از خرید و نصب"
        description="اینجا سوالات پرتکرار به شکل دمو دسته‌بندی شده‌اند تا تصمیم‌گیری درباره مدل، قیمت و نگهداری ساده‌تر شود."
        primaryLabel="پرسیدن سوال"
        secondaryLabel="دیدن محصولات"
        secondaryHref="#/products"
      />
      <FAQ />
      <section className="section page-section">
        <div className="container page-grid page-grid--three">
          {supportItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal className="demo-card" delay={index * 90} key={item.title}>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
