/**
 * محتوای بخش محصولات
 */
import { Droplets, Factory, Leaf, Sun } from "lucide-react";
import heroArtificialGrass from "../assets/hero-artificial-grass.jpg";
import residentialBalconyImage from "../assets/services/residential-balcony.jpg";
import rooftopGardenImage from "../assets/services/rooftop-garden.jpg";
import sportsFieldImage from "../assets/services/sports-field.jpg";
import villaYardImage from "../assets/services/villa-yard.jpg";

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
        id: "sport-1",
        title: "زمین فوتبال استاندارد",
        text: "اجرای چمن ورزشی با تراکم مناسب برای تمرین و بازی.",
        meta: "۷۱۱ متر مربع | تهران",
        image: sportsFieldImage,
        imageAlt: "زمین فوتبال با چمن مصنوعی ورزشی",
        categories: ["sports"],
    },
    {
        id: "sport-2",
        title: "زمین فوتسال",
        text: "چمن مقاوم برای تردد بالا و بازی‌های سریع.",
        meta: "۴۲۰ متر مربع | کرج",
        image: sportsFieldImage,
        imageAlt: "زمین فوتسال با چمن مصنوعی",
        categories: ["sports"],
    },
    {
        id: "sport-3",
        title: "محوطه ورزشی مدرسه",
        text: "اجرای ایمن و یکنواخت برای فضاهای آموزشی.",
        meta: "۶۰۰ متر مربع | تهران",
        image: sportsFieldImage,
        imageAlt: "محوطه ورزشی مدرسه با چمن مصنوعی",
        categories: ["sports"],
    },
    {
        id: "sport-4",
        title: "زمین چندمنظوره",
        text: "مناسب برای ورزش‌های مختلف با نگهداری آسان.",
        meta: "۵۰۰ متر مربع | البرز",
        image: sportsFieldImage,
        imageAlt: "زمین چندمنظوره با چمن مصنوعی",
        categories: ["sports"],
    },
];

export const decorativeProducts = [
    {
        id: "decor-1",
        title: "حیاط ویلایی",
        text: "چمن نرم و طبیعی برای فضای نشیمن بیرونی.",
        meta: "۲۴۰ متر مربع | کردان",
        image: villaYardImage,
        imageAlt: "حیاط ویلایی با چمن مصنوعی تزیینی",
        categories: ["decorative"],
    },
    {
        id: "decor-2",
        title: "روف گاردن مدرن",
        text: "سطح سبز کم‌نگهداری برای تراس و پشت‌بام.",
        meta: "۱۲۰ متر مربع | تهران",
        image: rooftopGardenImage,
        imageAlt: "روف گاردن با چمن مصنوعی",
        categories: ["decorative"],
    },
    {
        id: "decor-3",
        title: "تراس و بالکن",
        text: "اجرای تمیز برای فضاهای کوچک با ظاهر لوکس.",
        meta: "۴۵ متر مربع | کرج",
        image: residentialBalconyImage,
        imageAlt: "تراس با چمن مصنوعی",
        categories: ["decorative"],
    },
    {
        id: "decor-4",
        title: "محوطه سبز ویلا",
        text: "ترکیب چمن و مسیر پیاده‌روی با جزئیات دقیق.",
        meta: "۳۱۰ متر مربع | شهریار",
        image: heroArtificialGrass,
        imageAlt: "محوطه سبز ویلا با چمن مصنوعی",
        categories: ["decorative"],
    },
];

/** @deprecated از sportsProducts و decorativeProducts استفاده کنید */
export const productCards = [...sportsProducts, ...decorativeProducts];

export const productShowcaseBadge = {
    text: "نصب تمیز، برش دقیق، تحویل آماده استفاده",
    imageSlug: "hero-artificial-grass",
};
