<?php
/**
 * فراز چمن — endpoint سریع محصولات برای فرانت React
 *
 * چرا؟ Store API پیش‌فرض ووکامرس (wc/store/v1/products) روی این هاست بسیار کند است و
 * فرانت را به timeout می‌اندازد. این اسنیپت یک endpoint سبک و سریع می‌سازد که فقط
 * فیلدهای موردنیاز فرانت را با یک WP_Query سادهٔ کش‌شونده برمی‌گرداند.
 *
 * endpointها (عمومی، فقط خواندنی):
 *   GET /wp-json/faraz/v1/products                 → لیست همهٔ محصولات منتشرشده
 *   GET /wp-json/faraz/v1/products?slug=<slug>      → یک محصول با اسلاگ
 *   GET /wp-json/faraz/v1/product-categories        → لیست دسته‌های محصول
 *
 * نصب:
 * 1. Code Snippets → Add New → PHP → کل این کد را کپی کن.
 * 2. Run everywhere → Save & Activate.
 *
 * پیش‌نیاز: WooCommerce فعال باشد.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('faraz/v1', '/products', [
        'methods' => 'GET',
        'callback' => 'faraz_fast_get_products',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('faraz/v1', '/product-categories', [
        'methods' => 'GET',
        'callback' => 'faraz_fast_get_product_categories',
        'permission_callback' => '__return_true',
    ]);

    // محصولات + دسته‌ها در یک درخواست واحد (سرورهای کند با درخواست همزمان مشکل دارند)
    register_rest_route('faraz/v1', '/catalog', [
        'methods' => 'GET',
        'callback' => 'faraz_fast_get_catalog',
        'permission_callback' => '__return_true',
    ]);

    // منوی سایت به‌صورت سبک و مستقل (سریع و مطمئن برای نوار ناوبری)
    register_rest_route('faraz/v1', '/site-menu', [
        'methods' => 'GET',
        'callback' => function () {
            return rest_ensure_response(faraz_fast_get_menu_tree());
        },
        'permission_callback' => '__return_true',
    ]);
});

function faraz_fast_get_catalog($request)
{
    return rest_ensure_response([
        'products' => faraz_fast_get_products($request)->get_data(),
        'categories' => faraz_fast_get_product_categories($request)->get_data(),
        'menu' => faraz_fast_get_menu_tree(),
    ]);
}

/**
 * منوی جایگاه primary را به‌صورت درختِ نرمال‌شده (فقط path) برمی‌گرداند.
 * این‌طور فرانت منو را در همان درخواست سریع می‌گیرد و به endpoint جدا وابسته نیست.
 */
function faraz_fast_get_menu_tree()
{
    $menu = null;
    $locations = get_nav_menu_locations();

    if (!empty($locations['primary'])) {
        $menu = wp_get_nav_menu_object($locations['primary']);
    }
    if (!$menu) {
        $menu = wp_get_nav_menu_object('منوی اصلی سایت');
    }
    if (!$menu) {
        // در نهایت اولین منوی موجود را بردار تا هر منویی که کاربر ساخته نمایش داده شود
        $all = wp_get_nav_menus();
        if (!empty($all)) {
            $menu = $all[0];
        }
    }
    if (!$menu) {
        return [];
    }

    $items = wp_get_nav_menu_items($menu->term_id);
    if (!$items) {
        return [];
    }

    return faraz_fast_build_menu_branch($items, 0);
}

function faraz_fast_menu_path($item)
{
    $url = $item->url ?? '/';
    $path = wp_parse_url($url, PHP_URL_PATH);
    return $path ?: '/';
}

function faraz_fast_build_menu_branch($items, $parent)
{
    $branch = [];

    foreach ($items as $item) {
        if ((int) $item->menu_item_parent !== (int) $parent) {
            continue;
        }

        $children = faraz_fast_build_menu_branch($items, $item->ID);
        $node = [
            'id' => (int) $item->ID,
            'label' => $item->title,
            'url' => faraz_fast_menu_path($item),
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

function faraz_fast_get_products($request)
{
    if (!function_exists('wc_get_product')) {
        return rest_ensure_response([]);
    }

    $slug = sanitize_title((string) $request->get_param('slug'));

    $args = [
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => $slug ? 1 : 100,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
        'ignore_sticky_posts' => true,
    ];

    if ($slug) {
        $args['name'] = $slug;
    }

    $query = new WP_Query($args);

    $currency_symbol = html_entity_decode(get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8');
    $currency_code = get_woocommerce_currency();

    $out = [];

    foreach ($query->posts as $post) {
        $product = wc_get_product($post->ID);
        if (!$product) {
            continue;
        }

        // تصاویر: شاخص + گالری
        $images = [];
        $featured = get_the_post_thumbnail_url($post->ID, 'large');
        if ($featured) {
            $images[] = ['src' => $featured, 'alt' => get_the_title($post)];
        }
        foreach ($product->get_gallery_image_ids() as $gid) {
            $url = wp_get_attachment_image_url($gid, 'large');
            if ($url) {
                $images[] = ['src' => $url, 'alt' => ''];
            }
        }

        // دسته‌ها
        $categories = [];
        $terms = wp_get_post_terms($post->ID, 'product_cat');
        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $categories[] = [
                    'id' => (int) $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'parent' => (int) $term->parent,
                ];
            }
        }

        // قیمت به «واحد اصلی» برگردانده می‌شود؛ پس currency_minor_unit=0
        $price = $product->get_price();

        $out[] = [
            'id' => (int) $post->ID,
            'name' => get_the_title($post),
            'slug' => $post->post_name,
            'permalink' => get_permalink($post->ID),
            'sku' => $product->get_sku(),
            'short_description' => $product->get_short_description(),
            'description' => $product->get_description(),
            'is_in_stock' => $product->is_in_stock(),
            'prices' => [
                'price' => (string) ($price === '' ? '0' : $price),
                'regular_price' => (string) $product->get_regular_price(),
                'sale_price' => (string) $product->get_sale_price(),
                'currency_code' => $currency_code,
                'currency_symbol' => $currency_symbol,
                'currency_minor_unit' => 0,
            ],
            'images' => $images,
            'categories' => $categories,
        ];
    }

    return rest_ensure_response($out);
}

function faraz_fast_get_product_categories()
{
    if (!taxonomy_exists('product_cat')) {
        return rest_ensure_response([]);
    }

    $terms = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
    ]);

    if (is_wp_error($terms)) {
        return rest_ensure_response([]);
    }

    $out = [];
    foreach ($terms as $term) {
        $out[] = [
            'id' => (int) $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'parent' => (int) $term->parent,
            'count' => (int) $term->count,
        ];
    }

    return rest_ensure_response($out);
}
