import { MapPin, MessageCircle, Phone } from "lucide-react";
import contactHero from "../assets/hero-services-football.jpg";
import { ScrollReveal } from "../components/ScrollReveal.jsx";
import { contactInfo } from "../content/contact.js";
import { PageHero } from "./PageHero.jsx";

const locationAddress = "کرج - بلوار یادگار امام شمال - بین بلال ۶ و ۷ - مجتمع نور هشتم";
const mapCoordinates = "35.823127306947775,50.96402704728472";
const mapEmbedUrl = `https://www.google.com/maps?q=${mapCoordinates}&z=17&output=embed&hl=fa`;

export function ContactPage() {
    return (
        <>
            <PageHero
                image={contactHero}
                eyebrow="تماس با ما"
                title="برای مشاوره، بازدید و استعلام قیمت در تماس باشید"
                description="تیم فراز چمن آماده پاسخ‌گویی درباره انتخاب مدل، متراژ، زمان اجرا و بازدید از پروژه‌های مشابه است."
                primaryLabel="تماس تلفنی"
                secondaryLabel="پیام در واتساپ"
                secondaryHref="https://wa.me/989123365430"
                seam="slash"
            />

            <section className="section page-section">
                <div className="container contact-page-grid">
                    <ScrollReveal className="contact-card">
                        <Phone size={28} />
                        <h2>تماس تلفنی</h2>
                        <p>برای مشاوره سریع و هماهنگی بازدید با ما تماس بگیرید.</p>
                        <a href={`tel:${contactInfo.phone}`}>
                            <bdi dir="ltr">{contactInfo.phoneDisplay}</bdi>
                        </a>
                    </ScrollReveal>

                    <ScrollReveal className="contact-card" delay={80}>
                        <MessageCircle size={28} />
                        <h2>واتساپ</h2>
                        <p>عکس فضا، متراژ و محل اجرا را بفرستید تا پیشنهاد اولیه بگیرید.</p>
                        <a href={contactInfo.whatsapp}>{contactInfo.whatsappLabel}</a>
                    </ScrollReveal>

                    <ScrollReveal className="contact-card" delay={160}>
                        <MapPin size={28} />
                        <h2>آدرس دفتر</h2>
                        <p>{contactInfo.location}</p>
                        <address>{locationAddress}</address>
                    </ScrollReveal>
                </div>
            </section>

            <section className="section section--warm">
                <div className="container contact-map-block">
                    <ScrollReveal>
                        <span className="eyebrow">موقعیت دفتر</span>
                        <h2>مسیر دسترسی به دفتر فراز چمن</h2>
                    </ScrollReveal>
                    <ScrollReveal className="contact-map-block__canvas" delay={90}>
                        <iframe
                            title="موقعیت دفتر فراز چمن روی نقشه"
                            src={mapEmbedUrl}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}
