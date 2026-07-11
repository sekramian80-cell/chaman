import defaultProductImage from '../assets/hero-artificial-grass.jpg';
import { stripHtml } from '../utils/html.js';
import { resolveIcon } from '../utils/iconMap.js';

/**
 * تبدیل داده‌های API به کارت محصول
 * @param {Array<Object>} apiItems
 */
export function mapProductsFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        icon: resolveIcon(item.acf?.icon_name, resolveIcon('Leaf')),
        title: stripHtml(item.title?.rendered) || '',
        text: item.acf?.short_description || stripHtml(item.excerpt?.rendered) || stripHtml(item.content?.rendered) || '',
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultProductImage,
        imageAlt: stripHtml(item.title?.rendered) || 'محصول چمن مصنوعی',
    }));
}
