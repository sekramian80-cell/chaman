import { ContactCTA } from '../components/ContactCTA.jsx';
import { Hero } from '../components/Hero.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { SubcategorySlider } from '../components/SubcategorySlider.jsx';
import { TrustStrip } from '../components/TrustStrip.jsx';
import { toPersianOrdinal } from '../utils/persianNumber.js';

const homeHighlights = [
  'انتخاب مدل بر اساس متراژ، نور و میزان رفت‌وآمد',
  'اجرای تمیز برای تراس، ویلا، روف گاردن و فضای تجاری',
  'تحویل سریع همراه با آموزش نگهداری و شستشو',
];

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <section className="section home-overview">
        <div className="container split-panel">
          <ScrollReveal>
            <span className="eyebrow">نمای کلی</span>
            <h2>مسیر سریع برای رسیدن به یک فضای همیشه سبز</h2>
            <p>
              این صفحه فقط شروع کار است. از منوی بالا وارد هر بخش شوید تا خدمات، محصولات، روند اجرا،
              نمونه پروژه‌ها و پاسخ سوالات را در صفحه اختصاصی خودش ببینید.
            </p>
          </ScrollReveal>
          <div className="demo-list">
            {homeHighlights.map((item, index) => (
              <ScrollReveal className="demo-row" delay={index * 80} key={item}>
                <span>{toPersianOrdinal(index)}</span>
                <strong>{item}</strong>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <SubcategorySlider />
      <ContactCTA />
    </>
  );
}
