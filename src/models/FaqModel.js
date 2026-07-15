import { stripHtml } from '../utils/html.js';
import { toPersianDigits } from '../utils/persianNumber.js';

/**
 * تبدیل داده‌های API به مدل FAQ
 * @param {Array<Object>} apiItems
 */
export function mapFaqsFromAPI(apiItems = []) {
    return apiItems.map((item) => ({
        id: item.id,
        question: toPersianDigits(stripHtml(item.title?.rendered) || item.acf?.question || ''),
        answer: toPersianDigits(item.acf?.answer || stripHtml(item.content?.rendered) || ''),
    }));
}
