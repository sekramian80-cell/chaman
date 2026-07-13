import defaultProductImage from '../assets/hero-artificial-grass.jpg';
import { getSubcategoryLabel, mainCategorySlugs } from '../content/productSubcategories.js';
import { stripHtml } from '../utils/html.js';

function extractCategorySlugs(item) {
    const termGroups = item._embedded?.['wp:term'] || [];

    return termGroups
        .flat()
        .filter((term) => term?.taxonomy === 'product_category')
        .map((term) => term.slug)
        .filter(Boolean);
}

function resolveProductTaxonomy(item) {
    const slugs = extractCategorySlugs(item);
    const primaryCategory =
        item.acf?.primary_category || slugs.find((slug) => mainCategorySlugs.includes(slug)) || '';
    const subcategory =
        item.acf?.subcategory || slugs.find((slug) => !mainCategorySlugs.includes(slug)) || '';

    return {
        slugs,
        primaryCategory,
        subcategory,
        subcategoryLabel:
            item.acf?.subcategory_label || getSubcategoryLabel(primaryCategory, subcategory) || '',
    };
}

function buildProductMeta(item) {
    const parts = [];

    if (item.acf?.project_meta) {
        parts.push(item.acf.project_meta);
    }

    if (item.acf?.product_price) {
        parts.push(item.acf.product_price);
    }

    return parts.join(' · ');
}

/**
 * تبدیل داده‌های API به کارت/پروژه محصول
 * @param {Array<Object>} apiItems
 */
export function mapProductsFromAPI(apiItems = []) {
    return apiItems.map((item) => {
        const taxonomy = resolveProductTaxonomy(item);

        return {
            id: item.id,
            title: stripHtml(item.title?.rendered) || '',
            text:
                item.acf?.short_description ||
                stripHtml(item.excerpt?.rendered) ||
                stripHtml(item.content?.rendered) ||
                '',
            meta: buildProductMeta(item),
            price: item.acf?.product_price || '',
            slug: item.slug || '',
            gallery: item.acf?.gallery || [],
            image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultProductImage,
            imageAlt: stripHtml(item.title?.rendered) || 'پروژه چمن مصنوعی',
            categories: taxonomy.slugs,
            primaryCategory: taxonomy.primaryCategory,
            subcategory: taxonomy.subcategory,
            subcategoryLabel: taxonomy.subcategoryLabel,
        };
    });
}

export function filterProductsByCategory(products = [], categorySlug) {
    return products.filter(
        (product) =>
            product.primaryCategory === categorySlug || product.categories?.includes(categorySlug),
    );
}

export function filterProductsBySubcategory(products = [], subcategorySlug) {
    return products.filter((product) => product.subcategory === subcategorySlug);
}
