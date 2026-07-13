/**
 * داده اسلایدر زیردسته‌ها — صفحه اصلی
 * عکس‌ها از Wikimedia Commons (لایسنس آزاد) دانلود شده‌اند.
 */
import { productSubcategories } from './productSubcategories.js';

const subcategoryImages = import.meta.glob('../assets/subcategories/*.jpg', {
    eager: true,
    import: 'default',
});

function imageForSlug(slug) {
    const entry = Object.entries(subcategoryImages).find(([path]) =>
        path.endsWith(`/${slug}.jpg`),
    );
    return entry ? entry[1] : null;
}

const categoryPaths = {
    sports: '/products/sports',
    decorative: '/products/decorative',
};

function buildSliderItems(parent, items) {
    return items.map((item) => ({
        slug: item.slug,
        label: item.label,
        title: `چمن مصنوعی ${item.label}`,
        href: categoryPaths[parent],
        image: imageForSlug(item.slug),
        parent,
    }));
}

export const subcategorySliderItems = [
    ...buildSliderItems('sports', productSubcategories.sports),
    ...buildSliderItems('decorative', productSubcategories.decorative),
].filter((item) => item.image);
