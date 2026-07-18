/**
 * محتوای بخش محصولات
 * نکته: این‌ها داده‌های محلی fallback هستند. وقتی WooCommerce داده بدهد،
 * جای این‌ها را محصولات واقعی می‌گیرد (contentService → buildProductsState).
 */
import { Droplets, Factory, Leaf, Sun } from "lucide-react";
import heroArtificialGrass from "../assets/hero-artificial-grass.jpg";
import residentialBalconyImage from "../assets/services/residential-balcony.jpg";
import rooftopGardenImage from "../assets/services/rooftop-garden.jpg";
import sportsFieldImage from "../assets/services/sports-field.jpg";
import villaYardImage from "../assets/services/villa-yard.jpg";
import footballImage from "../assets/subcategories/football.jpg";

export const productHighlights = [
    {
        id: 1,
        icon: Leaf,
        title: "ظاهر طبیعی",
        text: "ترکیب چند طیف سبز و بافت کاهگل برای نزدیک شدن به چمن واقعی.",
    },
    {
        id: 2,
        icon: Sun,
        title: "مقاوم در آفتاب",
        text: "الیاف UV-stable برای کاهش رنگ‌پریدگی در فضای باز.",
    },
    {
        id: 3,
        icon: Droplets,
        title: "زهکشی سریع",
        text: "سوراخ‌گذاری منظم برای عبور آب و شستشوی راحت.",
    },
    {
        id: 4,
        icon: Factory,
        title: "تنوع تراکم",
        text: "گزینه‌های اقتصادی، پرمیوم و پرتردد بر اساس کاربرد پروژه.",
    },
];

export const sportsProducts = [
    {
        id: "chaman-test-sample",
        slug: "chaman-test-sample",
        title: "چمن مصنوعی تستی فوتبال",
        text: "این یک محصول نمونه است تا نمایش صفحهٔ محصول در سایت بررسی شود. چمن مصنوعی مخصوص زمین فوتبال با ارتفاع ۴۰ میلی‌متر.",
        meta: "ارتفاع ۴۰ میل | مناسب زمین فوتبال",
        priceAmount: 250000,
        priceLabel: "۲۵۰٬۰۰۰ ریال",
        currencySymbol: "ریال",
        image: footballImage,
        imageAlt: "چمن مصنوعی تستی فوتبال",
        gallery: [
            { url: footballImage, alt: "چمن مصنوعی تستی فوتبال" },
            { url: sportsFieldImage, alt: "نمای زمین فوتبال با چمن مصنوعی" },
        ],
        contentHtml:
            "<p>محصول نمونه برای بررسی طراحی صفحهٔ محصول.</p><ul><li>ارتفاع پرز: ۴۰ میلی‌متر</li><li>مناسب زمین فوتبال و فوتسال</li><li>الیاف ضدآفتاب (UV)</li></ul>",
        primaryCategory: "sports",
        subcategory: "football",
        subcategoryLabel: "فوتبال",
        categories: ["sports", "football"],
    },
    {
        id: "sport-1",
        slug: "zamin-football-standard",
        title: "زمین فوتبال استاندارد",
        text: "اجرای چمن ورزشی با تراکم مناسب برای تمرین و بازی.",
        meta: "۷۱۱ متر مربع | تهران",
        image: sportsFieldImage,
        imageAlt: "زمین فوتبال با چمن مصنوعی ورزشی",
        primaryCategory: "sports",
        subcategory: "football",
        subcategoryLabel: "فوتبال",
        categories: ["sports", "football"],
    },
    {
        id: "sport-2",
        slug: "zamin-futsal",
        title: "زمین فوتسال",
        text: "چمن مقاوم برای تردد بالا و بازی‌های سریع.",
        meta: "۴۲۰ متر مربع | کرج",
        image: sportsFieldImage,
        imageAlt: "زمین فوتسال با چمن مصنوعی",
        primaryCategory: "sports",
        subcategory: "futsal",
        subcategoryLabel: "فوتسال",
        categories: ["sports", "futsal"],
    },
    {
        id: "sport-3",
        slug: "mohavate-varzeshi-madrese",
        title: "محوطه ورزشی مدرسه",
        text: "اجرای ایمن و یکنواخت برای فضاهای آموزشی.",
        meta: "۶۰۰ متر مربع | تهران",
        image: sportsFieldImage,
        imageAlt: "محوطه ورزشی مدرسه با چمن مصنوعی",
        primaryCategory: "sports",
        subcategory: "school",
        subcategoryLabel: "مدرسه",
        categories: ["sports", "school"],
    },
    {
        id: "sport-4",
        slug: "zamin-chand-manzure",
        title: "زمین چندمنظوره",
        text: "مناسب برای ورزش‌های مختلف با نگهداری آسان.",
        meta: "۵۰۰ متر مربع | البرز",
        image: sportsFieldImage,
        imageAlt: "زمین چندمنظوره با چمن مصنوعی",
        primaryCategory: "sports",
        subcategory: "football",
        subcategoryLabel: "فوتبال",
        categories: ["sports", "football"],
    },
];

export const decorativeProducts = [
    {
        id: "decor-1",
        slug: "hayat-villaei",
        title: "حیاط ویلایی",
        text: "چمن نرم و طبیعی برای فضای نشیمن بیرونی.",
        meta: "۲۴۰ متر مربع | کردان",
        image: villaYardImage,
        imageAlt: "حیاط ویلایی با چمن مصنوعی تزیینی",
        primaryCategory: "decorative",
        subcategory: "villa",
        subcategoryLabel: "ویلا",
        categories: ["decorative", "villa"],
    },
    {
        id: "decor-2",
        slug: "roof-garden-modern",
        title: "روف گاردن مدرن",
        text: "سطح سبز کم‌نگهداری برای تراس و پشت‌بام.",
        meta: "۱۲۰ متر مربع | تهران",
        image: rooftopGardenImage,
        imageAlt: "روف گاردن با چمن مصنوعی",
        primaryCategory: "decorative",
        subcategory: "rooftop",
        subcategoryLabel: "پشت بام",
        categories: ["decorative", "rooftop"],
    },
    {
        id: "decor-3",
        slug: "teras-va-balkon",
        title: "تراس و بالکن",
        text: "اجرای تمیز برای فضاهای کوچک با ظاهر لوکس.",
        meta: "۴۵ متر مربع | کرج",
        image: residentialBalconyImage,
        imageAlt: "تراس با چمن مصنوعی",
        primaryCategory: "decorative",
        subcategory: "terrace-balcony",
        subcategoryLabel: "تراس و بالکن",
        categories: ["decorative", "terrace-balcony"],
    },
    {
        id: "decor-4",
        slug: "mohavate-sabz-villa",
        title: "محوطه سبز ویلا",
        text: "ترکیب چمن و مسیر پیاده‌روی با جزئیات دقیق.",
        meta: "۳۱۰ متر مربع | شهریار",
        image: heroArtificialGrass,
        imageAlt: "محوطه سبز ویلا با چمن مصنوعی",
        primaryCategory: "decorative",
        subcategory: "villa",
        subcategoryLabel: "ویلا",
        categories: ["decorative", "villa"],
    },
];

/** @deprecated از sportsProducts و decorativeProducts استفاده کنید */
export const productCards = [...sportsProducts, ...decorativeProducts];

export const productShowcaseBadge = {
    text: "نصب تمیز، برش دقیق، تحویل آماده استفاده",
    imageSlug: "hero-artificial-grass",
};
