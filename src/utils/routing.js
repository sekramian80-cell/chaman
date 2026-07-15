/**
 * تطبیق مسیر URL با صفحه و پارامترها
 */

const PROJECT_DETAIL_RE = /^\/projects\/([^/]+)\/?$/;

/**
 * @param {string} pathname
 * @param {Record<string, import('react').ComponentType>} staticRoutes
 * @param {import('react').ComponentType} ProjectDetailPage
 * @param {import('react').ComponentType} HomePage
 */
export function resolveRoute(pathname, staticRoutes, ProjectDetailPage, HomePage) {
    if (staticRoutes[pathname]) {
        return { path: pathname, Page: staticRoutes[pathname], params: {} };
    }

    const projectMatch = pathname.match(PROJECT_DETAIL_RE);
    if (projectMatch) {
        return {
            path: pathname,
            Page: ProjectDetailPage,
            params: { slug: decodeURIComponent(projectMatch[1]) },
        };
    }

    return { path: '/', Page: HomePage, params: {} };
}

/**
 * آیا مسیر مربوط به جزئیات نمونه کار است؟
 */
export function isProjectDetailPath(pathname = '') {
    return PROJECT_DETAIL_RE.test(pathname);
}

/**
 * استخراج اسلاگ نمونه کار از مسیر
 */
export function getProjectSlugFromPath(pathname = '') {
    const match = pathname.match(PROJECT_DETAIL_RE);
    return match ? decodeURIComponent(match[1]) : '';
}
