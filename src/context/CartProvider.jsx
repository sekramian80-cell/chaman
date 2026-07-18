/**
 * CartProvider
 * نگه‌داری سبد در state و همگام‌سازی با localStorage
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './CartContext.jsx';

const STORAGE_KEY = 'faraz_cart_v1';

function readStoredItems() {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((item) => item && item.id != null) : [];
    } catch {
        return [];
    }
}

function normalizeQty(value, fallback = 1) {
    const numeric = Math.trunc(Number(value));
    if (!Number.isFinite(numeric) || numeric < 1) return fallback;
    return Math.min(numeric, 999);
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readStoredItems);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // اگر localStorage در دسترس نبود، بی‌صدا رد شو
        }
    }, [items]);

    // همگام‌سازی بین تب‌ها
    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const onStorage = (event) => {
            if (event.key === STORAGE_KEY) {
                setItems(readStoredItems());
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const add = useCallback((product, qty = 1) => {
        if (!product || product.id == null) return;
        const addQty = normalizeQty(qty);

        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: normalizeQty(item.qty + addQty) }
                        : item,
                );
            }

            return [
                ...current,
                {
                    id: product.id,
                    slug: product.slug || '',
                    title: product.title || '',
                    image: product.image || '',
                    priceAmount: Number(product.priceAmount) || 0,
                    priceLabel: product.priceLabel || product.price || '',
                    currencySymbol: product.currencySymbol || 'تومان',
                    qty: addQty,
                },
            ];
        });
    }, []);

    const remove = useCallback((id) => {
        setItems((current) => current.filter((item) => item.id !== id));
    }, []);

    const setQty = useCallback((id, qty) => {
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, qty: normalizeQty(qty) } : item)),
        );
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const value = useMemo(() => {
        const count = items.reduce((sum, item) => sum + item.qty, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.priceAmount * item.qty, 0);
        return { items, count, totalAmount, add, remove, setQty, clear };
    }, [items, add, remove, setQty, clear]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
