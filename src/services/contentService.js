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
import { mapMenuTree } from '../models/MenuItemModel.js';
import { buildWooCategoryMap, mapWooProductsFromAPI } from '../models/WooProductModel.js';
import { buildCategoryTree, groupProductsByCategory } from '../models/categoryTree.js';
import { mapProjectsFromAPI } from '../models/ProjectModel.js';
import { mapServicesFromAPI } from '../models/ServiceModel.js';
import { fetchNavigationMenu, fetchSiteMenu } from './menuService.js';
import { getCachedApiBundle, setCachedApiBundle } from '../utils/contentCache.js';
import { getCategoryPath } from '../utils/routing.js';
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
    const products = buildLocalProducts();
    return {
        navigation: {
            items: injectCategoriesIntoNav(ensureProjectsNavItem(navItems), products.tree),
        },
        hero: { content: heroContent, stats: heroStats },
        services: { items: services, plans: servicePlans, checklist: serviceChecklist },
        products,
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

/**
 * کشوی «محصولات» در منو را همیشه با دسته‌های ووکامرس پر می‌کند
 * تا کاربر لازم نباشد دسته‌ها را دستی زیر «محصولات» تودرتو کند.
 */
function injectCategoriesIntoNav(navItems = [], tree = []) {
    if (!tree.length) return navItems;

    const children = tree.map((node) => ({
        id: `cat-${node.slug}`,
        label: node.title,
        href: getCategoryPath(node.slug),
        path: getCategoryPath(node.slug),
    }));

    return navItems.map((item) => {
        const isProducts = item.path === '/products' || item.href === '/products';
        // اگر کاربر خودش زیرمنو تعریف کرده باشد، به آن دست نمی‌زنیم؛ وگرنه دسته‌ها را می‌گذاریم.
        if (isProducts && !item.children?.length) return { ...item, children };
        return item;
    });
}

function buildContentFromApiBundle(bundle, local) {
    const serviceItems = bundle.serviceItems || [];
    const productItems = bundle.productItems || [];
    const wooCategories = bundle.wooCategories || [];
    const projectItems = bundle.projectItems || [];
    const faqItems = bundle.faqItems || [];
    const menuItems = bundle.menuItems || [];
    const categoryMap = buildWooCategoryMap(wooCategories);

    const productsState = buildProductsState(productItems, wooCategories, categoryMap, local.products);
    // اگر فهرست وردپرس آمده، دقیقاً همان نمایش داده می‌شود؛ وگرنه fallback محلی.
    const navBase = menuItems.length ? menuItems : ensureProjectsNavItem(local.navigation.items);

    return {
        ...local,
        navigation: {
            items: injectCategoriesIntoNav(navBase, productsState.tree),
        },
        services: {
            ...local.services,
            items: mergeServices(serviceItems, local.services.items),
        },
        products: productsState,
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
    // منوی سبک و مستقل را اول و سریع می‌گیریم تا نوار ناوبری فوری با فهرست وردپرس درست شود.
    let menuItems = await fetchSiteMenu().catch(() => []);
    if (onPartial && menuItems.length) {
        onPartial(buildContentFromApiBundle({ menuItems }, local));
    }

    // کاتالوگ: محصولات + دسته‌ها (+ منو به‌عنوان fallback در صورت نبودِ site-menu)
    const catalog = useWoo ? await getWooCatalog() : { products: [], categories: [], menu: [] };
    const productItems = catalog.products;
    const wooCategories = catalog.categories;

    if (!menuItems.length) menuItems = mapMenuTree(catalog.menu || []);
    if (!menuItems.length) menuItems = await fetchNavigationMenu().catch(() => []);

    // آپدیت زودهنگام: محصولات + منو را فوری نمایش بده؛ بقیه بخش‌ها فعلاً محلی می‌مانند تا برسند.
    if (onPartial) {
        onPartial(buildContentFromApiBundle({ productItems, wooCategories, menuItems }, local));
    }

    // مرحلهٔ ۲: بخش‌های کندتر؛ خطا/۴۰۴/تایم‌اوت هرکدام نباید بقیه را از کار بیندازد.
    const [serviceItems, projectItems, faqItems] = await Promise.all([
        getCustomPosts('service').catch(() => []),
        getCustomPosts('project').catch(() => []),
        getCustomPosts('faq').catch(() => []),
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
