/**
 * مدل داده برای خدمات (Services)
 * قابل استفاده هم برای fallback محلی و هم برای داده‌های API
 *
 * @typedef {Object} Service
 * @property {number} id - شناسه
 * @property {string} icon - نام آیکون (lucide-react)
 * @property {string} title - عنوان خدمت
 * @property {string} description - توضیحات
 */

/**
 * @typedef {Object} ServicePlan
 * @property {number} id - شناسه
 * @property {string} icon - نام آیکون
 * @property {string} title - عنوان پکیج
 * @property {string} text - توضیحات
 */

/**
 * تبدیل داده‌های API (Custom Post Type یا Category) به مدل Service
 * @param {Array<Object>} apiItems
 * @returns {Array<Service>}
 */
export function mapServices(apiItems = []) {
  return apiItems.map((item) => ({
    id: item.id,
    icon: item.acf?.icon || item.meta?.icon || 'Home',
    title: item.title?.rendered || item.name || '',
    description: item.excerpt?.rendered || item.description || '',
  }));
}
