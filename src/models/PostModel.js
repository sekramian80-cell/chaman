/**
 * مدل داده برای نوشته‌های وردپرس (Posts)
 *
 * @typedef {Object} Post
 * @property {number} id - شناسه نوشته
 * @property {string} date - تاریخ انتشار
 * @property {string} modified - تاریخ آخرین ویرایش
 * @property {string} slug - نامک (slug)
 * @property {string} status - وضعیت (publish, draft, ...)
 * @property {string} type - نوع (post)
 * @property {Object} title - عنوان
 * @property {string} title.rendered - عنوان HTML شده
 * @property {Object} content - محتوا
 * @property {string} content.rendered - محتوای HTML شده
 * @property {Object} excerpt - خلاصه
 * @property {string} excerpt.rendered - خلاصه HTML شده
 * @property {number} author - شناسه نویسنده
 * @property {number} featured_media - شناسه تصویر شاخص
 * @property {Array<number>} categories - شناسه‌های دسته‌بندی
 * @property {Object} _embedded - داده‌های الحاقی (در صورت درخواست با _embed=1)
 */

/**
 * تبدیل داده خام API به مدل استاندارد
 * @param {Object} raw - داده خام از API
 * @returns {Post}
 */
export function mapPost(raw = {}) {
  return {
    id: raw.id,
    date: raw.date,
    modified: raw.modified,
    slug: raw.slug,
    status: raw.status,
    type: raw.type,
    title: raw.title?.rendered || '',
    content: raw.content?.rendered || '',
    excerpt: raw.excerpt?.rendered || '',
    author: raw.author,
    featuredMedia: raw.featured_media,
    categories: raw.categories || [],
    featuredImage: raw._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
  };
}

/**
 * تبدیل آرایه‌ای از داده‌های خام
 * @param {Array<Object>} rawList
 * @returns {Array<Post>}
 */
export function mapPosts(rawList = []) {
  return rawList.map(mapPost);
}
