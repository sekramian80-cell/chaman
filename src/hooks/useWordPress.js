/**
 * هوک useWordPress
 * هوک اصلی برای دریافت داده از API وردپرس
 * وضعیت‌های loading, error, data را مدیریت می‌کند
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config/index.js';

/**
 * @template T
 * @param {() => Promise<T>} fetcher - تابع دریافت داده
 * @param {Object} options
 * @param {boolean} [options.enabled=true] - آیا درخواست اجرا شود
 * @param {T} [options.fallback] - داده پیش‌فرض در صورت خطا
 * @param {number} [options.retryCount] - تعداد تلاش مجدد
 * @param {number} [options.retryDelay] - تأخیر بین تلاش‌ها (میلی‌ثانیه)
 * @returns {{ data: T|null, loading: boolean, error: string|null, refetch: () => void }}
 */
export function useWordPress(fetcher, options = {}) {
  const {
    enabled = true,
    fallback = null,
    retryCount = CONFIG.REQUEST.RETRY_COUNT,
    retryDelay = CONFIG.REQUEST.RETRY_DELAY,
  } = options;

  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const retryRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
        setLoading(false);
        retryRef.current = 0;
      }
    } catch (err) {
      if (!mountedRef.current) return;

      if (retryRef.current < retryCount) {
        retryRef.current += 1;
        setTimeout(() => fetchData(), retryDelay);
        return;
      }

      setError(err.message || 'خطا در دریافت اطلاعات');
      setLoading(false);

      // استفاده از fallback در صورت خطا
      if (fallback) {
        setData(fallback);
      }
    }
  }, [fetcher, enabled, retryCount, retryDelay, fallback]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    retryRef.current = 0;
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
