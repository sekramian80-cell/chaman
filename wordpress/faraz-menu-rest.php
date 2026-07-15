/**
 * فراز چمن — منوی REST + اطمینان از آیتم «نمونه کارها»
 *
 * این فایل را در Code Snippets جایگزین اسنیپت منو کنید (یا آپدیت کنید).
 */

add_action('after_setup_theme', function () {
    register_nav_menus([
        'primary' => 'منوی اصلی سایت',
    ]);
});

add_action('rest_api_init', function () {
    register_rest_route('faraz/v1', '/menu/(?P<slug>[a-zA-Z0-9_\-%]+)', [
        'methods' => 'GET',
        'callback' => 'faraz_rest_get_menu',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * اگر «نمونه کارها» در منوی اصلی نباشد، به‌صورت خودکار اضافه می‌کند.
 */
add_action('init', function () {
    if (get_option('faraz_projects_menu_ensured_v2')) {
        return;
    }

    $menu = faraz_resolve_primary_menu();
    if (!$menu) {
        return;
    }

    $items = wp_get_nav_menu_items($menu->term_id) ?: [];
    $has_projects = false;

    foreach ($items as $item) {
        $path = wp_parse_url($item->url ?? '', PHP_URL_PATH);
        $path = $path ? untrailingslashit($path) : '';

        if ($path === '/projects' || mb_strpos($item->title ?? '', 'نمونه کار') !== false) {
            $has_projects = true;

            if (($item->title ?? '') !== 'نمونه کارها') {
                wp_update_nav_menu_item($menu->term_id, (int) $item->ID, [
                    'menu-item-title' => 'نمونه کارها',
                    'menu-item-url' => '/projects',
                    'menu-item-status' => 'publish',
                    'menu-item-type' => 'custom',
                    'menu-item-position' => (int) $item->menu_order,
                ]);
            }
            break;
        }
    }

    if (!$has_projects) {
        $contact_order = 50;
        foreach ($items as $item) {
            $path = wp_parse_url($item->url ?? '', PHP_URL_PATH);
            if ($path && untrailingslashit($path) === '/contact') {
                $contact_order = max(1, (int) $item->menu_order - 1);
                break;
            }
        }

        wp_update_nav_menu_item($menu->term_id, 0, [
            'menu-item-title' => 'نمونه کارها',
            'menu-item-url' => '/projects',
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-position' => $contact_order,
        ]);
    }

    update_option('faraz_projects_menu_ensured_v2', 1, false);
}, 50);

function faraz_resolve_primary_menu()
{
    $locations = get_nav_menu_locations();

    if (!empty($locations['primary'])) {
        $menu = wp_get_nav_menu_object($locations['primary']);
        if ($menu) {
            return $menu;
        }
    }

    foreach (wp_get_nav_menus() as $candidate) {
        if (in_array($candidate->slug, ['primary', 'main', 'menu-asli', 'asli'], true)
            || mb_strpos($candidate->name, 'اصلی') !== false) {
            return $candidate;
        }
    }

    $menus = wp_get_nav_menus();
    return $menus[0] ?? null;
}

function faraz_normalize_menu_url($item)
{
    $url = $item->url ?? '/';

    if ($item->type === 'custom') {
        $path = wp_parse_url($url, PHP_URL_PATH);
        return $path ?: '/';
    }

    $path = wp_parse_url($url, PHP_URL_PATH);
    return $path ?: '/';
}

function faraz_build_menu_branch($items, $parent = 0)
{
    $branch = [];

    foreach ($items as $item) {
        if ((int) $item->menu_item_parent !== (int) $parent) {
            continue;
        }

        $children = faraz_build_menu_branch($items, $item->ID);
        $node = [
            'id' => (int) $item->ID,
            'label' => $item->title,
            'url' => faraz_normalize_menu_url($item),
            'order' => (int) $item->menu_order,
            'parent' => (int) $item->menu_item_parent,
        ];

        if ($children) {
            $node['children'] = $children;
        }

        $branch[] = $node;
    }

    usort($branch, function ($a, $b) {
        return $a['order'] <=> $b['order'];
    });

    return $branch;
}

function faraz_rest_get_menu($request)
{
    $slug = sanitize_title(urldecode($request['slug']));
    $menu = null;
    $locations = get_nav_menu_locations();

    if (!empty($locations[$slug])) {
        $menu = wp_get_nav_menu_object($locations[$slug]);
    }

    if (!$menu) {
        $menu = wp_get_nav_menu_object($slug);
    }

    if (!$menu) {
        foreach (wp_get_nav_menus() as $candidate) {
            if ($candidate->slug === $slug) {
                $menu = $candidate;
                break;
            }
        }
    }

    if (!$menu) {
        return rest_ensure_response([]);
    }

    $items = wp_get_nav_menu_items($menu->term_id);
    if (!$items) {
        return rest_ensure_response([]);
    }

    return rest_ensure_response(faraz_build_menu_branch($items));
}
