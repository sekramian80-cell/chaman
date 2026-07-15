import defaultServiceImage from '../assets/services/villa-yard.jpg';
import { stripHtml } from '../utils/html.js';
import { resolveIcon } from '../utils/iconMap.js';
import { toPersianDigits } from '../utils/persianNumber.js';

/**
 * تبدیل داده‌های API به مدل Service
 * @param {Array<Object>} apiItems
 */
export function mapServicesFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        icon: resolveIcon(item.acf?.icon_name),
        image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultServiceImage,
        imageAlt: toPersianDigits(stripHtml(item.title?.rendered) || '') || 'خدمت چمن مصنوعی',
        title: toPersianDigits(stripHtml(item.title?.rendered) || ''),
        tag: toPersianDigits(item.acf?.service_tag || ''),
        highlight: toPersianDigits(item.acf?.service_highlight || ''),
        description: toPersianDigits(
            item.acf?.short_description ||
                stripHtml(item.excerpt?.rendered) ||
                stripHtml(item.content?.rendered) ||
                '',
        ),
    }));
}

/** @deprecated از mapServicesFromAPI استفاده کنید */
export function mapServices(apiItems = []) {
    return mapServicesFromAPI(apiItems);
}
