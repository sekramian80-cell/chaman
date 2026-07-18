import { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    Check,
    ChevronLeft,
    ChevronRight,
    Layers,
    Minus,
    Plus,
    ShoppingCart,
    Sparkles,
} from 'lucide-react';
import { ContactCTA } from '../components/ContactCTA.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { SectionSeam } from '../components/SectionSeam.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { useCart } from '../hooks/useCart.js';
import { buildWooCategoryMap, mapWooProductsFromAPI } from '../models/WooProductModel.js';
import { getWooCategories, getWooProductBySlug } from '../services/woocommerce.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { getProductDetailPath, getProductSlugFromPath } from '../utils/routing.js';

function categoryLabel(primaryCategory) {
    if (primaryCategory === 'sports') return 'ورزشی';
    if (primaryCategory === 'decorative') return 'تزیینی';
    return '';
}

function ProductNotFound() {
    return (
        <section className="section project-detail project-detail--empty">
            <div className="container">
                <ScrollReveal className="empty-state" variant="scale">
                    <strong>این محصول پیدا نشد.</strong>
                    <p>ممکن است لینک اشتباه باشد یا محصول حذف شده باشد.</p>
                    <a className="btn btn--primary" href="/products">
                        بازگشت به محصولات
                        <ArrowLeft size={18} />
                    </a>
                </ScrollReveal>
            </div>
        </section>
    );
}

export function ProductDetailPage({ slug: slugProp = '' }) {
    const { products } = useSiteContent();
    const cards = products?.cards || [];
    const slug = slugProp || getProductSlugFromPath(window.location.pathname);

    const fromContent = useMemo(
        () => cards.find((item) => item.slug === slug) || null,
        [cards, slug],
    );

    const [fallbackProduct, setFallbackProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // اگر محصول در محتوای بارگذاری‌شده نبود (دیپ‌لینک/رفرش)، مستقیم از ووکامرس بخوان
    useEffect(() => {
        if (fromContent || !slug) return undefined;

        let active = true;
        setIsLoading(true);

        Promise.all([getWooProductBySlug(slug), getWooCategories().catch(() => [])])
            .then(([item, categories]) => {
                if (!active) return;
                if (item) {
                    const mapped = mapWooProductsFromAPI([item], buildWooCategoryMap(categories));
                    setFallbackProduct(mapped[0] || null);
                } else {
                    setFallbackProduct(null);
                }
            })
            .catch(() => {
                if (active) setFallbackProduct(null);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [fromContent, slug]);

    const product = fromContent || fallbackProduct;

    const gallery = useMemo(() => {
        if (!product) return [];
        const list = product.gallery?.length
            ? product.gallery
            : [{ url: product.image, alt: product.imageAlt || product.title }];
        return list;
    }, [product]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [justAdded, setJustAdded] = useState(false);
    const { add } = useCart();

    useEffect(() => {
        setActiveIndex(0);
        setQty(1);
        setJustAdded(false);
    }, [product?.slug]);

    const related = useMemo(() => {
        if (!product) return [];
        return cards
            .filter((item) => item.slug !== product.slug)
            .filter(
                (item) =>
                    item.primaryCategory === product.primaryCategory ||
                    item.subcategory === product.subcategory,
            )
            .slice(0, 3);
    }, [cards, product]);

    if (!product) {
        if (isLoading) {
            return (
                <section className="section project-detail">
                    <div className="container">
                        <ScrollReveal className="empty-state" variant="scale">
                            <strong>در حال بارگذاری محصول…</strong>
                        </ScrollReveal>
                    </div>
                </section>
            );
        }
        return <ProductNotFound />;
    }

    const activeImage = gallery[Math.min(activeIndex, gallery.length - 1)] || gallery[0];
    const storyHtml = product.contentHtml?.trim();
    const typeLabel = categoryLabel(product.primaryCategory);

    const facts = [
        typeLabel ? { icon: Layers, label: 'دسته', value: typeLabel } : null,
        product.subcategoryLabel
            ? { icon: Sparkles, label: 'کاربری', value: product.subcategoryLabel }
            : null,
    ].filter(Boolean);

    function goPrev() {
        setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length);
    }

    function goNext() {
        setActiveIndex((current) => (current + 1) % gallery.length);
    }

    function onAddToCart() {
        add(product, qty);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1800);
    }

    return (
        <div className="product-detail-page project-detail-page">
            <section
                className="project-detail-hero project-detail-hero--premium"
                style={{ '--project-hero-image': `url(${product.image})` }}
            >
                <div className="project-detail-hero__veil" />
                <div className="project-detail-hero__orbit" aria-hidden="true" />
                <div className="container project-detail-hero__inner">
                    <ScrollReveal className="project-detail-hero__copy" variant="scale">
                        <div className="project-detail-hero__tags">
                            {typeLabel ? <span>{typeLabel}</span> : null}
                            {product.subcategoryLabel ? <span>{product.subcategoryLabel}</span> : null}
                        </div>
                        <p className="project-detail-hero__brand">فراز چمن</p>
                        <h1>{product.title}</h1>
                        {product.text ? <p>{product.text}</p> : null}
                        {product.priceLabel ? (
                            <p className="product-detail__hero-price">{product.priceLabel}</p>
                        ) : null}
                    </ScrollReveal>
                </div>
                <SectionSeam variant="slash" tone="paper" className="project-detail-hero__seam" />
            </section>

            <section className="section project-detail project-detail--premium">
                <div className="container project-detail__layout">
                    <div className="project-detail__main">
                        <ScrollReveal className="project-detail__gallery" variant="scale">
                            <div className="project-detail__stage is-ready">
                                <img src={activeImage.url} alt={activeImage.alt || product.title} key={activeImage.url} />
                                {gallery.length > 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            className="project-detail__nav project-detail__nav--prev"
                                            aria-label="تصویر قبلی"
                                            onClick={goPrev}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            className="project-detail__nav project-detail__nav--next"
                                            aria-label="تصویر بعدی"
                                            onClick={goNext}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                    </>
                                ) : null}
                            </div>
                            {gallery.length > 1 ? (
                                <div className="project-detail__thumbs" role="list">
                                    {gallery.map((item, index) => (
                                        <button
                                            type="button"
                                            className={`project-detail__thumb${index === activeIndex ? ' is-active' : ''}`}
                                            key={`${item.url}-${index}`}
                                            onClick={() => setActiveIndex(index)}
                                            aria-label={`تصویر ${toPersianNumber(index + 1)}`}
                                        >
                                            <img src={item.url} alt="" loading="lazy" decoding="async" />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </ScrollReveal>

                        {storyHtml ? (
                            <ScrollReveal className="project-detail__story" delay={90} variant="up">
                                <span className="eyebrow">معرفی محصول</span>
                                <h2>مشخصات و توضیحات</h2>
                                <div
                                    className="project-detail__richtext"
                                    dangerouslySetInnerHTML={{ __html: storyHtml }}
                                />
                            </ScrollReveal>
                        ) : null}
                    </div>

                    <aside className="project-detail__side">
                        <ScrollReveal className="project-detail__panel product-detail__panel" delay={80} variant="left">
                            <h3>{product.title}</h3>
                            {product.priceLabel ? (
                                <p className="product-detail__price">{product.priceLabel}</p>
                            ) : (
                                <p className="product-detail__price product-detail__price--inquiry">
                                    قیمت با استعلام
                                </p>
                            )}

                            {facts.length ? (
                                <dl className="product-detail__facts">
                                    {facts.map((fact) => {
                                        const Icon = fact.icon;
                                        return (
                                            <div key={fact.label}>
                                                <dt>
                                                    <Icon size={16} />
                                                    {fact.label}
                                                </dt>
                                                <dd>{fact.value}</dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                            ) : null}

                            <div className="product-detail__qty" aria-label="انتخاب تعداد">
                                <button
                                    type="button"
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    aria-label="کاهش تعداد"
                                >
                                    <Minus size={16} />
                                </button>
                                <span>{toPersianNumber(qty)}</span>
                                <button
                                    type="button"
                                    onClick={() => setQty((q) => Math.min(999, q + 1))}
                                    aria-label="افزایش تعداد"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn btn--primary product-detail__add"
                                onClick={onAddToCart}
                            >
                                {justAdded ? (
                                    <>
                                        به سبد اضافه شد
                                        <Check size={18} />
                                    </>
                                ) : (
                                    <>
                                        افزودن به سبد خرید
                                        <ShoppingCart size={18} />
                                    </>
                                )}
                            </button>
                            <a className="btn btn--ghost product-detail__inquiry" href="tel:+989123365430">
                                استعلام و مشاوره
                            </a>
                        </ScrollReveal>
                    </aside>
                </div>
            </section>

            {related.length > 0 ? (
                <section className="section project-detail-related project-detail-related--premium">
                    <div className="container">
                        <ScrollReveal className="project-detail-related__head" variant="scale">
                            <span className="eyebrow">محصولات مرتبط</span>
                            <h2>مدل‌های مشابه</h2>
                        </ScrollReveal>
                        <div className="project-detail-related__grid">
                            {related.map((item, index) => (
                                <ScrollReveal
                                    className="project-detail-related__card"
                                    delay={index * 90}
                                    variant="up"
                                    key={item.slug || item.id}
                                >
                                    <a href={getProductDetailPath(item)}>
                                        <img
                                            src={item.image}
                                            alt={item.imageAlt || item.title}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div>
                                            {item.subcategoryLabel ? <span>{item.subcategoryLabel}</span> : null}
                                            <strong>{item.title}</strong>
                                            {item.priceLabel ? <small>{item.priceLabel}</small> : null}
                                            <em>
                                                مشاهده محصول
                                                <ArrowLeft size={15} />
                                            </em>
                                        </div>
                                    </a>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <ContactCTA />
        </div>
    );
}
