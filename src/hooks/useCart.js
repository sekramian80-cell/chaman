import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

/**
 * دسترسی به سبد خرید
 * @returns {import('../context/CartContext.jsx').CartContextValue}
 */
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        // fallback امن اگر خارج از Provider استفاده شد
        return {
            items: [],
            count: 0,
            totalAmount: 0,
            add: () => {},
            remove: () => {},
            setQty: () => {},
            clear: () => {},
        };
    }

    return context;
}
