import { MapPin, MapPinned, MessageCircle, Navigation, Phone } from "lucide-react";
import logoUrl from "../assets/logo-faraz.png";
import { navItems } from "../content/navigation.js";

const locationAddress = "کرج - بلوار یادگار امام شمال - بین بلال ۶ و ۷ - مجتمع نور هشتم";
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationAddress)}&output=embed&hl=fa`;
const mapDirectionsUrl = "https://maps.app.goo.gl/6TYMtJ47J93JEKzz8";

export function Footer() {
    return (
        <footer className="site-footer">
            <section className="container footer-location" aria-labelledby="footer-location-title">
                <div className="footer-location__heading">
                    <span>
                        <MapPinned size={18} />
                        موقعیت دفتر
                    </span>
                    <h2 id="footer-location-title">دفتر فراز چمن روی نقشه</h2>
                </div>

                <div className="footer-location__map">
                    <iframe
                        title="موقعیت دفتر فراز چمن روی نقشه"
                        src={mapEmbedUrl}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                <div className="footer-location__details">
                    <div className="footer-location__address">
                        <span className="footer-location__pin" aria-hidden="true">
                            <MapPin size={22} />
                        </span>
                        <div>
                            <strong>آدرس دفتر</strong>
                            <address>{locationAddress}</address>
                        </div>
                    </div>

                    <a
                        className="btn btn--light footer-location__action"
                        href={mapDirectionsUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Navigation size={19} />
                        مسیریابی در گوگل‌مپ
                    </a>
                </div>
            </section>

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
