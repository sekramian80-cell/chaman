/**
 * محتوای منوی اصلی سایت (fallback)
 */

import { mapMenuTree } from '../models/MenuItemModel.js';

export const navItems = [
    { id: 1, label: "خانه", href: "/", path: "/" },
    { id: 2, label: "خدمات", href: "/services", path: "/services" },
    {
        id: 3,
        label: "محصولات",
        href: "/products",
        path: "/products",
        children: [
            { id: 31, label: "چمن مصنوعی ورزشی", href: "/products/sports", path: "/products/sports" },
            { id: 32, label: "چمن مصنوعی تزیینی", href: "/products/decorative", path: "/products/decorative" },
        ],
    },
    {
        id: 4,
        label: "روند اجرا",
        href: "/process",
        path: "/process",
    },
    { id: 5, label: "نمونه کارها", href: "/projects", path: "/projects" },
    { id: 6, label: "تماس با ما", href: "/contact", path: "/contact" },
];

/**
 * آیا مسیر فعلی با آیتم منو (یا زیرمنوهایش) مطابقت دارد؟
 */
export function isNavItemActive(item, currentPath) {
    if (currentPath === item.path) return true;
    return item.children?.some((child) => child.path === currentPath) ?? false;
}

/**
 * نگاشت منوی وردپرس (سازگاری با نسخه‌های قبلی)
 */
export function mapMenuFromAPI(apiItems = []) {
    const items = mapMenuTree(apiItems);
    return ensureProjectsNavItem(items.length ? items : navItems);
}

/**
 * مطمئن می‌شود آیتم «نمونه کارها» در منو باشد
 */
export function ensureProjectsNavItem(items = []) {
    const list = items.map((item) => {
        if (item.path === '/projects' || item.label?.includes('نمونه کار')) {
            return { ...item, label: 'نمونه کارها', href: '/projects', path: '/projects' };
        }
        return item;
    });

    const hasProjects = list.some((item) => item.path === '/projects');
    if (hasProjects) return list;

    const contactIndex = list.findIndex((item) => item.path === '/contact');
    const projectsItem = {
        id: 'nav-projects',
        label: 'نمونه کارها',
        href: '/projects',
        path: '/projects',
    };

    if (contactIndex >= 0) {
        return [...list.slice(0, contactIndex), projectsItem, ...list.slice(contactIndex)];
    }

    return [...list, projectsItem];
}
