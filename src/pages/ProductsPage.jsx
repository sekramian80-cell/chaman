import { Droplets, Leaf, ShieldCheck, Sun } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProductShowcase } from '../components/ProductShowcase.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import productsHero from '../assets/hero-products-football.png';
import { PageHero } from './PageHero.jsx';

const productCards = [
  { icon: Leaf, title: 'مدل اقتصادی تراس', text: 'نرم، سبک و مناسب فضاهای کم‌رفت‌وآمد با هزینه کنترل‌شده.' },
  { icon: Sun, title: 'مدل پرمیوم فضای باز', text: 'الیاف مقاوم‌تر در برابر آفتاب با بافت طبیعی‌تر و رنگ چندطیفی.' },
  { icon: ShieldCheck, title: 'مدل پرتردد تجاری', text: 'تراکم بالاتر و برگشت‌پذیری بهتر برای کافه، مهدکودک و ورودی ساختمان.' },
  { icon: Droplets, title: 'مدل زهکشی سریع', text: 'انتخاب مناسب برای کنار استخر، روف گاردن و فضاهای قابل شستشو.' },
];

export function ProductsPage() {
  return (
    <>
      <PageHero
        image={productsHero}
        eyebrow="صفحه محصولات"
        title="مدل‌های پیشنهادی چمن مصنوعی"
        description="در این صفحه چند مدل دمو برای مقایسه ظاهر، تراکم، دوام و کاربردهای مختلف قرار گرفته است."
        primaryLabel="استعلام قیمت"
        secondaryLabel="مشاهده پروژه‌ها"
      />
      <ProductShowcase />
      <section className="section section--warm">
        <div className="container page-grid page-grid--four">
          {productCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal className="demo-card product-demo-card" delay={index * 80} key={item.title}>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <small>دمو محصول</small>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
