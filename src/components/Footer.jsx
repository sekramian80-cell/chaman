import { MapPin, MapPinned, MessageCircle, Phone } from "lucide-react";
import logoUrl from "../assets/logo-faraz.png";
import { contactInfo } from "../content/contact.js";

const locationAddress = "کرج - بلوار یادگار امام شمال - بین بلال ۶ و ۷ - مجتمع نور هشتم";
const mapCoordinates = "35.823127306947775,50.96402704728472";
const mapEmbedUrl = `https://www.google.com/maps?q=${mapCoordinates}&z=17&output=embed&hl=fa`;

export function Footer() {
    return (
        <footer className="site-footer site-footer--premium">
            <div className="container site-footer__inner">
                <div className="site-footer__brand">
                    <a className="brand brand--footer" href="/" aria-label="فراز چمن">
                        <img className="brand__full-logo" src={logoUrl} alt="لوگوی فراز چمن" loading="lazy" decoding="async" />
                    </a>
                    <p>فروش، طراحی و اجرای چمن مصنوعی برای خانه، ویلا، روف گاردن و کسب‌وکارها.</p>
                </div>

                <section className="footer-map" aria-labelledby="footer-map-title">
                    <div className="footer-map__heading">
                        <h2 id="footer-map-title">
                            <MapPinned size={18} />
                            موقعیت دفتر
                        </h2>
                    </div>

                    <div className="footer-map__canvas">
                        <iframe
                            title="موقعیت دفتر فراز چمن روی نقشه"
                            src={mapEmbedUrl}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    <address className="footer-map__address">
                        <MapPin size={17} />
                        <span>{locationAddress}</span>
                    </address>
                </section>

                <div className="footer-contact">
                    <a href={`tel:${contactInfo.phone}`}>
                        <Phone size={18} />
                        <bdi dir="ltr">{contactInfo.phoneDisplay}</bdi>
                    </a>
                    <span>
                        <MapPin size={18} />
                        {contactInfo.location}
                    </span>
                    <a href={contactInfo.whatsapp}>
                        <MessageCircle size={18} />
                        {contactInfo.whatsappLabel}
                    </a>
                </div>
            </div>
        </footer>
    );
}
