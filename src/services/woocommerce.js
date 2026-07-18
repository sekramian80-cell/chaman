/**
 * سرویس دادهٔ محصولات ووکامرس
 *
 * دو منبع:
 *   1) endpoint سریع سفارشی faraz/v1 (اسنیپت faraz-fast-products.php) — پیش‌فرض
 *   2) WooCommerce Store API (wc/store/v1) — fallback در صورت نبودِ endpoint سریع
 *
 * خروجی هر دو هم‌شکل است، پس mapWooProductsFromAPI بدون تغییر روی هر دو کار می‌کند.
 */
import { CONFIG } from '../config/index.js';

const STORE_URL = CONFIG.WC.STORE_URL.replace(/\/$/, '');
const FAST_URL = (CONFIG.WC.FAST_URL || '').replace(/\/$/, '');
const USE_FAST = Boolean(CONFIG.WC.FAST_API && FAST_URL);

// فیلدهای موردنیاز از Store API (برای سبک‌کردن پاسخ کند)
const PRODUCT_FIELDS = [
    'id',
    'name',
    'slug',
    'permalink',
    'sku',
    'short_description',
    'description',
    'prices',
    'images',
    'categories',
    'is_in_stock',
].join(',');

/**
 * GET عمومی به یک URL کامل و برگرداندن { data, totalPages }
 */
async function httpGet(baseUrl, path, params = {}) {
    const url = new URL(`${baseUrl}/${path}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    });

    url.searchParams.set('_', Date.now().toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        CONFIG.WC?.TIMEOUT || CONFIG.REQUEST.TIMEOUT,
    );

    try {
        const response = await fetch(url.toString(), {
            signal: controller.signal,
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
        }

        const totalPages = Number(response.headers.get('X-WP-TotalPages') || '1') || 1;
        const raw = await response.json();

        return { data: Array.isArray(raw) ? raw : [], raw, totalPages };
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('درخواست محصولات با خطای تایم‌اوت مواجه شد');
        }

        throw error;
    }
}

async function fetchProductsFromStoreApi(perPage) {
    const first = await httpGet(STORE_URL, 'products', {
        per_page: perPage,
        page: 1,
        _fields: PRODUCT_FIELDS,
    });
    const items = [...first.data];

    for (let page = 2; page <= first.totalPages; page += 1) {
        if (page > 20) break;
        const next = await httpGet(STORE_URL, 'products', {
            per_page: perPage,
            page,
            _fields: PRODUCT_FIELDS,
        });
        items.push(...next.data);
    }

    return items;
}

/**
 * دریافت محصولات + دسته‌ها در «یک درخواست واحد» (faraz/v1/catalog).
 * روی هاست‌های کند، چند درخواست همزمان همدیگر را timeout می‌کنند؛ پس مسیر بحرانی
 * را به یک درخواست کاهش می‌دهیم. اگر endpoint نبود، به‌صورت «ترتیبی» (نه موازی) fallback می‌کنیم.
 * @returns {Promise<{ products: Array, categories: Array }>}
 */
export async function getWooCatalog() {
    if (USE_FAST) {
        try {
            const { raw } = await httpGet(FAST_URL, 'catalog');
            if (raw && Array.isArray(raw.products)) {
                return {
                    products: raw.products,
                    categories: Array.isArray(raw.categories) ? raw.categories : [],
                };
            }
        } catch {
            // fallback در ادامه
        }
    }

    // fallback ترتیبی: اول دسته‌ها، بعد محصولات (بدون رقابت همزمان)
    const categories = await getWooCategories().catch(() => []);
    const products = await getWooProducts().catch(() => []);
    return { products, categories };
}

/**
 * دریافت دسته‌بندی‌های محصول (اسلاگ‌ها برای تشخیص ورزشی/تزیینی)
 */
export async function getWooCategories() {
    if (USE_FAST) {
        try {
            const { data } = await httpGet(FAST_URL, 'product-categories');
            if (data.length) return data;
        } catch {
            // fallback به Store API
        }
    }

    const { data } = await httpGet(STORE_URL, 'products/categories', { per_page: 100 });
    return data;
}

/**
 * دریافت همهٔ محصولات
 */
export async function getWooProducts(options = {}) {
    const perPage = Math.min(options.perPage ?? 100, 100);

    if (USE_FAST) {
        try {
            const { data } = await httpGet(FAST_URL, 'products', { per_page: perPage });
            return data;
        } catch {
            // fallback به Store API
        }
    }

    return fetchProductsFromStoreApi(perPage);
}

/**
 * دریافت یک محصول با اسلاگ
 */
export async function getWooProductBySlug(slug) {
    if (!slug) return null;

    if (USE_FAST) {
        try {
            const { data } = await httpGet(FAST_URL, 'products', { slug });
            if (data.length) return data[0];
        } catch {
            // fallback در ادامه
        }
    }

    try {
        const { data } = await httpGet(STORE_URL, 'products', {
            slug,
            per_page: 1,
            _fields: PRODUCT_FIELDS,
        });
        if (data.length) return data[0];
    } catch {
        // در نهایت از لیست کامل پیدا می‌کنیم
    }

    const all = await getWooProducts();
    return all.find((item) => item.slug === slug) || null;
}
