/**
 * سرویس پایه API
 * کانفیگ Axios برای ارتباط با API وردپرس
 */
import { CONFIG } from '../config/index.js';

/**
 * درخواست‌های GET به API
 * @param {string} endpoint - مسیر endpoint (مثلاً 'posts', 'pages')
 * @param {Object} params - پارامترهای query string
 * @returns {Promise<Object>} - پاسخ API
 */
export async function apiGet(endpoint, params = {}) {
  const url = new URL(`${CONFIG.API_BASE_URL}/${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST.TIMEOUT);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('درخواست به API با خطای تایم‌اوت مواجه شد');
    }
    
    throw error;
  }
}

/**
 * دریافت یک آیتم با ID
 * @param {string} endpoint
 * @param {number} id
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export async function apiGetById(endpoint, id, params = {}) {
  return apiGet(`${endpoint}/${id}`, params);
}
