/**
 * مدل داده برای پروژه‌های نمونه
 *
 * @typedef {Object} Project
 * @property {number} id - شناسه
 * @property {string} title - عنوان پروژه
 * @property {string} meta - اطلاعات تکمیلی (متراژ و موقعیت)
 * @property {string} description - توضیحات
 * @property {string} [imageUrl] - URL تصویر (دریافتی از API)
 */

import { stripHtml } from '../utils/html.js';

/**
 * تبدیل داده‌های API به مدل Project
 * @param {Array<Object>} apiItems
 * @returns {Array<Project>}
 */
export function mapProjectsFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        title: stripHtml(item.title?.rendered) || '',
        meta: item.acf?.meta || stripHtml(item.excerpt?.rendered) || '',
        description: item.acf?.description || stripHtml(item.content?.rendered) || '',
        imageUrl: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    }));
}

/** @deprecated از mapProjectsFromAPI استفاده کنید */
export function mapProjects(apiItems = []) {
    return mapProjectsFromAPI(apiItems);
}
