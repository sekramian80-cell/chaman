/**
 * زیردسته‌های محصول — هماهنگ با taxonomy وردپرس
 */
export const productSubcategories = {
    sports: [
        { slug: 'football', label: 'فوتبال' },
        { slug: 'club', label: 'باشگاه' },
        { slug: 'padel', label: 'پدل' },
        { slug: 'golf', label: 'گلف' },
        { slug: 'tennis', label: 'تنیس' },
        { slug: 'paintball', label: 'پینت بال' },
        { slug: 'futsal', label: 'فوتسال' },
        { slug: 'school', label: 'مدرسه' },
        { slug: 'hockey', label: 'هاکی' },
    ],
    decorative: [
        { slug: 'restaurant', label: 'رستوران' },
        { slug: 'rooftop', label: 'پشت بام' },
        { slug: 'terrace-balcony', label: 'تراس و بالکن' },
        { slug: 'kindergarten', label: 'مهدکودک' },
        { slug: 'garden', label: 'باغ' },
        { slug: 'patio', label: 'پاسیو' },
        { slug: 'hall', label: 'تالار' },
        { slug: 'yard', label: 'حیاط' },
        { slug: 'workplace', label: 'محیط کار' },
        { slug: 'villa', label: 'ویلا' },
        { slug: 'tile-grass', label: 'تایلی' },
        { slug: 'wall-grass', label: 'دیواری' },
        { slug: 'moketi', label: 'موکتی' },
        { slug: 'grass-fence', label: 'فنس چمن' },
    ],
};

export const mainCategorySlugs = ['sports', 'decorative'];

export function getSubcategoryLabel(parentSlug, subcategorySlug) {
    const match = productSubcategories[parentSlug]?.find((item) => item.slug === subcategorySlug);
    return match?.label || subcategorySlug || '';
}
