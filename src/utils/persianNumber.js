/**
 * تبدیل ارقام انگلیسی (و عربی) به فارسی و نمایش اعداد بدون صفر جلو
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * تبدیل همه ارقام یک رشته به فارسی
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
export function toPersianDigits(value) {
    if (value === null || value === undefined) return '';

    return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/**
 * نمایش عدد به‌صورت فارسی (بدون صفر جلو مانند ۰۱)
 * @param {string|number|null|undefined} value
 * @param {string} [fallback='']
 */
export function toPersianNumber(value, fallback = '') {
    if (value === null || value === undefined || value === '') return fallback;

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return toPersianDigits(value);
    }

    return toPersianDigits(String(Math.trunc(numeric)));
}

/**
 * شماره ترتیبی فارسی برای لیست‌ها (۱، ۲، ۳ ...)
 * @param {number} index صفر‌مبنا
 */
export function toPersianOrdinal(index = 0) {
    return toPersianNumber(index + 1);
}
