import { ChevronDown } from "lucide-react";
import { faqs } from "../content/faq.js";
import { ScrollReveal } from "./ScrollReveal.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function FAQ() {
    return (
        <section id="faq" className="section section--warm">
            <div className="container faq-layout">
                <SectionHeader
                    eyebrow="سوالات متداول"
                    title="قبل از انتخاب چمن مصنوعی بهتر است این‌ها را بدانید"
                    description="پاسخ‌های کوتاه برای تصمیم‌گیری سریع‌تر؛ جزئیات دقیق‌تر بعد از بازدید و بررسی شرایط فضا مشخص می‌شود."
                />

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <ScrollReveal delay={index * 70} key={faq.question}>
                            <details className="faq-item">
                                <summary>
                                    {faq.question}
                                    <ChevronDown size={20} />
                                </summary>
                                <p>{faq.answer}</p>
                            </details>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
