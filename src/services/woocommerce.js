/**
 * سرویس WooCommerce Store API
 * خواندن عمومی محصولات و دسته‌بندی‌ها (بدون consumer key)
 * الگوی fetch مطابق api.js و menuService.js
 */
import { CONFIG } from '../config/index.js';

const STORE_URL = CONFIG.WC.STORE_URL.replace(/\/$/, '');

/**
 * درخواست GET به Store API و برگرداندن { data, totalPages }
 * @param {string} path مسیر نسبی مثل 'products'
 * @param {Object} params پارامترهای query
 */
async function storeGet(path, params = {}) {
    const url = new URL(`${STORE_URL}/${path}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    });

    // جلوگیری از کش تا تازه‌ترین داده ووکامرس دریافت شود
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
        const data = await response.json();

        return { data: Array.isArray(data) ? data : [], totalPages };
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('درخواست به ووکامرس با خطای تایم‌اوت مواجه شد');
        }

        throw error;
    }
}

/**
 * دریافت همهٔ دسته‌بندی‌های محصول از ووکامرس
 * @returns {Promise<Array<{id:number,name:string,slug:string,parent:number,count:number}>>}
 */
export async function getWooCategories() {
    const { data } = await storeGet('products/categories', { per_page: 100 });
    return data;
}

/**
 * دریافت همهٔ محصولات (با پیمایش صفحات)
 * @param {{ perPage?: number }} [options]
 * @returns {Promise<Array<Object>>}
 */
export async function getWooProducts(options = {}) {
    const perPage = Math.min(options.perPage ?? 100, 100);

    const first = await storeGet('products', { per_page: perPage, page: 1 });
    const items = [...first.data];

    for (let page = 2; page <= first.totalPages; page += 1) {
        // برای جلوگیری از حلقهٔ طولانی، سقف منطقی صفحات رعایت می‌شود
        if (page > 20) break;
        const next = await storeGet('products', { per_page: perPage, page });
        items.push(...next.data);
    }

    return items;
}

/**
 * دریافت یک محصول با اسلاگ (برای صفحهٔ جزئیات و دیپ‌لینک)
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getWooProductBySlug(slug) {
    if (!slug) return null;

    // Store API از فیلتر slug پشتیبانی می‌کند
    const { data } = await storeGet('products', { slug, per_page: 1 });
    if (data.length) return data[0];

    // fallback: واکشی همه و find (اگر فیلتر slug پشتیبانی نشد)
    const all = await getWooProducts();
    return all.find((item) => item.slug === slug) || null;
}
