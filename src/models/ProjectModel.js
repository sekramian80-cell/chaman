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

/**
 * تبدیل داده‌های API به مدل Project
 * @param {Array<Object>} apiItems
 * @returns {Array<Project>}
 */
export function mapProjects(apiItems = []) {
  return apiItems.map((item) => ({
    id: item.id,
    title: item.title?.rendered || '',
    meta: item.acf?.meta || item.excerpt?.rendered || '',
    description: item.acf?.description || item.content?.rendered?.replace(/<[^>]*>/g, '') || '',
    imageUrl: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
  }));
}
