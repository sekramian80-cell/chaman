/**
 * CartContext
 * وضعیت سراسری سبد خرید (با پشتوانهٔ localStorage)
 */
import { createContext } from 'react';

/**
 * @typedef {Object} CartItem
 * @property {number|string} id شناسهٔ محصول ووکامرس
 * @property {string} slug
 * @property {string} title
 * @property {string} image
 * @property {number} priceAmount قیمت واحد (تومان)
 * @property {string} priceLabel رشتهٔ نمایشی قیمت
 * @property {number} qty تعداد
 */

/**
 * @typedef {Object} CartContextValue
 * @property {CartItem[]} items
 * @property {number} count مجموع تعداد اقلام
 * @property {number} totalAmount مجموع مبلغ
 * @property {(item: Object, qty?: number) => void} add
 * @property {(id: number|string) => void} remove
 * @property {(id: number|string, qty: number) => void} setQty
 * @property {() => void} clear
 */

export const CartContext = createContext(null);
