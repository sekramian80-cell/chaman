/**
 * محتوای محلی (fallback) و دریافت داده از وردپرس
 */
import { ensureProjectsNavItem, navItems } from '../content/navigation.js';
import { heroContent, heroStats } from '../content/hero.js';
import { services, servicePlans, serviceChecklist } from '../content/services.js';
import { productCategoryConfig } from '../content/productCategories.js';
import { productHighlights, sportsProducts, decorativeProducts } from '../content/products.js';
import { processSteps, processTimeline } from '../content/process.js';
import { projects, projectStats } from '../content/projects.js';
import { faqs, supportItems } from '../content/faq.js';
import { contactInfo, contactCTA } from '../content/contact.js';
import { trustItems } from '../content/trust.js';
import { testimonial } from '../content/testimonial.js';
import { CONFIG } from '../config/index.js';
import { mapFaqsFromAPI } from '../models/FaqModel.js';
import { filterProductsByCategory } from '../models/ProductModel.js';
import { buildWooCategoryMap, mapWooProductsFromAPI } from '../models/WooProductModel.js';
import { mapProjectsFromAPI } from '../models/ProjectModel.js';
import { mapServicesFromAPI } from '../models/ServiceModel.js';
import { fetchNavigationMenu } from './menuService.js';
import { getCachedApiBundle, setCachedApiBundle } from '../utils/contentCache.js';
import { getCustomPosts } from './wordpress.js';
import { getWooCatalog } from './woocommerce.js';

export function getLocalContent() {
    return {
        navigation: { items: ensureProjectsNavItem(navItems) },
        hero: { content: heroContent, stats: heroStats },
        services: { items: services, plans: servicePlans, checklist: serviceChecklist },
        products: {
            highlights: productHighlights,
            byCategory: {
                sports: sportsProducts,
                decorative: decorativeProducts,
            },
            categories: productCategoryConfig,
            cards: [...sportsProducts, ...decorativeProducts],
        },
        process: { steps: processSteps, timeline: processTimeline },
        projects: { items: projects, stats: projectStats },
        faq: { items: faqs, support: supportItems },
        contact: { info: contactInfo, cta: contactCTA },
        trust: { items: trustItems },
        testimonial,
    };
}

function mergeServices(apiItems, localItems) {
    const mapped = mapServicesFromAPI(apiItems);
    if (!mapped.length) return localItems;

    const apiTitles = new Set(mapped.map((item) => item.title.trim()));
    const extras = localItems.filter((item) => !apiTitles.has(item.title.trim()));

    return [...mapped, ...extras];
}

function useApiSection(apiItems, localItems) {
    return apiItems.length > 0 ? apiItems : localItems;
}

function buildProductsState(apiItems, localProducts, categoryMap) {
    const mapped = mapWooProductsFromAPI(apiItems, categoryMap);
    const hasApiProducts = mapped.length > 0;

    const sports = hasApiProducts
        ? filterProductsByCategory(mapped, 'sports')
        : localProducts.byCategory.sports;
    const decorative = hasApiProducts
        ? filterProductsByCategory(mapped, 'decorative')
        : localProducts.byCategory.decorative;

    return {
        highlights: localProducts.highlights,
        categories: localProducts.categories,
        byCategory: {
            sports: sports.length ? sports : localProducts.byCategory.sports,
            decorative: decorative.length ? decorative : localProducts.byCategory.decorative,
        },
        cards: [
            ...(sports.length ? sports : localProducts.byCategory.sports),
            ...(decorative.length ? decorative : localProducts.byCategory.decorative),
        ],
    };
}

function buildContentFromApiBundle(bundle, local) {
    const serviceItems = bundle.serviceItems || [];
    const productItems = bundle.productItems || [];
    const wooCategories = bundle.wooCategories || [];
    const projectItems = bundle.projectItems || [];
    const faqItems = bundle.faqItems || [];
    const menuItems = bundle.menuItems || [];
    const categoryMap = buildWooCategoryMap(wooCategories);

    return {
        ...local,
        navigation: {
            items: ensureProjectsNavItem(menuItems.length ? menuItems : local.navigation.items),
        },
        services: {
            ...local.services,
            items: mergeServices(serviceItems, local.services.items),
        },
        products: buildProductsState(productItems, local.products, categoryMap),
        projects: {
            ...local.projects,
            items: useApiSection(mapProjectsFromAPI(projectItems), local.projects.items),
        },
        faq: {
            ...local.faq,
            items: useApiSection(mapFaqsFromAPI(faqItems), local.faq.items),
        },
        isFromAPI: true,
    };
}

/**
 * اگر کش موجود باشد، محتوای ترکیب‌شده را برمی‌گرداند
 * @param {{ allowStale?: boolean }} [options]
 * @returns {{ content: object, fresh: boolean } | null}
 */
export function getCachedSiteContent(options = {}) {
    const cached = getCachedApiBundle({ allowStale: Boolean(options.allowStale) });
    if (!cached?.payload) return null;

    return {
        content: buildContentFromApiBundle(cached.payload, getLocalContent()),
        fresh: Boolean(cached.fresh),
    };
}

/**
 * دریافت محتوای سایت از وردپرس و ترکیب با fallback محلی
 * @param {{ force?: boolean }} [options] force=true همیشه شبکه می‌زند (برای SWR)
 */
export async function fetchSiteContent(options = {}) {
    const local = getLocalContent();
    const force = Boolean(options.force);
    const onPartial = typeof options.onPartial === 'function' ? options.onPartial : null;

    if (!force) {
        const cached = getCachedApiBundle();
        if (cached?.payload) {
            return buildContentFromApiBundle(cached.payload, local);
        }
    }

    const useWoo = Boolean(CONFIG.WC?.ENABLED);

    // مرحلهٔ ۱ (بحرانی): محصولات و دسته‌ها را در «یک درخواست واحد» می‌گیریم تا با
    // endpointهای کندِ دیگر رقابت نکنند (روی هاست کند، درخواست همزمان = timeout).
    const catalog = useWoo ? await getWooCatalog() : { products: [], categories: [] };
    const productItems = catalog.products;
    const wooCategories = catalog.categories;

    // آپدیت زودهنگام: محصولات را فوری نمایش بده؛ بقیه بخش‌ها فعلاً محلی می‌مانند تا برسند.
    if (onPartial) {
        onPartial(buildContentFromApiBundle({ productItems, wooCategories }, local));
    }

    // مرحلهٔ ۲: بقیهٔ بخش‌ها؛ خطا/۴۰۴/تایم‌اوت هرکدام نباید بقیه را از کار بیندازد.
    const [serviceItems, projectItems, faqItems, menuItems] = await Promise.all([
        getCustomPosts('service').catch(() => []),
        getCustomPosts('project').catch(() => []),
        getCustomPosts('faq').catch(() => []),
        fetchNavigationMenu().catch(() => []),
    ]);

    const payload = {
        serviceItems,
        productItems,
        wooCategories,
        projectItems,
        faqItems,
        menuItems,
    };

    setCachedApiBundle(payload);

    return buildContentFromApiBundle(payload, local);
}
