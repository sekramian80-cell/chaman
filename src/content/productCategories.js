/**
 * تنظیمات دسته‌بندی محصولات
 * slugها باید با taxonomy وردپرس (product_category) یکی باشند
 */
export const productCategoryConfig = {
    sports: {
        slug: "sports",
        title: "چمن مصنوعی ورزشی",
        eyebrow: "پروژه‌های ورزشی",
        description:
            "نمونه اجراهای چمن مصنوعی برای زمین فوتبال، فوتسال، مدرسه و فضاهای ورزشی با تمرکز بر دوام و ایمنی.",
        path: "/products/sports",
        previewLimit: 4,
    },
    decorative: {
        slug: "decorative",
        title: "چمن مصنوعی تزیینی",
        eyebrow: "پروژه‌های تزیینی",
        description:
            "نمونه اجراهای چمن مصنوعی برای ویلا، تراس، روف گاردن و فضاهای مسکونی و تجاری با ظاهر طبیعی‌تر.",
        path: "/products/decorative",
        previewLimit: 4,
    },
};

export const productCategoryList = Object.values(productCategoryConfig);
