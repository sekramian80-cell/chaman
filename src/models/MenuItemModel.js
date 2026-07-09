/**
 * مدل داده برای آیتم‌های منو
 *
 * @typedef {Object} MenuItem
 * @property {number} id - شناسه
 * @property {string} label - عنوان
 * @property {string} href - لینک
 * @property {string} path - مسیر (برای تشخیص صفحه فعال)
 */

/**
 * تبدیل داده‌های API منوی وردپرس
 * @param {Array<Object>} apiItems
 * @returns {Array<MenuItem>}
 */
export function mapMenuItems(apiItems = []) {
  return apiItems.map((item) => ({
    id: item.id,
    label: item.title?.rendered || item.title || '',
    href: item.url || `#/${item.slug}`,
    path: item.slug ? `/${item.slug}` : '/',
    parent: item.parent || 0,
  }));
}
