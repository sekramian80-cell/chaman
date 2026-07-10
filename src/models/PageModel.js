/**
 * مدل داده برای برگه‌های وردپرس (Pages)
 *
 * @typedef {Object} Page
 * @property {number} id - شناسه برگه
 * @property {string} date - تاریخ انتشار
 * @property {string} slug - نامک (slug)
 * @property {Object} title - عنوان
 * @property {string} title.rendered - عنوان HTML شده
 * @property {Object} content - محتوا
 * @property {string} content.rendered - محتوای HTML شده
 * @property {number} parent - شناسه برگه والد
 * @property {number} featured_media - شناسه تصویر شاخص
 * @property {Object} _embedded - داده‌های الحاقی
 */

/**
 * تبدیل داده خام API به مدل استاندارد
 * @param {Object} raw - داده خام از API
 * @returns {Page}
 */
export function mapPage(raw = {}) {
  return {
    id: raw.id,
    date: raw.date,
    slug: raw.slug,
    title: raw.title?.rendered || '',
    content: raw.content?.rendered || '',
    parent: raw.parent || 0,
    featuredMedia: raw.featured_media,
    featuredImage: raw._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
  };
}

/**
 * تبدیل آرایه‌ای از داده‌های خام
 * @param {Array<Object>} rawList
 * @returns {Array<Page>}
 */
export function mapPages(rawList = []) {
  return rawList.map(mapPage);
}
