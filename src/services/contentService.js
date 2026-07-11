/**
 * محتوای محلی (fallback) و دریافت داده از وردپرس
 */
import { navItems } from '../content/navigation.js';
import { heroContent, heroStats } from '../content/hero.js';
import { services, servicePlans, serviceChecklist } from '../content/services.js';
import { productHighlights, productCards } from '../content/products.js';
import { processSteps, processTimeline } from '../content/process.js';
import { projects, projectStats } from '../content/projects.js';
import { faqs, supportItems } from '../content/faq.js';
import { contactInfo, contactCTA } from '../content/contact.js';
import { trustItems } from '../content/trust.js';
import { testimonial } from '../content/testimonial.js';
import { CONFIG } from '../config/index.js';
import { mapFaqsFromAPI } from '../models/FaqModel.js';
import { mapProductsFromAPI } from '../models/ProductModel.js';
import { mapProjectsFromAPI } from '../models/ProjectModel.js';
import { mapServicesFromAPI } from '../models/ServiceModel.js';
import { getCustomPosts } from './wordpress.js';

export function getLocalContent() {
    return {
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
    };
}

function useApiSection(apiItems, localItems) {
    return apiItems.length > 0 ? apiItems : localItems;
}

/**
 * دریافت محتوای سایت از وردپرس و ترکیب با fallback محلی
 */
export async function fetchSiteContent() {
    const local = getLocalContent();

    const [serviceItems, productItems, projectItems, faqItems] = await Promise.all([
        getCustomPosts('service'),
        getCustomPosts('product'),
        getCustomPosts('project'),
        getCustomPosts('faq'),
    ]);

    return {
        ...local,
        services: {
            ...local.services,
            items: useApiSection(mapServicesFromAPI(serviceItems), local.services.items),
        },
        products: {
            ...local.products,
            cards: useApiSection(mapProductsFromAPI(productItems), local.products.cards),
        },
        projects: {
            ...local.projects,
            items: useApiSection(mapProjectsFromAPI(projectItems), local.projects.items),
        },
        faq: {
            ...local.faq,
            items: useApiSection(mapFaqsFromAPI(faqItems), local.faq.items),
        },
        isFromAPI: CONFIG.USE_API,
    };
}
