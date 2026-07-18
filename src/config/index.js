/**
 * تنظیمات اصلی پروژه
 * تمام مقادیر قابل تنظیم در این فایل متمرکز شده‌اند
 */

export const CONFIG = {
    /** آدرس پایه API وردپرس */
    API_BASE_URL: "https://api.farazchaman.ir/wp-json/wp/v2",

    /** تنظیمات WooCommerce (Store API عمومی + انتقال سبد به checkout) */
    WC: {
        /** فعال‌سازی خواندن محصولات از WooCommerce Store API */
        ENABLED: true,
        /** پایهٔ Store API عمومی ووکامرس (بدون consumer key) */
        STORE_URL: "https://api.farazchaman.ir/wp-json/wc/store/v1",
        /** اوریجین سایت ووکامرس (برای لینک‌ها و checkout) */
        SHOP_ORIGIN: "https://api.farazchaman.ir",
        /** endpoint انتقال سبد از React به سشن first-party ووکامرس و ریدایرکت به پرداخت */
        HANDOFF_URL: "https://api.farazchaman.ir/wp-json/faraz/v1/checkout-handoff",
        /** تایم‌اوت مخصوص Store API (محصولات ممکن است کندتر از بقیه باشند) */
        TIMEOUT: 20000,
    },

    /** تنظیمات درخواست‌ها */
    REQUEST: {
        TIMEOUT: 10000, // 10 ثانیه
        RETRY_COUNT: 2,
        RETRY_DELAY: 1000, // 1 ثانیه
    },

    /** تنظیمات صفحه‌بندی */
    PAGINATION: {
        DEFAULT_PER_PAGE: 10,
        MAX_PER_PAGE: 100,
    },

    /** فعال‌سازی دریافت داده از API وردپرس (در صورت false فقط از داده‌های محلی استفاده می‌شود) */
    USE_API: true,

    /** تنظیمات کش */
    CACHE: {
        ENABLED: true,
        TTL: 5 * 60 * 1000, // 5 دقیقه — بعد از TTL با SWR در پس‌زمینه تازه می‌شود
    },

    /** مانیتورینگ سبک کلاینت */
    MONITORING: {
        /** اگر خالی باشد فقط در console/session ذخیره می‌شود */
        ENDPOINT: '',
        LOG_TO_CONSOLE: true,
    },

    /** تنظیمات تصاویر */
    IMAGES: {
        LAZY_LOAD: true,
        PLACEHOLDER_COLOR: "#0d2412", // رنگ پس‌زمینه دارک
    },

    /** تنظیمات منوی وردپرس */
    MENU: {
        LOCATION: "primary",
        SLUG: "منوی-اصلی",
    },
};
