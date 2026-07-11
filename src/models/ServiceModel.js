import defaultServiceImage from '../assets/services/villa-yard.jpg';
import { stripHtml } from '../utils/html.js';
import { resolveIcon } from '../utils/iconMap.js';

/**
 * تبدیل داده‌های API به مدل Service
 * @param {Array<Object>} apiItems
 */
export function mapServicesFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        icon: resolveIcon(item.acf?.icon_name),
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultServiceImage,
        imageAlt: stripHtml(item.title?.rendered) || 'خدمت چمن مصنوعی',
        title: stripHtml(item.title?.rendered) || '',
        description:
            item.acf?.short_description ||
            stripHtml(item.excerpt?.rendered) ||
            stripHtml(item.content?.rendered) ||
            '',
    }));
}

/** @deprecated از mapServicesFromAPI استفاده کنید */
export function mapServices(apiItems = []) {
    return mapServicesFromAPI(apiItems);
}
