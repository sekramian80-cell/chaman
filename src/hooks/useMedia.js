/**
 * هوک useMedia
 * دریافت تصاویر از کتابخانه رسانه وردپرس
 */
import { useWordPress } from './useWordPress.js';
import { getMediaById } from '../services/wordpress.js';

/**
 * دریافت اطلاعات یک تصویر از وردپرس
 * @param {number|null} mediaId - شناسه رسانه
 * @param {Object} options
 * @returns {{ imageUrl: string|null, loading: boolean, error: string|null }}
 */
export function useMedia(mediaId, options = {}) {
  const { data, loading, error } = useWordPress(
    async () => {
      if (!mediaId) return null;
      const media = await getMediaById(mediaId);
      return media?.source_url || null;
    },
    { ...options, enabled: !!mediaId },
  );

  return { imageUrl: data, loading, error };
}

/**
 * دریافت چند تصویر همزمان
 * @param {Array<number>} mediaIds
 * @returns {{ images: Object<number, string>, loading: boolean }}
 */
export function useMediaBatch(mediaIds = []) {
  const uniqueIds = [...new Set(mediaIds.filter(Boolean))];

  const { data, loading } = useWordPress(
    async () => {
      if (!uniqueIds.length) return {};

      const results = await Promise.allSettled(
        uniqueIds.map((id) => getMediaById(id)),
      );

      const images = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          images[uniqueIds[index]] = result.value.source_url || null;
        }
      });

      return images;
    },
    { enabled: uniqueIds.length > 0, fallback: {} },
  );

  return { images: data || {}, loading };
}
