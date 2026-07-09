/**
 * هوک useContent
 * هوک ترکیبی: ابتدا سعی می‌کند داده را از API بگیرد
 * در صورت خطا از fallback محلی استفاده می‌کند
 */
import { useWordPress } from './useWordPress.js';

/**
 * @template T
 * @param {() => Promise<T>} apiFetcher - تابع دریافت از API
 * @param {T} localContent - محتوای محلی (fallback)
 * @param {Object} options
 * @returns {{ data: T, loading: boolean, error: string|null, isFromAPI: boolean, refetch: () => void }}
 */
export function useContent(apiFetcher, localContent, options = {}) {
  const { data, loading, error, refetch } = useWordPress(apiFetcher, {
    ...options,
    fallback: localContent,
  });

  // اگر دیتا با fallback یکی باشه، یعنی از API نیومده
  const isFromAPI = !loading && !error && data !== localContent;

  return {
    data: data ?? localContent,
    loading,
    error,
    isFromAPI,
    refetch,
  };
}
