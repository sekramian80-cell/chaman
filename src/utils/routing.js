/**
 * تطبیق مسیر URL با صفحه و پارامترها
 */

const PROJECT_DETAIL_RE = /^\/projects\/([^/]+)\/?$/;
const PRODUCT_DETAIL_RE = /^\/product\/([^/]+)\/?$/;

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
export function resolveRoute(pathname, staticRoutes, ProjectDetailPage, HomePage, ProductDetailPage) {
    const path = pathname || '/';

    if (staticRoutes[path]) {
        return {
            path,
            Page: staticRoutes[path],
            params: {},
            isProjectDetail: false,
            isProductDetail: false,
        };
    }

    const projectMatch = path.match(PROJECT_DETAIL_RE);
    if (projectMatch) {
        return {
            path,
            Page: ProjectDetailPage,
            params: { slug: safeDecodeURIComponent(projectMatch[1]) },
            isProjectDetail: true,
            isProductDetail: false,
        };
    }

    const productMatch = ProductDetailPage ? path.match(PRODUCT_DETAIL_RE) : null;
    if (productMatch) {
        return {
            path,
            Page: ProductDetailPage,
            params: { slug: safeDecodeURIComponent(productMatch[1]) },
            isProjectDetail: false,
            isProductDetail: true,
        };
    }

    return { path: '/', Page: HomePage, params: {}, isProjectDetail: false, isProductDetail: false };
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
