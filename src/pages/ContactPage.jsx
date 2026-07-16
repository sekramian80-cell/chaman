import { ArrowLeft, MapPin, MessageCircle, Phone } from 'lucide-react';
import contactHero from '../assets/hero-services-football.jpg';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { contactInfo } from '../content/contact.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

const locationAddress = 'کرج - بلوار یادگار امام شمال - بین بلال ۶ و ۷ - مجتمع نور هشتم';
const mapCoordinates = '35.823127306947775,50.96402704728472';
const mapEmbedUrl = `https://www.google.com/maps?q=${mapCoordinates}&z=17&output=embed&hl=fa`;
const mapOpenUrl = `https://www.google.com/maps?q=${mapCoordinates}&z=17&hl=fa`;

export function ContactPage() {
    const { contact } = useSiteContent();
    const info = contact?.info || contactInfo;

    const cards = [
        {
            id: 'phone',
            icon: Phone,
            title: 'تماس تلفنی',
            text: 'برای مشاوره سریع و هماهنگی بازدید با ما تماس بگیرید.',
            href: `tel:${info.phone}`,
            action: <bdi dir="ltr">{info.phoneDisplay}</bdi>,
            accent: 'phone',
        },
        {
            id: 'whatsapp',
            icon: MessageCircle,
            title: 'واتساپ',
            text: 'عکس فضا، متراژ و محل اجرا را بفرستید تا پیشنهاد اولیه بگیرید.',
            href: info.whatsapp,
            action: info.whatsappLabel,
            accent: 'whatsapp',
        },
        {
            id: 'address',
            icon: MapPin,
            title: 'آدرس دفتر',
            text: info.location,
            href: mapOpenUrl,
            action: 'مشاهده روی نقشه',
            accent: 'map',
            address: locationAddress,
        },
    ];

    return (
        <div className="contact-page">
            <PageHero
                image={contactHero}
                eyebrow="تماس با ما"
                title="برای مشاوره، بازدید و استعلام قیمت در تماس باشید"
                description={`تیم فراز چمن از ${toPersianNumber(3)} مسیر — تلفن، واتساپ و دفتر — آماده پاسخ‌گویی درباره مدل، متراژ و زمان اجرا است.`}
                primaryLabel="تماس تلفنی"
                secondaryLabel="پیام در واتساپ"
                secondaryHref={info.whatsapp}
                seam="slash"
            />

            <section className="section page-section contact-channels contact-channels--premium">
                <div className="container">
                    <ScrollReveal className="contact-channels__intro" variant="scale">
                        <span className="eyebrow">راه‌های ارتباط</span>
                        <h2>هر مسیر، برای یک نیاز</h2>
                        <p>تماس سریع، ارسال عکس در واتساپ، یا مراجعه حضوری به دفتر؛ انتخاب با شماست.</p>
                    </ScrollReveal>

                    <div className="contact-page-grid contact-page-grid--premium">
                        {cards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <ScrollReveal
                                    className={`contact-card contact-card--premium contact-card--${card.accent}`}
                                    delay={index * 100}
                                    key={card.id}
                                    variant={index === 1 ? 'scale' : 'up'}
                                >
                                    <article className="contact-card__inner">
                                        <span className="contact-card__icon" aria-hidden="true">
                                            <Icon size={24} />
                                        </span>
                                        <h2>{card.title}</h2>
                                        <p>{card.text}</p>
                                        {card.address ? <address>{card.address}</address> : null}
                                        <a className="contact-card__cta" href={card.href}>
                                            {card.action}
                                            <ArrowLeft size={16} />
                                        </a>
                                        <span className="contact-card__shine" aria-hidden="true" />
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section section--warm contact-map contact-map--premium">
                <div className="container contact-map-block">
                    <ScrollReveal className="contact-map-block__intro" variant="right">
                        <span className="eyebrow">موقعیت دفتر</span>
                        <h2>مسیر دسترسی به دفتر فراز چمن</h2>
                        <p>{locationAddress}</p>
                        <a className="btn btn--ghost contact-map-block__link" href={mapOpenUrl} target="_blank" rel="noreferrer">
                            باز کردن در گوگل‌مپ
                            <ArrowLeft size={17} />
                        </a>
                    </ScrollReveal>
                    <ScrollReveal className="contact-map-block__canvas" delay={90} variant="scale">
                        <iframe
                            title="موقعیت دفتر فراز چمن روی نقشه"
                            src={mapEmbedUrl}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        <span className="contact-map-block__frame" aria-hidden="true" />
                    </ScrollReveal>
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}
