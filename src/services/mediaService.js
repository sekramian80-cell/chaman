/**
 * سرویس مدیریت رسانه (تصاویر)
 * توابع کمکی برای کار با تصاویر وردپرس
 */
import { getMediaById } from './wordpress.js';
import { CONFIG } from '../config/index.js';

/**
 * دریافت URL تصویر با اندازه مشخص
 * @param {number} mediaId - شناسه رسانه
 * @param {string} [size='full'] - اندازه تصویر (thumbnail, medium, large, full)
 * @returns {Promise<string|null>}
 */
export async function getMediaUrl(mediaId, size = 'full') {
  try {
    const media = await getMediaById(mediaId);
    if (!media) return null;

    // WordPress media sizes
    if (size !== 'full' && media.media_details?.sizes?.[size]) {
      return media.media_details.sizes[size].source_url;
    }

    return media.source_url || media.guid?.rendered || null;
  } catch {
    return null;
  }
}

/**
 * دریافت URL تصویر شاخص یک نوشته/برگه
 * @param {Object} post - آبجکت نوشته (با _embedded)
 * @param {string} [size='full']
 * @returns {string|null}
 */
export function getFeaturedImageUrl(post, size = 'full') {
  if (!post) return null;

  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  if (size !== 'full' && media.media_details?.sizes?.[size]) {
    return media.media_details.sizes[size].source_url;
  }

  return media.source_url || null;
}

/**
 * ساختن placeholder رنگی برای lazy loading
 * @returns {string} - data URI
 */
export function getPlaceholder() {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23${CONFIG.IMAGES.PLACEHOLDER_COLOR.replace('#', '')}'/%3E%3C/svg%3E`;
}

/**
 * جستجوی تصویر با slug در کتابخانه رسانه
 * @param {string} slug - نامک تصویر
 * @returns {Promise<Object|null>}
 */
export async function getMediaBySlug(slug) {
  try {
    const { apiGet } = await import('./api.js');
    const results = await apiGet('media', { search: slug, per_page: 1 });
    return results?.[0] || null;
  } catch {
    return null;
  }
}
