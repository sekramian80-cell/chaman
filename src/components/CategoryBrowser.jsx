import { ArrowLeft, LayoutGrid } from 'lucide-react';
import defaultCategoryImage from '../assets/hero-products-football.jpg';
import { findCategoryNode } from '../models/categoryTree.js';
import { getCategoryPath, getCategorySlugFromPath } from '../utils/routing.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { ScrollReveal } from './ScrollReveal.jsx';

/**
 * اسلاگ دسته‌ها را به ترتیبِ منوی وردپرس از آیتم‌های ناوبری استخراج می‌کند
 */
function categorySlugsFromNav(navItems = []) {
    const slugs = [];
    const walk = (items) => {
        (items || []).forEach((item) => {
            const slug = getCategorySlugFromPath(item.path || item.href || '');
            if (slug && !slugs.includes(slug)) slugs.push(slug);
            if (item.children?.length) walk(item.children);
        });
    };
    walk(navItems);
    return slugs;
}

/**
 * بخش دسته‌بندی کاربرپسند و ریسپانسیو.
 * ترتیب/انتخاب دسته‌ها از منوی وردپرس (Appearance → Menus) خوانده می‌شود؛
 * اگر منو دسته‌ای نداشت، همهٔ دسته‌های اصلی نمایش داده می‌شوند.
 */
export function CategoryBrowser({ tree = [], navItems = [] }) {
    const navSlugs = categorySlugsFromNav(navItems);

    const nodes = navSlugs.length
        ? navSlugs.map((slug) => findCategoryNode(tree, slug)).filter(Boolean)
        : tree;

    if (!nodes.length) return null;

    return (
        <section className="section category-browser" id="categories">
            <div className="container">
                <ScrollReveal className="category-browser__head" variant="scale">
                    <span className="eyebrow">
                        <LayoutGrid size={16} aria-hidden="true" /> دسته‌بندی محصولات
                    </span>
                    <h2>دستهٔ موردنظرت را انتخاب کن</h2>
                    <p>
                        محصولات بر اساس کاربرد دسته‌بندی شده‌اند. روی هر دسته بزن تا محصولات همان بخش را ببینی.
                    </p>
                </ScrollReveal>

                <div className="category-browser__grid">
                    {nodes.map((node, index) => (
                        <ScrollReveal
                            key={node.slug}
                            className="category-card"
                            delay={Math.min(index, 6) * 70}
                            variant="up"
                        >
                            <a className="category-card__link" href={getCategoryPath(node.slug)}>
                                <span className="category-card__media">
                                    <img
                                        src={node.image || defaultCategoryImage}
                                        alt={node.title}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span className="category-card__shine" aria-hidden="true" />
                                </span>
                                <span className="category-card__body">
                                    <span className="category-card__title">{node.title}</span>
                                    {node.children?.length ? (
                                        <span className="category-card__subs">
                                            {node.children
                                                .slice(0, 3)
                                                .map((child) => child.title)
                                                .join(' • ')}
                                            {node.children.length > 3 ? ' …' : ''}
                                        </span>
                                    ) : null}
                                    <span className="category-card__foot">
                                        <span className="category-card__count">
                                            {node.count ? toPersianNumber(node.count) : '—'} محصول
                                        </span>
                                        <span className="category-card__cta" aria-hidden="true">
                                            مشاهده
                                            <ArrowLeft size={15} />
                                        </span>
                                    </span>
                                </span>
                            </a>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
