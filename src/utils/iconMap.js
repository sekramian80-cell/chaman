import * as LucideIcons from 'lucide-react';
import { Home } from 'lucide-react';

/**
 * تبدیل نام آیکون ذخیره‌شده در وردپرس به کامپوننت lucide-react
 * @param {string} name
 * @param {import('react').ComponentType} fallback
 */
export function resolveIcon(name, fallback = Home) {
    if (!name || typeof name !== 'string') return fallback;

    const Icon = LucideIcons[name.trim()];
    return Icon || fallback;
}
