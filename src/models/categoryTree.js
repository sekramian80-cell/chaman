/**
 * ساخت درخت دسته‌بندی داینامیک از دسته‌های ووکامرس + گروه‌بندی محصولات
 * زیرِ هر دسته، محصولاتِ همان دسته و همهٔ زیردسته‌هایش قرار می‌گیرند.
 */

/**
 * گسترش اسلاگ‌های دستهٔ یک محصول به همراه همهٔ والدها (تا محصولِ زیردسته زیر والد هم دیده شود)
 */
function expandAncestors(slugs, categoryMap) {
    const set = new Set();
    (slugs || []).forEach((slug) => {
        if (!slug) return;
        set.add(slug);
        let node = categoryMap?.bySlug?.get(slug);
        let guard = 0;
        while (node?.parent && guard < 12) {
            const parent = categoryMap?.byId?.get(node.parent);
            if (!parent) break;
            set.add(parent.slug);
            node = parent;
            guard += 1;
        }
    });
    return set;
}

/**
 * گروه‌بندی محصولات بر اساس هر اسلاگ دسته (شاملِ والدها)
 * @returns {Record<string, Array>}
 */
export function groupProductsByCategory(products = [], categoryMap) {
    const byCategory = {};
    products.forEach((product) => {
        const expanded = expandAncestors(product.categories, categoryMap);
        expanded.forEach((slug) => {
            if (!byCategory[slug]) byCategory[slug] = [];
            byCategory[slug].push(product);
        });
    });
    return byCategory;
}

/**
 * ساخت درخت مرتب‌شدهٔ دسته‌ها (فقط دسته‌هایی که محصول دارند)
 * @param {Array<{id:number,name:string,slug:string,parent:number}>} wooCategories
 * @param {Record<string, Array>} byCategory
 */
export function buildCategoryTree(wooCategories = [], byCategory = {}) {
    const nodes = wooCategories
        .filter((cat) => cat?.slug)
        .map((cat) => ({
            id: cat.id,
            slug: cat.slug,
            title: cat.name || cat.slug,
            parent: Number(cat.parent || 0),
            count: byCategory[cat.slug]?.length || 0,
            children: [],
        }));

    const byId = new Map(nodes.map((node) => [node.id, node]));
    const roots = [];

    nodes.forEach((node) => {
        const parent = node.parent ? byId.get(node.parent) : null;
        if (parent) parent.children.push(node);
        else roots.push(node);
    });

    const imageFor = (slug) => (byCategory[slug]?.[0]?.image) || null;

    const prune = (arr) =>
        arr
            .filter((node) => node.count > 0)
            .sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fa'))
            .map((node) => ({
                slug: node.slug,
                title: node.title,
                count: node.count,
                image: imageFor(node.slug),
                children: node.children.length ? prune(node.children) : [],
            }));

    return prune(roots);
}

/**
 * پیدا کردن یک گره (top-level یا فرزند) در درخت بر اساس اسلاگ
 */
export function findCategoryNode(tree = [], slug) {
    if (!slug) return null;
    for (const node of tree) {
        if (node.slug === slug) return node;
        const child = findCategoryNode(node.children || [], slug);
        if (child) return child;
    }
    return null;
}
