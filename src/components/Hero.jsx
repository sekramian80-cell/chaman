import { ArrowLeft, MessageCircle, PlayCircle } from 'lucide-react';
import heroImage from '../assets/hero-artificial-grass.png';
import { heroStats } from '../data/content.js';

export function Hero() {
  return (
    <section id="top" className="hero" style={{ '--hero-image': `url(${heroImage})` }}>
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__copy">
          <span className="eyebrow">طراحی، فروش و اجرای تخصصی</span>
          <h1>چمن مصنوعی سبزپوشان</h1>
          <p>
            فضای بیرونی شما را با چمنی تمیز، همیشه سبز و کم‌نگهداری به یک محیط لوکس
            برای زندگی، کار و پذیرایی تبدیل می‌کنیم.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="tel:+989120000000">
              مشاوره رایگان
              <ArrowLeft size={18} />
            </a>
            <a className="btn btn--ghost" href="#/projects">
              <PlayCircle size={19} />
              دیدن نمونه کارها
            </a>
          </div>
        </div>

        <div className="hero__panel" aria-label="ویژگی‌های سریع">
          <MessageCircle size={22} />
          <strong>پیشنهاد مدل و قیمت‌گذاری بر اساس متراژ و کاربری</strong>
          <span>از تراس کوچک تا محوطه ویلایی و فضای پرتردد تجاری</span>
        </div>
      </div>

      <div className="hero__stats" aria-label="آمار کسب‌وکار">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
