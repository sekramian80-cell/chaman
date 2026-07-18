/**
 * محتوای محلی (fallback) و دریافت داده از وردپرس
 */
import { ensureProjectsNavItem, navItems } from '../content/navigation.js';
import { heroContent, heroStats } from '../content/hero.js';
import { services, servicePlans, serviceChecklist } from '../content/services.js';
import { productCategoryConfig } from '../content/productCategories.js';
import { mainCategorySlugs, productSubcategories } from '../content/productSubcategories.js';
import { productHighlights, sportsProducts, decorativeProducts } from '../content/products.js';
import { processSteps, processTimeline } from '../content/process.js';
import { projects, projectStats } from '../content/projects.js';
import { faqs, supportItems } from '../content/faq.js';
import { contactInfo, contactCTA } from '../content/contact.js';
import { trustItems } from '../content/trust.js';
import { testimonial } from '../content/testimonial.js';
import { CONFIG } from '../config/index.js';
import { mapFaqsFromAPI } from '../models/FaqModel.js';
import { buildWooCategoryMap, mapWooProductsFromAPI } from '../models/WooProductModel.js';
import { buildCategoryTree, groupProductsByCategory } from '../models/categoryTree.js';
import { mapProjectsFromAPI } from '../models/ProjectModel.js';
import { mapServicesFromAPI } from '../models/ServiceModel.js';
import { fetchNavigationMenu } from './menuService.js';
import { getCachedApiBundle, setCachedApiBundle } from '../utils/contentCache.js';
import { getCustomPosts } from './wordpress.js';
import { getWooCatalog } from './woocommerce.js';

function buildLocalProducts() {
    const cards = [...sportsProducts, ...decorativeProducts];
    const cats = getLocalWooCategories();
    const byCategory = groupProductsByCategory(cards, buildWooCategoryMap(cats));

    return {
        highlights: productHighlights,
        categories: productCategoryConfig,
        tree: buildCategoryTree(cats, byCategory),
        byCategory,
        cards,
    };
}

export function getLocalContent() {
    return {
        navigation: { items: ensureProjectsNavItem(navItems) },
        hero: { content: heroContent, stats: heroStats },
        services: { items: services, plans: servicePlans, checklist: serviceChecklist },
        products: buildLocalProducts(),
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

// دسته‌های محلیِ ساختگی برای fallback (وقتی API محصولی ندارد)
function getLocalWooCategories() {
    const cats = [];
    let id = 9000;
    mainCategorySlugs.forEach((parentSlug) => {
        const parentId = id + 1;
        id += 1;
        cats.push({
            id: parentId,
            name: productCategoryConfig[parentSlug]?.title || parentSlug,
            slug: parentSlug,
            parent: 0,
        });
        (productSubcategories[parentSlug] || []).forEach((sub) => {
            id += 1;
            cats.push({ id, name: sub.label, slug: sub.slug, parent: parentId });
        });
    });
    return cats;
}

function buildProductsState(apiItems, wooCategories, categoryMap, localProducts) {
    const mapped = mapWooProductsFromAPI(apiItems, categoryMap);
    const hasApiProducts = mapped.length > 0;

    const products = hasApiProducts ? mapped : localProducts.cards;
    const cats = hasApiProducts ? wooCategories : getLocalWooCategories();
    const map = hasApiProducts ? categoryMap : buildWooCategoryMap(cats);

    const byCategory = groupProductsByCategory(products, map);
    const tree = buildCategoryTree(cats, byCategory);

    return {
        highlights: localProducts.highlights,
        categories: localProducts.categories,
        tree,
        byCategory,
        cards: products,
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
        products: buildProductsState(productItems, wooCategories, categoryMap, local.products),
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
