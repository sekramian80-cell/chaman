import { MapPin, MapPinned, MessageCircle, Navigation, Phone } from "lucide-react";
import logoUrl from "../assets/logo-faraz.png";

const locationAddress = "کرج - بلوار یادگار امام شمال - بین بلال ۶ و ۷ - مجتمع نور هشتم";
const mapCoordinates = "35.823127306947775,50.96402704728472";
const mapEmbedUrl = `https://www.google.com/maps?q=${mapCoordinates}&z=17&output=embed&hl=fa`;
const mapDirectionsUrl = `https://www.google.com/maps?q=${mapCoordinates}`;

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

                <section className="footer-map" aria-labelledby="footer-map-title">
                    <div className="footer-map__heading">
                        <h2 id="footer-map-title">
                            <MapPinned size={18} />
                            موقعیت دفتر
                        </h2>
                        <a
                            className="footer-map__route"
                            href={mapDirectionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="مسیریابی در گوگل‌مپ"
                            title="مسیریابی در گوگل‌مپ"
                        >
                            <Navigation size={18} />
                        </a>
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
