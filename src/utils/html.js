/**
 * حذف تگ‌های HTML و decode کردن entityها
 */
export function stripHtml(html = '') {
    if (!html) return '';

    if (typeof document !== 'undefined') {
        const element = document.createElement('div');
        element.innerHTML = html;
        return (element.textContent || element.innerText || '').trim();
    }

    return html.replace(/<[^>]*>/g, '').trim();
}
