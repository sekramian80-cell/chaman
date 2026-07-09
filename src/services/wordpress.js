/**
 * سرویس وردپرس
 * متدهای مخصوص دریافت اطلاعات از API وردپرس
 */
import { apiGet, apiGetById } from './api.js';

/**
 * دریافت لیست نوشته‌ها
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.perPage=10]
 * @param {string} [params.search]
 * @param {string} [params.orderBy='date']
 * @param {string} [params.order='desc']
 * @returns {Promise<Array>}
 */
export async function getPosts(params = {}) {
  return apiGet('posts', {
    per_page: params.perPage ?? 10,
    page: params.page ?? 1,
    search: params.search,
    orderby: params.orderBy ?? 'date',
    order: params.order ?? 'desc',
    _embed: 1,
  });
}

/**
 * دریافت یک نوشته با ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getPostById(id) {
  return apiGetById('posts', id, { _embed: 1 });
}

/**
 * دریافت لیست برگه‌ها
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export async function getPages(params = {}) {
  return apiGet('pages', {
    per_page: params.perPage ?? 10,
    page: params.page ?? 1,
    parent: params.parent,
    _embed: 1,
    ...params,
  });
}

/**
 * دریافت یک برگه با ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getPageById(id) {
  return apiGetById('pages', id, { _embed: 1 });
}

/**
 * دریافت دسته‌بندی‌ها
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export async function getCategories(params = {}) {
  return apiGet('categories', {
    per_page: params.perPage ?? 100,
    hide_empty: true,
    ...params,
  });
}

/**
 * دریافت رسانه/تصویر با ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getMediaById(id) {
  if (!id) return null;
  return apiGetById('media', id);
}

/**
 * دریافت منوها (اختیاری - نیاز به افزونه یا WP REST API Menus)
 * @returns {Promise<Array>}
 */
export async function getMenus() {
  try {
    return await apiGet('menu-items');
  } catch {
    // اگر endpoint موجود نباشه، خطا رو بیخیال می‌شیم
    return [];
  }
}
