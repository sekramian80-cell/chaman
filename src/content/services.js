/**
 * محتوای بخش خدمات
 * هر آیتم می‌تواند در آینده از طریق Custom Post Type یا Page از API دریافت شود
 */
import {
    Building2,
    ClipboardList,
    Droplets,
    Home,
    Sparkles,
    Timer,
    Trophy,
} from "lucide-react";
import heroArtificialGrass from "../assets/hero-artificial-grass.jpg";
import commercialSpaceImage from "../assets/services/commercial-space.jpg";
import fastInstallationImage from "../assets/services/fast-installation.jpg";
import residentialBalconyImage from "../assets/services/residential-balcony.jpg";
import rooftopGardenImage from "../assets/services/rooftop-garden.jpg";
import sportsFieldImage from "../assets/services/sports-field.jpg";
import villaYardImage from "../assets/services/villa-yard.jpg";

export const services = [
    {
        id: 1,
        icon: Home,
        image: villaYardImage,
        imageAlt: "حیاط ویلایی اجراشده با چمن مصنوعی",
        title: "ویلا، حیاط و تراس",
        tag: "مسکونی",
        highlight: "مناسب نشیمن، آلاچیق و محوطه سبز",
        description: "اجرای چمن نرم و طبیعی برای فضاهای نشیمن، دور استخر، آلاچیق و مسیرهای باغی.",
    },
    {
        id: 2,
        icon: Building2,
        image: rooftopGardenImage,
        imageAlt: "روف گاردن مدرن با چمن مصنوعی",
        title: "روف گاردن و فضای تجاری",
        tag: "تجاری",
        highlight: "ظاهر لوکس با نگهداری کم",
        description: "طراحی سطح سبز کم‌نگهداری برای کافه، دفتر، شوروم، هتل و ورودی ساختمان.",
    },
    {
        id: 3,
        icon: Trophy,
        image: sportsFieldImage,
        imageAlt: "زمین ورزشی با چمن مصنوعی حرفه‌ای",
        title: "ورزشی و زمین بازی",
        tag: "ورزشی",
        highlight: "دوام بالا برای تردد زیاد",
        description: "انتخاب تراکم، ارتفاع نخ و زیرسازی مناسب برای استفاده پرتردد و ایمن.",
    },
    {
        id: 4,
        icon: Sparkles,
        image: residentialBalconyImage,
        imageAlt: "بالکن مسکونی پوشیده‌شده با چمن مصنوعی",
        title: "بالکن و تراس کوچک",
        tag: "مسکونی",
        highlight: "اجرای تمیز در متراژ محدود",
        description: "ایده‌آل برای بالکن، تراس کوچک و فضاهای نشیمن بیرونی با برش دقیق و ظاهر طبیعی.",
    },
    {
        id: 5,
        icon: Droplets,
        image: heroArtificialGrass,
        imageAlt: "چمن مصنوعی کنار استخر و محوطه سبز",
        title: "دور استخر و محوطه سبز",
        tag: "ویلایی",
        highlight: "زهکشی مناسب و شستشوی آسان",
        description: "انتخاب مدل مقاوم در برابر رطوبت برای کنار استخر، آلاچیق و مسیرهای سبز باغی.",
    },
    {
        id: 6,
        icon: Timer,
        image: fastInstallationImage,
        imageAlt: "اجرای سریع و دقیق چمن مصنوعی",
        title: "اجرای سریع و تحویل فوری",
        tag: "اجرایی",
        highlight: "مناسب پروژه‌های زمان‌محور",
        description: "برای پروژه‌هایی که زمان تحویل کوتاه دارند و نیاز به برش، نصب و تحویل سریع دارند.",
    },
];

export const servicePlans = [
    {
        id: 1,
        icon: Sparkles,
        image: residentialBalconyImage,
        imageAlt: "بالکن مسکونی پوشیده‌شده با چمن مصنوعی",
        title: "پکیج فضای مسکونی",
        text: "برای حیاط، بالکن، دور استخر و مسیرهای باغی با ظاهر طبیعی و نگهداری ساده.",
    },
    {
        id: 2,
        icon: Timer,
        image: fastInstallationImage,
        imageAlt: "اجرای سریع و دقیق چمن مصنوعی",
        title: "پکیج اجرای سریع",
        text: "مناسب پروژه‌هایی که زمان تحویل کوتاه دارند و نیاز به برش و نصب دقیق دارند.",
    },
    {
        id: 3,
        icon: ClipboardList,
        image: commercialSpaceImage,
        imageAlt: "فضای تجاری مدرن با چمن مصنوعی",
        title: "پکیج تجاری",
        text: "برای کافه، شوروم و ورودی ساختمان با تمرکز روی دوام، شستشوی راحت و رفت‌وآمد بالا.",
    },
];

export const serviceChecklist = ["بازدید و اندازه‌گیری", "پیشنهاد مدل و بودجه", "آماده‌سازی سطح", "نصب و تحویل نهایی"];
