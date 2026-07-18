<?php
/**
 * فراز چمن — ساخت و اتصال منوی سایت (مخصوص قالب‌های بلوکی که «فهرست‌ها» را مخفی می‌کنند)
 *
 * این اسنیپت:
 *   ۱. صفحهٔ «نمایش → فهرست‌ها» (Appearance → Menus) را دوباره فعال می‌کند.
 *   ۲. یک‌بار، اگر منویی وجود نداشت، یک منوی کامل می‌سازد شاملِ صفحات اصلی + دسته‌های محصول،
 *      و آن را به جایگاه primary (که فرانت React می‌خواند) وصل می‌کند.
 *
 * نکته: این اسنیپت مکملِ اسنیپت «منوی REST» (faraz-menu-rest) است؛ آن باید فعال بماند
 * تا endpoint خواندن منو (faraz/v1/menu/primary) کار کند.
 *
 * نصب: Code Snippets → Add New → PHP → Save & Activate → یک صفحهٔ پیشخوان را رفرش کن.
 */

if (!defined('ABSPATH')) {
    exit;
}

// جایگاه منو را ثبت می‌کند و صفحهٔ «فهرست‌ها» را روی قالب‌های بلوکی برمی‌گرداند
add_action('after_setup_theme', function () {
    register_nav_menus(['primary' => 'منوی اصلی سایت']);
});

add_action('admin_init', function () {
    if (get_option('faraz_site_menu_built')) {
        return;
    }

    if (!function_exists('wp_create_nav_menu') || !function_exists('wp_update_nav_menu_item')) {
        require_once ABSPATH . 'wp-admin/includes/nav-menu.php';
    }

    if (!function_exists('wp_create_nav_menu')) {
        return;
    }

    $menu_name = 'منوی اصلی سایت';
    $menu = wp_get_nav_menu_object($menu_name);

    if (!$menu) {
        $menu_id = wp_create_nav_menu($menu_name);
        if (is_wp_error($menu_id)) {
            return;
        }
    } else {
        $menu_id = (int) $menu->term_id;
    }

    // فقط اگر منو خالی است آیتم‌ها را بساز (تا ویرایش‌های بعدی کاربر پاک نشود)
    $existing = wp_get_nav_menu_items($menu_id);
    if (empty($existing)) {
        $position = 1;

        $add = function ($title, $url, $parent = 0) use ($menu_id, &$position) {
            return wp_update_nav_menu_item($menu_id, 0, [
                'menu-item-title' => $title,
                'menu-item-url' => $url,
                'menu-item-status' => 'publish',
                'menu-item-type' => 'custom',
                'menu-item-parent-id' => $parent,
                'menu-item-position' => $position++,
            ]);
        };

        $add('خانه', '/');
        $add('خدمات', '/services');
        $products_id = $add('محصولات', '/products');

        // دسته‌های اصلیِ محصول (top-level که محصول دارند) به‌عنوان زیرمنوی «محصولات»
        if (taxonomy_exists('product_cat')) {
            $terms = get_terms([
                'taxonomy' => 'product_cat',
                'hide_empty' => true,
                'parent' => 0,
            ]);

            if (!is_wp_error($terms)) {
                foreach ($terms as $term) {
                    $add($term->name, '/products/' . $term->slug, (int) $products_id);
                }
            }
        }

        $add('روند اجرا', '/process');
        $add('نمونه کارها', '/projects');
        $add('تماس با ما', '/contact');
    }

    // اتصال منو به جایگاه primary (تا faraz/v1/menu/primary آن را برگرداند)
    $locations = get_theme_mod('nav_menu_locations', []);
    if (!is_array($locations)) {
        $locations = [];
    }
    $locations['primary'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);

    update_option('faraz_site_menu_built', 1);
});

add_action('admin_notices', function () {
    if (!get_option('faraz_site_menu_built')) {
        return;
    }

    echo '<div class="notice notice-success is-dismissible"><p>'
        . '✅ منوی سایت ساخته و به فرانت وصل شد. برای انتخاب/مرتب‌کردن دسته‌ها: '
        . '<a href="' . esc_url(admin_url('nav-menus.php')) . '">نمایش → فهرست‌ها</a>'
        . '</p></div>';
});
