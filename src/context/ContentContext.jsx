/**
 * ContentContext
 * مدیریت سراسری داده‌های سایت (API + fallback)
 */
import { createContext } from 'react';

/**
 * @typedef {Object} ContentContextValue
 * @property {Object} navigation - داده‌های منو
 * @property {Object} hero - داده‌های Hero
 * @property {Object} services - داده‌های خدمات
 * @property {Object} products - داده‌های محصولات
 * @property {Object} process - داده‌های روند اجرا
 * @property {Object} projects - داده‌های پروژه‌ها
 * @property {Object} faq - داده‌های سوالات متداول
 * @property {Object} contact - داده‌های تماس
 * @property {Object} trust - داده‌های اعتماد
 * @property {Object} testimonial - داده‌های نظرات
 * @property {boolean} loading - وضعیت بارگذاری کلی
 * @property {string|null} error - خطای کلی
 */

export const ContentContext = createContext(null);
