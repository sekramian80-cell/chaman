import { CONFIG } from '../config/index.js';
import { mapMenuTree } from '../models/MenuItemModel.js';

const API_ROOT = CONFIG.API_BASE_URL.replace(/\/wp\/v2$/, '');

async function fetchJson(url) {
    const requestUrl = new URL(url);
    requestUrl.searchParams.set('_', Date.now().toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST.TIMEOUT);

    try {
        const response = await fetch(requestUrl.toString(), {
            signal: controller.signal,
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Menu API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function tryCustomMenuEndpoint(slug) {
    const data = await fetchJson(`${API_ROOT}/faraz/v1/menu/${encodeURIComponent(slug)}`);
    return Array.isArray(data) ? data : data?.items || [];
}

async function tryPluginMenuEndpoint(slug) {
    const data = await fetchJson(`${API_ROOT}/wp-api-menus/v2/menus/${encodeURIComponent(slug)}`);
    return data?.items || [];
}

/**
 * دریافت منو از endpoint سبک و مستقل faraz/v1/site-menu (سریع و مطمئن)
 */
export async function fetchSiteMenu() {
    const base = CONFIG.WC?.FAST_URL;
    if (!base) return [];

    try {
        const data = await fetchJson(`${base.replace(/\/$/, '')}/site-menu`);
        return mapMenuTree(Array.isArray(data) ? data : []);
    } catch {
        return [];
    }
}

/**
 * دریافت منوی اصلی از وردپرس
 */
export async function fetchNavigationMenu() {
    const candidates = [...new Set([CONFIG.MENU.LOCATION, CONFIG.MENU.SLUG].filter(Boolean))];

    for (const slug of candidates) {
        for (const loader of [tryCustomMenuEndpoint, tryPluginMenuEndpoint]) {
            try {
                const rawItems = await loader(slug);
                const items = mapMenuTree(rawItems);
                if (items.length) return items;
            } catch {
                // منبع بعدی
            }
        }
    }

    return [];
}
