/**
 * مدل داده برای پروژه‌های نمونه (نمونه کارها)
 */
import defaultProjectImage from '../assets/hero-artificial-grass.jpg';
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

function resolveProjectTaxonomy(item) {
    const slugs = extractCategorySlugs(item);
    const primaryCategory =
        item.acf?.primary_category || slugs.find((slug) => mainCategorySlugs.includes(slug)) || '';
    const subcategory =
        item.acf?.subcategory || slugs.find((slug) => !mainCategorySlugs.includes(slug)) || '';

    return {
        primaryCategory,
        subcategory,
        subcategoryLabel:
            item.acf?.subcategory_label || getSubcategoryLabel(primaryCategory, subcategory) || '',
    };
}

function buildProjectMeta(item) {
    const parts = [];

    if (item.acf?.project_meta) parts.push(item.acf.project_meta);
    if (item.acf?.project_location) parts.push(item.acf.project_location);

    return parts.join(' · ') || stripHtml(item.excerpt?.rendered) || '';
}

/**
 * تبدیل داده‌های API به مدل Project
 * @param {Array<Object>} apiItems
 */
export function mapProjectsFromAPI(apiItems = []) {
    return apiItems.map((item) => {
        const taxonomy = resolveProjectTaxonomy(item);

        return {
            id: item.id,
            title: stripHtml(item.title?.rendered) || '',
            meta: buildProjectMeta(item),
            description:
                item.acf?.short_description ||
                stripHtml(item.excerpt?.rendered) ||
                stripHtml(item.content?.rendered) ||
                '',
            image:
                item._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                item.acf?.gallery?.[0]?.url ||
                defaultProjectImage,
            imageAlt: stripHtml(item.title?.rendered) || 'نمونه کار چمن مصنوعی',
            gallery: item.acf?.gallery || [],
            slug: item.slug || '',
            primaryCategory: taxonomy.primaryCategory,
            subcategory: taxonomy.subcategory,
            subcategoryLabel: taxonomy.subcategoryLabel,
        };
    });
}

/** @deprecated از mapProjectsFromAPI استفاده کنید */
export function mapProjects(apiItems = []) {
    return mapProjectsFromAPI(apiItems);
}
