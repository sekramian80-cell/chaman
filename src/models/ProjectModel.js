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

function mapGallery(item, fallbackImage, fallbackAlt) {
    const raw = item.acf?.gallery;

    if (Array.isArray(raw) && raw.length) {
        return raw
            .map((entry) => {
                if (typeof entry === 'string') {
                    return { url: entry, alt: fallbackAlt };
                }
                if (entry?.url) {
                    return { url: entry.url, alt: entry.alt || fallbackAlt };
                }
                return null;
            })
            .filter(Boolean);
    }

    if (fallbackImage) {
        return [{ url: fallbackImage, alt: fallbackAlt }];
    }

    return [];
}

/**
 * پیدا کردن پروژه با اسلاگ یا id
 */
export function findProjectBySlug(items = [], slug = '') {
    if (slug === undefined || slug === null || slug === '') return null;

    const raw = String(slug).trim();
    const normalized = normalizeProjectKey(raw);

    return (
        items.find((item) => {
            const itemSlug = String(item.slug || '').trim();
            const itemId = String(item.id ?? '');

            return (
                itemSlug === raw ||
                itemId === raw ||
                normalizeProjectKey(itemSlug) === normalized ||
                normalizeProjectKey(itemId) === normalized
            );
        }) || null
    );
}

import { getProjectDetailPath, normalizeProjectKey } from '../utils/routing.js';

/**
 * تبدیل داده‌های API به مدل Project
 * @param {Array<Object>} apiItems
 */
export function mapProjectsFromAPI(apiItems = []) {
    if (!Array.isArray(apiItems)) return [];

    return apiItems.map((item) => {
        const taxonomy = resolveProjectTaxonomy(item);
        const title = stripHtml(item.title?.rendered) || '';
        const slug = item.slug || String(item.id);
        const image =
            item._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            item.acf?.gallery?.[0]?.url ||
            defaultProjectImage;
        const imageAlt = title || 'نمونه کار چمن مصنوعی';
        const contentHtml = item.content?.rendered || '';
        const contentText = stripHtml(contentHtml);
        const description =
            item.acf?.short_description ||
            stripHtml(item.excerpt?.rendered) ||
            contentText ||
            '';

        return {
            id: item.id,
            title,
            meta: buildProjectMeta(item),
            location: item.acf?.project_location || '',
            description,
            contentHtml,
            contentText,
            image,
            imageAlt,
            gallery: mapGallery(item, image, imageAlt),
            slug,
            href: getProjectDetailPath({ slug, id: item.id }),
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
