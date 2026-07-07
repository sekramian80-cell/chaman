import { Instagram, MapPin, Phone } from 'lucide-react';
import { navItems } from '../data/content.js';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <a className="brand brand--footer" href="#/" aria-label="سبزپوشان">
            <span className="brand__mark">س</span>
            <span>
              <strong>سبزپوشان</strong>
              <small>چمن مصنوعی مدرن</small>
            </span>
          </a>
          <p>فروش، طراحی و اجرای چمن مصنوعی برای خانه، ویلا، روف گاردن و کسب‌وکارها.</p>
        </div>

        <nav className="footer-nav" aria-label="لینک‌های فوتر">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer-contact">
          <a href="tel:+989120000000">
            <Phone size={18} />
            ۰۹۱۲ ۰۰۰ ۰۰۰۰
          </a>
          <span>
            <MapPin size={18} />
            تهران و کرج، اجرای پروژه در سراسر کشور
          </span>
          <a href="https://instagram.com/">
            <Instagram size={18} />
            صفحه اینستاگرام
          </a>
        </div>
      </div>
    </footer>
  );
}
