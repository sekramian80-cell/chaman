import { trustItems } from '../data/content.js';

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="مزیت‌های کلیدی">
      {trustItems.map((item) => {
        const Icon = item.icon;

        return (
          <div className="trust-strip__item" key={item.label}>
            <Icon size={22} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </section>
  );
}
