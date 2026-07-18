import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { CONFIG } from '../config/index.js';
import { useCart } from '../hooks/useCart.js';
import { toPersianDigits, toPersianNumber } from '../utils/persianNumber.js';

function formatMoney(amount, symbol = 'تومان') {
    if (!amount) return '';
    const grouped = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
    return `${toPersianDigits(grouped)} ${symbol}`.trim();
}

export function CartPage() {
    const { items, count, totalAmount, remove, setQty } = useCart();
    const currencySymbol = items[0]?.currencySymbol || 'تومان';

    // payload انتقال به checkout ووکامرس: [{ id, qty }]
    const handoffItems = JSON.stringify(items.map((item) => ({ id: item.id, qty: item.qty })));

    if (!items.length) {
        return (
            <div className="cart-page">
                <section className="section page-section">
                    <div className="container">
                        <ScrollReveal className="empty-state cart-page__empty" variant="scale">
                            <ShoppingBag size={40} />
                            <strong>سبد خرید شما خالی است.</strong>
                            <p>برای افزودن محصول به سبد، به صفحهٔ محصولات مراجعه کنید.</p>
                            <a className="btn btn--primary" href="/products">
                                مشاهده محصولات
                                <ArrowLeft size={18} />
                            </a>
                        </ScrollReveal>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <section className="section page-section">
                <div className="container">
                    <ScrollReveal className="cart-page__head" variant="up">
                        <span className="eyebrow">سبد خرید</span>
                        <h1>سبد خرید شما</h1>
                        <p>{toPersianNumber(count)} کالا در سبد شما قرار دارد.</p>
                    </ScrollReveal>

                    <div className="cart-page__layout">
                        <div className="cart-page__items">
                            {items.map((item) => (
                                <article className="cart-item" key={item.id}>
                                    <a className="cart-item__media" href={`/product/${encodeURIComponent(item.slug)}`}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                                        ) : null}
                                    </a>
                                    <div className="cart-item__body">
                                        <a className="cart-item__title" href={`/product/${encodeURIComponent(item.slug)}`}>
                                            {item.title}
                                        </a>
                                        {item.priceLabel ? (
                                            <span className="cart-item__unit">{item.priceLabel}</span>
                                        ) : null}
                                        <div className="cart-item__controls">
                                            <div className="product-detail__qty">
                                                <button
                                                    type="button"
                                                    onClick={() => setQty(item.id, item.qty - 1)}
                                                    aria-label="کاهش تعداد"
                                                >
                                                    <Minus size={15} />
                                                </button>
                                                <span>{toPersianNumber(item.qty)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setQty(item.id, item.qty + 1)}
                                                    aria-label="افزایش تعداد"
                                                >
                                                    <Plus size={15} />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                className="cart-item__remove"
                                                onClick={() => remove(item.id)}
                                            >
                                                <Trash2 size={16} />
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                    {item.priceAmount ? (
                                        <div className="cart-item__total">
                                            {formatMoney(item.priceAmount * item.qty, item.currencySymbol)}
                                        </div>
                                    ) : null}
                                </article>
                            ))}
                        </div>

                        <aside className="cart-page__summary">
                            <div className="cart-summary">
                                <h2>جمع سبد</h2>
                                <div className="cart-summary__row">
                                    <span>تعداد کل</span>
                                    <strong>{toPersianNumber(count)}</strong>
                                </div>
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>مبلغ قابل پرداخت</span>
                                    <strong>
                                        {totalAmount ? formatMoney(totalAmount, currencySymbol) : 'با استعلام'}
                                    </strong>
                                </div>

                                <form method="POST" action={CONFIG.WC.HANDOFF_URL}>
                                    <input type="hidden" name="items" value={handoffItems} />
                                    <button type="submit" className="btn btn--primary cart-summary__checkout">
                                        تکمیل خرید و پرداخت
                                        <ArrowLeft size={18} />
                                    </button>
                                </form>

                                <p className="cart-summary__note">
                                    پرداخت روی درگاه امن فروشگاه انجام می‌شود.
                                </p>
                                <a className="btn btn--ghost cart-summary__continue" href="/products">
                                    ادامهٔ خرید
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <ContactCTA />
        </div>
    );
}
