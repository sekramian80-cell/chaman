/**
 * محتوای منوی اصلی سایت
 * این فایل به عنوان fallback در صورت عدم دسترسی به API استفاده می‌شود
 * همچنین ساختار داده برای تطبیق با API وردپرس مشخص شده
 */

export const navItems = [
    { id: 1, label: "خانه", href: "/", path: "/" },
    { id: 2, label: "خدمات", href: "/services", path: "/services" },
    { id: 3, label: "محصولات", href: "/products", path: "/products" },
    { id: 4, label: "روند اجرا", href: "/process", path: "/process" },
    { id: 5, label: "نمونه کار", href: "/projects", path: "/projects" },
    { id: 6, label: "سوالات", href: "/faq", path: "/faq" },
];

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
    }));
}
