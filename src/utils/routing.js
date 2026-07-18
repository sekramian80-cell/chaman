/**
 * تطبیق مسیر URL با صفحه و پارامترها
 */

const PROJECT_DETAIL_RE = /^\/projects\/([^/]+)\/?$/;
const PRODUCT_DETAIL_RE = /^\/product\/([^/]+)\/?$/;
const PRODUCT_CATEGORY_RE = /^\/products\/([^/]+)\/?$/;

/**
 * decode امن برای بخش اسلاگ URL
 */
export function safeDecodeURIComponent(value = '') {
    if (!value) return '';
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

/**
 * نرمال‌سازی اسلاگ برای مقایسه
 */
export function normalizeProjectKey(value = '') {
    return safeDecodeURIComponent(String(value)).trim().toLowerCase();
}

/**
 * @param {string} pathname
 * @param {Record<string, import('react').ComponentType>} staticRoutes
 * @param {import('react').ComponentType} ProjectDetailPage
 * @param {import('react').ComponentType} HomePage
 * @param {import('react').ComponentType} [ProductDetailPage]
 */
export function resolveRoute(
    pathname,
    staticRoutes,
    ProjectDetailPage,
    HomePage,
    ProductDetailPage,
    ProductCategoryPage,
) {
    const path = pathname || '/';

    const base = { isProjectDetail: false, isProductDetail: false, isProductCategory: false };

    if (staticRoutes[path]) {
        return { ...base, path, Page: staticRoutes[path], params: {} };
    }

    const projectMatch = path.match(PROJECT_DETAIL_RE);
    if (projectMatch) {
        return {
            ...base,
            path,
            Page: ProjectDetailPage,
            params: { slug: safeDecodeURIComponent(projectMatch[1]) },
            isProjectDetail: true,
        };
    }

    const productMatch = ProductDetailPage ? path.match(PRODUCT_DETAIL_RE) : null;
    if (productMatch) {
        return {
            ...base,
            path,
            Page: ProductDetailPage,
            params: { slug: safeDecodeURIComponent(productMatch[1]) },
            isProductDetail: true,
        };
    }

    const categoryMatch = ProductCategoryPage ? path.match(PRODUCT_CATEGORY_RE) : null;
    if (categoryMatch) {
        return {
            ...base,
            path,
            Page: ProductCategoryPage,
            params: { slug: safeDecodeURIComponent(categoryMatch[1]) },
            isProductCategory: true,
        };
    }

    return { ...base, path: '/', Page: HomePage, params: {} };
}

/**
 * آیا مسیر مربوط به جزئیات نمونه کار است؟
 */
export function isProjectDetailPath(pathname = '') {
    return PROJECT_DETAIL_RE.test(pathname);
}

/**
 * استخراج اسلاگ/شناسه نمونه کار از مسیر
 */
export function getProjectSlugFromPath(pathname = '') {
    const match = pathname.match(PROJECT_DETAIL_RE);
    return match ? safeDecodeURIComponent(match[1]) : '';
}

/**
 * ساخت مسیر جزئیات نمونه کار
 */
export function getProjectDetailPath(project) {
    if (!project) return '/projects';
    const key = project.slug || project.id;
    if (!key && key !== 0) return '/projects';
    return `/projects/${encodeURIComponent(String(key))}`;
}

/**
 * آیا مسیر مربوط به جزئیات محصول است؟
 */
export function isProductDetailPath(pathname = '') {
    return PRODUCT_DETAIL_RE.test(pathname);
}

/**
 * استخراج اسلاگ محصول از مسیر
 */
export function getProductSlugFromPath(pathname = '') {
    const match = pathname.match(PRODUCT_DETAIL_RE);
    return match ? safeDecodeURIComponent(match[1]) : '';
}

/**
 * ساخت مسیر جزئیات محصول
 */
export function getProductDetailPath(product) {
    if (!product) return '/products';
    const key = product.slug || product.id;
    if (!key && key !== 0) return '/products';
    return `/product/${encodeURIComponent(String(key))}`;
}

/**
 * آیا مسیر مربوط به یک دستهٔ محصول است؟ (/products/<slug>)
 */
export function isProductCategoryPath(pathname = '') {
    return PRODUCT_CATEGORY_RE.test(pathname);
}

/**
 * استخراج اسلاگ دسته از مسیر
 */
export function getCategorySlugFromPath(pathname = '') {
    const match = pathname.match(PRODUCT_CATEGORY_RE);
    return match ? safeDecodeURIComponent(match[1]) : '';
}

/**
 * ساخت مسیر صفحهٔ دسته
 */
export function getCategoryPath(slug) {
    if (!slug) return '/products';
    return `/products/${encodeURIComponent(String(slug))}`;
}
