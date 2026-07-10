import { MapPin, MessageCircle, Phone } from "lucide-react";
import logoUrl from "../assets/logo-faraz.png";
import { navItems } from "../content/navigation.js";

export function Footer() {
    return (
        <footer className="site-footer">
            <div className="container site-footer__inner">
                <div>
                    <a className="brand brand--footer" href="#/" aria-label="فراز چمن">
                        <img className="brand__full-logo" src={logoUrl} alt="لوگوی فراز چمن" />
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
                    <a href="tel:+989123365430">
                        <Phone size={18} />
                        <bdi dir="ltr">۰۹۱۲۳۳۶۵۴۳۰</bdi>
                    </a>
                    <span>
                        <MapPin size={18} />
                        اجرای پروژه در تهران و کرج و سراسر کشور در کمترین زمان
                    </span>
                    <a href="https://wa.me/989123365430">
                        <MessageCircle size={18} />
                        چت واتساپ
                    </a>
                </div>
            </div>
        </footer>
    );
}
