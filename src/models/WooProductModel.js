/**
 * نگاشت محصولات WooCommerce Store API به مدل کارت/محصول فرانت
 * خروجی هم‌شکل با mapProductsFromAPI است تا کارت‌ها و صفحات بدون تغییر کار کنند.
 */
import defaultProductImage from '../assets/hero-artificial-grass.jpg';
import { getSubcategoryLabel, mainCategorySlugs } from '../content/productSubcategories.js';
import { stripHtml } from '../utils/html.js';
import { toPersianDigits } from '../utils/persianNumber.js';

/**
 * ساخت نقشهٔ اسلاگ→{id,parent,name} از دسته‌های ووکامرس
 * @param {Array<{id:number,slug:string,parent:number,name:string}>} categories
 */
export function buildWooCategoryMap(categories = []) {
    const bySlug = new Map();
    const byId = new Map();

    categories.forEach((term) => {
        if (!term?.slug) return;
        const node = { id: term.id, parent: term.parent || 0, slug: term.slug, name: term.name };
        bySlug.set(term.slug, node);
        byId.set(term.id, node);
    });

    return { bySlug, byId };
}

/**
 * تعیین دستهٔ اصلی (sports/decorative) با دنبال‌کردن زنجیرهٔ والدها
 */
function resolvePrimaryFromChain(node, byId) {
    let current = node;
    let guard = 0;

    while (current && guard < 10) {
        if (mainCategorySlugs.includes(current.slug)) {
            return current.slug;
        }
        current = current.parent ? byId.get(current.parent) : null;
        guard += 1;
    }

    return '';
}

function resolveTaxonomy(item, categoryMap) {
    const productCats = Array.isArray(item.categories) ? item.categories : [];
    const slugs = productCats.map((cat) => cat.slug).filter(Boolean);

    const byId = categoryMap?.byId ?? new Map();
    const bySlug = categoryMap?.bySlug ?? new Map();

    // دستهٔ اصلی مستقیم روی محصول (اگر خودِ sports/decorative به محصول اختصاص یافته باشد)
    let primaryCategory = slugs.find((slug) => mainCategorySlugs.includes(slug)) || '';
    // زیردسته: اولین دستهٔ غیر-اصلی
    const subcategory = slugs.find((slug) => !mainCategorySlugs.includes(slug)) || '';

    // اگر دستهٔ اصلی مستقیم نبود، از زنجیرهٔ والدِ زیردسته پیدا کن
    if (!primaryCategory && subcategory) {
        const node = bySlug.get(subcategory);
        if (node) {
            primaryCategory = resolvePrimaryFromChain(node, byId);
        }
    }

    return {
        slugs,
        primaryCategory,
        subcategory,
        subcategoryLabel: getSubcategoryLabel(primaryCategory, subcategory) || '',
    };
}

/**
 * افزودن جداکنندهٔ هزارگان و تبدیل به ارقام فارسی
 */
function groupThousands(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
}

/**
 * قالب‌بندی قیمت از prices ووکامرس
 * @returns {{ amount:number, label:string, symbol:string }}
 */
function formatPrice(prices) {
    const symbol = stripHtml(prices?.currency_symbol || '') || 'تومان';

    if (!prices || prices.price === undefined || prices.price === null || prices.price === '') {
        return { amount: 0, label: '', symbol };
    }

    const minorUnit = Number(prices.currency_minor_unit ?? 0) || 0;
    const raw = Number(prices.price);
    if (!Number.isFinite(raw)) {
        return { amount: 0, label: '', symbol };
    }

    const amount = minorUnit > 0 ? raw / 10 ** minorUnit : raw;
    if (amount <= 0) {
        return { amount: 0, label: '', symbol };
    }

    const rounded = Math.round(amount);
    const label = `${toPersianDigits(groupThousands(rounded))} ${symbol}`.trim();

    return { amount: rounded, label, symbol };
}

function buildMeta(item, priceLabel) {
    const parts = [];
    if (item.sku) parts.push(item.sku);
    if (priceLabel) parts.push(priceLabel);
    return toPersianDigits(parts.join(' · '));
}

/**
 * تبدیل آرایهٔ محصولات ووکامرس به مدل فرانت
 * @param {Array<Object>} apiItems
 * @param {{ bySlug: Map, byId: Map }} [categoryMap]
 */
export function mapWooProductsFromAPI(apiItems = [], categoryMap) {
    return apiItems.map((item) => {
        const taxonomy = resolveTaxonomy(item, categoryMap);
        const price = formatPrice(item.prices);
        const title = toPersianDigits(stripHtml(item.name) || '');

        const images = Array.isArray(item.images) ? item.images : [];
        const gallery = images
            .map((image) => ({ url: image.src, alt: toPersianDigits(image.alt || title) }))
            .filter((image) => image.url);

        return {
            id: item.id,
            title,
            text: toPersianDigits(
                stripHtml(item.short_description) || stripHtml(item.description) || '',
            ),
            meta: buildMeta(item, price.label),
            price: price.label,
            priceAmount: price.amount,
            priceLabel: price.label,
            currencySymbol: price.symbol,
            slug: item.slug || '',
            permalink: item.permalink || '',
            inStock: item.is_in_stock !== false,
            gallery,
            image: images[0]?.src || defaultProductImage,
            imageAlt: title || 'محصول چمن مصنوعی',
            contentHtml: item.description || '',
            categories: taxonomy.slugs,
            primaryCategory: taxonomy.primaryCategory,
            subcategory: taxonomy.subcategory,
            subcategoryLabel: taxonomy.subcategoryLabel,
        };
    });
}
