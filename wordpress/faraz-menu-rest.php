<?php
/**
 * این کد را در وردپرس داخل Code Snippets کپی و فعال کنید.
 * منوی REST API را برای فرانت React در دسترس قرار می‌دهد.
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
