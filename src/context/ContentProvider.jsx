/**
 * ContentProvider
 * Provider که داده‌ها را از طریق Context در اختیار کل اپلیکیشن قرار می‌دهد
 *
 * وقتی CONFIG.USE_API = false باشد، مستقیماً از داده‌های محلی استفاده می‌شود
 */
import { useMemo } from "react";
import { ContentContext } from "./ContentContext.jsx";
import { CONFIG } from "../config/index.js";

// محتوای محلی
import { navItems } from "../content/navigation.js";
import { heroContent, heroStats } from "../content/hero.js";
import { services, servicePlans, serviceChecklist } from "../content/services.js";
import { productHighlights, productCards } from "../content/products.js";
import { processSteps, processTimeline } from "../content/process.js";
import { projects, projectStats } from "../content/projects.js";
import { faqs, supportItems } from "../content/faq.js";
import { contactInfo, contactCTA } from "../content/contact.js";
import { trustItems } from "../content/trust.js";
import { testimonial } from "../content/testimonial.js";

export function ContentProvider({ children }) {
    const value = useMemo(
        () => ({
            navigation: { items: navItems },
            hero: { content: heroContent, stats: heroStats },
            services: { items: services, plans: servicePlans, checklist: serviceChecklist },
            products: { highlights: productHighlights, cards: productCards },
            process: { steps: processSteps, timeline: processTimeline },
            projects: { items: projects, stats: projectStats },
            faq: { items: faqs, support: supportItems },
            contact: { info: contactInfo, cta: contactCTA },
            trust: { items: trustItems },
            testimonial,
            loading: false,
            error: null,
            isFromAPI: false,
        }),
        [],
    );

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
