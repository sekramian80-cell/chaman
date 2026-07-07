import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';

export function ContactCTA() {
  return (
    <section id="contact" className="contact-cta">
      <div className="container contact-cta__inner">
        <div>
          <span className="eyebrow">شروع پروژه</span>
          <h2>برای فضای شما چه مدل چمنی مناسب‌تر است؟</h2>
          <p>
            متراژ، محل اجرا و چند عکس از فضا را بفرستید تا پیشنهاد اولیه و بازه قیمت
            دقیق‌تری دریافت کنید.
          </p>
        </div>

        <div className="contact-cta__actions">
          <a className="btn btn--primary" href="tel:+989120000000">
            <Phone size={18} />
            تماس مستقیم
          </a>
          <a className="btn btn--light" href="https://wa.me/989120000000">
            <MessageCircle size={18} />
            پیام در واتساپ
            <ArrowLeft size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
