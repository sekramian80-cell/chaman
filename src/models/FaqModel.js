import { stripHtml } from '../utils/html.js';

/**
 * تبدیل داده‌های API به مدل FAQ
 * @param {Array<Object>} apiItems
 */
export function mapFaqsFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        question: stripHtml(item.title?.rendered) || item.acf?.question || '',
        answer: item.acf?.answer || stripHtml(item.content?.rendered) || '',
    }));
}
