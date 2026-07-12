/**
 * محتوای منوی اصلی سایت
 * این فایل به عنوان fallback در صورت عدم دسترسی به API استفاده می‌شود
 */

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
    { id: 5, label: "نمونه کار", href: "/projects", path: "/projects" },
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
 * نگاشت منو به داده‌های API وردپرس
 * @param {Array} apiItems - آیتم‌های منو از API
 * @returns {Array} - فرمت استاندارد شده
 */
export function mapMenuFromAPI(apiItems = []) {
    if (!apiItems.length) return navItems;

    return apiItems.map((item) => ({
        id: item.id,
        label: item.title?.rendered || item.title,
        href: item.url || `/${item.slug}`,
        path: item.slug ? `/${item.slug}` : "/",
        children: item.children?.map((child) => ({
            id: child.id,
            label: child.title?.rendered || child.title,
            href: child.url || `/${child.slug}`,
            path: child.slug ? `/${child.slug}` : "/",
        })),
    }));
}
