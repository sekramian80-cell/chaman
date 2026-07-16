import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { contactCTA } from '../content/contact.js';
import { ScrollReveal } from './ScrollReveal.jsx';

export function ContactCTA() {
  return (
    <section id="contact" className="contact-cta contact-cta--premium">
      <div className="contact-cta__glow" aria-hidden="true" />
      <div className="container contact-cta__inner">
        <ScrollReveal>
          <span className="eyebrow">{contactCTA.eyebrow}</span>
          <h2>{contactCTA.title}</h2>
          <p>{contactCTA.description}</p>
        </ScrollReveal>

        <ScrollReveal className="contact-cta__actions" delay={80}>
          <a className="btn btn--primary" href={contactCTA.primaryCta.href}>
            <Phone size={18} />
            {contactCTA.primaryCta.label}
          </a>
          <a className="btn btn--light" href={contactCTA.secondaryCta.href}>
            <MessageCircle size={18} />
            {contactCTA.secondaryCta.label}
            <ArrowLeft size={17} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
