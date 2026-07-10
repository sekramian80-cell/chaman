/**
 * محتوای بخش پروژه‌های نمونه
 */
import { MapPin, Ruler, Sparkles } from "lucide-react";

export const projects = [
    {
        id: 1,
        title: "روف گاردن خانوادگی",
        meta: "۱۲۰ متر مربع | تهران",
        description: "چمن پرمیوم با مسیر سنگی، زهکشی تقویت شده و لبه‌کاری مخفی.",
    },
    {
        id: 2,
        title: "حیاط ویلایی",
        meta: "۲۴۰ متر مربع | کردان",
        description: "ترکیب چمن چندبافت با فضای نشیمن و مسیر رفت‌وآمد پرتردد.",
    },
    {
        id: 3,
        title: "محوطه کافه",
        meta: "۸۵ متر مربع | کرج",
        description: "اجرای سریع، قابل شستشو و مناسب برای تردد روزانه مشتریان.",
    },
];

export const projectStats = [
    { icon: Ruler, value: "۴۵۰ متر", label: "نمونه متراژ ماهانه" },
    { icon: MapPin, value: "تهران و کرج", label: "مناطق پرتکرار اجرا" },
    { icon: Sparkles, value: "۳ سبک", label: "مسکونی، تجاری، روف" },
];
