<?php
/**
 * فراز چمن — ساخت دستهٔ نمونه + یک محصول تستی در WooCommerce (فقط برای تست)
 *
 * این اسنیپت یک‌بار اجرا می‌شود و می‌سازد:
 *   - دستهٔ والد «چمن مصنوعی ورزشی» با اسلاگ: sports
 *   - زیردستهٔ «فوتبال» با اسلاگ: football (فرزندِ sports)
 *   - یک محصول تستی «چمن مصنوعی تستی فوتبال» با اسلاگ: chaman-test-sample
 *     (قیمت ۲۵۰٬۰۰۰، منتشرشده، داخل دستهٔ football)
 *
 * نحوهٔ استفاده:
 * 1. Code Snippets → Add New → PHP → کل این کد را کپی کن.
 * 2. «Run snippet everywhere» → Save & Activate.
 * 3. یک صفحهٔ پیشخوان را باز/رفرش کن؛ بالای صفحه یک پیام سبز با لینک محصول می‌بینی.
 * 4. بعد از دیدن پیام، می‌توانی این اسنیپت را Deactivate/Delete کنی (محصول باقی می‌ماند).
 *    برای ساخت دوبارهٔ محصول، آپشن faraz_woo_sample_seeded را پاک کن یا اسلاگ را تغییر بده.
 *
 * پیش‌نیاز: افزونهٔ WooCommerce فعال باشد.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_init', function () {
    // فقط یک‌بار اجرا شود
    if (get_option('faraz_woo_sample_seeded')) {
        return;
    }

    // ووکامرس باید فعال باشد
    if (!class_exists('WC_Product_Simple') || !taxonomy_exists('product_cat')) {
        return;
    }

    // اسلاگ محصول تستی
    $product_slug = 'chaman-test-sample';

    // اگر قبلاً ساخته شده، فقط فلگ را ست کن
    $existing = get_page_by_path($product_slug, OBJECT, 'product');
    if ($existing) {
        update_option('faraz_woo_sample_seeded', 1);
        return;
    }

    // --- ساخت دسته‌ها با اسلاگ دقیق (نام مهم نیست، اسلاگ مهم است) ---
    $parent_id = faraz_seed_ensure_cat('چمن مصنوعی ورزشی', 'sports', 0);
    $child_id = faraz_seed_ensure_cat('فوتبال', 'football', $parent_id);

    // --- ساخت محصول تستی ---
    $product = new WC_Product_Simple();
    $product->set_name('چمن مصنوعی تستی فوتبال');
    $product->set_slug('chaman-test-sample');
    $product->set_status('publish');
    $product->set_catalog_visibility('visible');
    $product->set_regular_price('250000');
    $product->set_short_description('این یک محصول تستی است تا نمایش صفحهٔ محصول در سایت بررسی شود. چمن مصنوعی مخصوص زمین فوتبال با ارتفاع ۴۰ میلی‌متر.');
    $product->set_description('<p>محصول نمونه برای تست اتصال WooCommerce به فرانت React.</p><ul><li>ارتفاع پرز: ۴۰ میلی‌متر</li><li>مناسب زمین فوتبال و فوتسال</li><li>دارای ضدآفتاب (UV)</li></ul>');

    $cat_ids = array_filter([$parent_id, $child_id]);
    if ($cat_ids) {
        $product->set_category_ids(array_values($cat_ids));
    }

    $product_id = $product->save();

    if ($product_id) {
        update_option('faraz_woo_sample_seeded', 1);
        update_option('faraz_woo_sample_product_id', (int) $product_id);
    }
});

/**
 * ساخت/اطمینان از وجود یک ترم دستهٔ محصول با اسلاگ مشخص
 */
function faraz_seed_ensure_cat($name, $slug, $parent_id)
{
    $term = get_term_by('slug', $slug, 'product_cat');
    if ($term && !is_wp_error($term)) {
        return (int) $term->term_id;
    }

    $args = ['slug' => $slug];
    if ($parent_id) {
        $args['parent'] = (int) $parent_id;
    }

    $res = wp_insert_term($name, 'product_cat', $args);
    if (is_wp_error($res)) {
        return 0;
    }

    return (int) $res['term_id'];
}

/**
 * نمایش پیام موفقیت + لینک محصول در پیشخوان
 */
add_action('admin_notices', function () {
    if (!get_option('faraz_woo_sample_seeded')) {
        return;
    }

    $product_id = (int) get_option('faraz_woo_sample_product_id');
    if (!$product_id) {
        return;
    }

    $edit = admin_url('post.php?post=' . $product_id . '&action=edit');
    echo '<div class="notice notice-success is-dismissible"><p>'
        . '✅ محصول تستی ووکامرس ساخته شد. اسلاگ: <code>chaman-test-sample</code> — '
        . 'صفحهٔ آن در سایت React: <code>/product/chaman-test-sample</code> — '
        . '<a href="' . esc_url($edit) . '">ویرایش محصول در پیشخوان</a>'
        . '</p></div>';
});
