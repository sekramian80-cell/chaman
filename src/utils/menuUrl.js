/**
 * تبدیل URL وردپرس به مسیر داخلی SPA
 */

/**
 * مسیرهای ووکامرس را به مسیرهای React نگاشت می‌کند:
 *   /product-category/<...>/<slug>  →  /products/<slug>
 *   /shop                            →  /products
 * (مسیر تک‌محصول /product/<slug> با روتِ React یکی است و تغییری لازم ندارد)
 */
function mapWooPathToApp(path = '/') {
    const catMatch = path.match(/^\/product-category\/(.+?)\/?$/);
    if (catMatch) {
        const segments = catMatch[1].split('/').filter(Boolean);
        const slug = segments[segments.length - 1];
        return slug ? `/products/${slug}` : '/products';
    }

    if (path === '/shop' || path === '/shop/') return '/products';

    return path;
}

export function normalizeMenuPath(url = '/') {
    if (!url || url === '#') return '/';

    let path;

    if (url.startsWith('/')) {
        path = url.split('?')[0].split('#')[0] || '/';
    } else {
        try {
            const parsed = new URL(url);
            path = parsed.pathname || '/';
        } catch {
            path = url.startsWith('/') ? url : `/${url}`;
        }
    }

    path = mapWooPathToApp(path);

    return path.length > 1 ? path.replace(/\/$/, '') : path;
}

export function normalizeMenuHref(url = '/') {
    const path = normalizeMenuPath(url);
    return path || '/';
}
