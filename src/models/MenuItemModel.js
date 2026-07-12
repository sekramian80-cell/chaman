import { normalizeMenuHref, normalizeMenuPath } from '../utils/menuUrl.js';
import { stripHtml } from '../utils/html.js';

function getMenuLabel(item) {
    return stripHtml(item.label || item.title?.rendered || item.title || item.post_title || '');
}

function mapFlatMenuItem(item) {
    const href = normalizeMenuHref(item.url || item.href || '/');

    return {
        id: item.id ?? item.ID,
        label: getMenuLabel(item),
        href,
        path: normalizeMenuPath(href),
        parent: Number(item.parent ?? item.menu_item_parent ?? 0),
        order: Number(item.order ?? item.menu_order ?? 0),
        children: [],
    };
}

function attachChildren(items) {
    const byId = new Map(items.map((item) => [item.id, item]));
    const roots = [];

    for (const item of items) {
        const parent = byId.get(item.parent);
        if (parent) {
            parent.children.push(item);
        } else {
            roots.push(item);
        }
    }

    const prune = (nodes) =>
        nodes
            .sort((a, b) => a.order - b.order)
            .map((node) => ({
                ...node,
                children: node.children.length ? prune(node.children) : undefined,
            }));

    return prune(roots);
}

/**
 * تبدیل لیست تخت یا درختی منوی وردپرس به ساختار منوی React
 * @param {Array<Object>} apiItems
 */
export function mapMenuTree(apiItems = []) {
    if (!apiItems.length) return [];

    const hasNestedChildren = apiItems.some((item) => Array.isArray(item.children) && item.children.length > 0);

    if (hasNestedChildren) {
        const mapNested = (nodes) =>
            nodes
                .map((item) => {
                    const href = normalizeMenuHref(item.url || item.href || '/');
                    return {
                        id: item.id ?? item.ID,
                        label: getMenuLabel(item),
                        href,
                        path: normalizeMenuPath(href),
                        order: Number(item.order ?? item.menu_order ?? 0),
                        children: item.children?.length ? mapNested(item.children) : undefined,
                    };
                })
                .sort((a, b) => a.order - b.order);

        return mapNested(apiItems);
    }

    return attachChildren(apiItems.map(mapFlatMenuItem));
}

/** @deprecated از mapMenuTree استفاده کنید */
export function mapMenuItems(apiItems = []) {
    return mapMenuTree(apiItems);
}
