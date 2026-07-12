/**
 * تبدیل URL وردپرس به مسیر داخلی SPA
 */
export function normalizeMenuPath(url = '/') {
    if (!url || url === '#') return '/';

    if (url.startsWith('/')) return url.split('?')[0].split('#')[0] || '/';

    try {
        const parsed = new URL(url);
        const path = parsed.pathname || '/';
        return path.length > 1 ? path.replace(/\/$/, '') : path;
    } catch {
        return url.startsWith('/') ? url : `/${url}`;
    }
}

export function normalizeMenuHref(url = '/') {
    const path = normalizeMenuPath(url);
    return path || '/';
}
