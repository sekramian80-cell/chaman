import defaultProductImage from '../assets/hero-artificial-grass.jpg';
import { stripHtml } from '../utils/html.js';

function extractCategorySlugs(item) {
    const termGroups = item._embedded?.['wp:term'] || [];

    return termGroups
        .flat()
        .filter((term) => term?.taxonomy === 'product_category')
        .map((term) => term.slug)
        .filter(Boolean);
}

/**
 * تبدیل داده‌های API به کارت/پروژه محصول
 * @param {Array<Object>} apiItems
 */
export function mapProductsFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        title: stripHtml(item.title?.rendered) || '',
        text:
            item.acf?.short_description ||
            stripHtml(item.excerpt?.rendered) ||
            stripHtml(item.content?.rendered) ||
            '',
        meta: item.acf?.project_meta || '',
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultProductImage,
        imageAlt: stripHtml(item.title?.rendered) || 'پروژه چمن مصنوعی',
        categories: extractCategorySlugs(item),
    }));
}

export function filterProductsByCategory(products = [], categorySlug) {
    return products.filter((product) => product.categories?.includes(categorySlug));
}
