/**
 * محتوای بخش خدمات
 * هر آیتم می‌تواند در آینده از طریق Custom Post Type یا Page از API دریافت شود
 */
import { Building2, ClipboardList, Home, Sparkles, Timer, Trophy } from "lucide-react";

export const services = [
    {
        id: 1,
        icon: Home,
        title: "ویلا، حیاط و تراس",
        description: "اجرای چمن نرم و طبیعی برای فضاهای نشیمن، دور استخر، آلاچیق و مسیرهای باغی.",
    },
    {
        id: 2,
        icon: Building2,
        title: "روف گاردن و فضای تجاری",
        description: "طراحی سطح سبز کم‌نگهداری برای کافه، دفتر، شوروم، هتل و ورودی ساختمان.",
    },
    {
        id: 3,
        icon: Trophy,
        title: "ورزشی و زمین بازی",
        description: "انتخاب تراکم، ارتفاع نخ و زیرسازی مناسب برای استفاده پرتردد و ایمن.",
    },
];

export const servicePlans = [
    {
        id: 1,
        icon: Sparkles,
        title: "پکیج فضای مسکونی",
        text: "برای حیاط، بالکن، دور استخر و مسیرهای باغی با ظاهر طبیعی و نگهداری ساده.",
    },
    {
        id: 2,
        icon: Timer,
        title: "پکیج اجرای سریع",
        text: "مناسب پروژه‌هایی که زمان تحویل کوتاه دارند و نیاز به برش و نصب دقیق دارند.",
    },
    {
        id: 3,
        icon: ClipboardList,
        title: "پکیج تجاری",
        text: "برای کافه، شوروم و ورودی ساختمان با تمرکز روی دوام، شستشوی راحت و رفت‌وآمد بالا.",
    },
];

export const serviceChecklist = ["بازدید و اندازه‌گیری", "پیشنهاد مدل و بودجه", "آماده‌سازی سطح", "نصب و تحویل نهایی"];
