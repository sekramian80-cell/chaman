/**
 * ساخت مسیر بردکرامب بر اساس URL و داده محتوا
 */
import { findProjectBySlug } from '../models/ProjectModel.js';
import { getProjectSlugFromPath, isProjectDetailPath } from './routing.js';

const pathLabels = {
    '/': 'خانه',
    '/services': 'خدمات',
    '/products': 'محصولات',
    '/products/sports': 'چمن مصنوعی ورزشی',
    '/products/decorative': 'چمن مصنوعی تزیینی',
    '/process': 'روند اجرا',
    '/projects': 'نمونه کارها',
    '/faq': 'سوالات پرتکرار',
    '/contact': 'تماس با ما',
};

/**
 * @param {string} currentPath
 * @param {{ projects?: { items?: Array<{ slug?: string, id?: number|string, title?: string }> } }} [content]
 */
export function buildBreadcrumbs(currentPath, content = {}) {
    if (!currentPath || currentPath === '/') {
        return [];
    }

    const crumbs = [{ label: 'خانه', href: '/' }];

    if (isProjectDetailPath(currentPath)) {
        const slug = getProjectSlugFromPath(currentPath);
        const project = findProjectBySlug(content.projects?.items || [], slug);

        crumbs.push({ label: 'نمونه کارها', href: '/projects' });
        crumbs.push({
            label: project?.title || slug || 'جزئیات پروژه',
            href: currentPath,
        });
        return crumbs;
    }

    if (currentPath.startsWith('/products/')) {
        crumbs.push({ label: 'محصولات', href: '/products' });
        crumbs.push({
            label: pathLabels[currentPath] || 'محصولات',
            href: currentPath,
        });
        return crumbs;
    }

    crumbs.push({
        label: pathLabels[currentPath] || currentPath.replace(/^\//, ''),
        href: currentPath,
    });

    return crumbs;
}
