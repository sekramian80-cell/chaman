import {
    BadgeCheck,
    Building2,
    CalendarCheck,
    CheckCircle2,
    ClipboardList,
    Droplets,
    Factory,
    FileText,
    Flower2,
    Hammer,
    HelpCircle,
    Home,
    Leaf,
    MapPin,
    MessageCircle,
    MessagesSquare,
    Phone,
    PhoneCall,
    Ruler,
    ShieldCheck,
    Sparkles,
    Sun,
    Timer,
    Trophy,
} from 'lucide-react';

/**
 * فقط آیکون‌های استفاده‌شده در سایت/وردپرس
 * (به‌جای import * از lucide که کل کتابخانه را به باندل می‌آورد)
 */
const ICON_MAP = {
    BadgeCheck,
    Building2,
    CalendarCheck,
    CheckCircle2,
    ClipboardList,
    Droplets,
    Factory,
    FileText,
    Flower2,
    Hammer,
    HelpCircle,
    Home,
    Leaf,
    MapPin,
    MessageCircle,
    MessagesSquare,
    Phone,
    PhoneCall,
    Ruler,
    ShieldCheck,
    Sparkles,
    Sun,
    Timer,
    Trophy,
};

/**
 * تبدیل نام آیکون ذخیره‌شده در وردپرس به کامپوننت lucide-react
 * @param {string} name
 * @param {import('react').ComponentType} fallback
 */
export function resolveIcon(name, fallback = Home) {
    if (!name || typeof name !== 'string') return fallback;

    const key = name.trim();
    return ICON_MAP[key] || fallback;
}
