<?php
/**
 * فراز چمن — انتقال سبد از فرانت React به پرداخت WooCommerce (Checkout Handoff)
 *
 * چرا لازم است؟
 * فرانت React روی farazchaman.ir و ووکامرس روی api.farazchaman.ir است (دو اوریجین جدا).
 * سبد در React (localStorage) نگه‌داری می‌شود؛ این endpoint سبد را در «سشن first-party» ووکامرس
 * می‌سازد و کاربر را به صفحهٔ پرداخت خود ووکامرس می‌فرستد تا درگاه ایرانی بدون دردسر کار کند.
 *
 * نحوه نصب:
 * 1. Code Snippets → Add New → یک Snippet جدید از نوع PHP بساز («فراز چمن — Handoff پرداخت»).
 * 2. کل این کد (بدون تگ <?php ابتدایی اگر افزونه خودش اضافه می‌کند) را کپی کن.
 * 3. Run snippet everywhere → Save & Activate.
 *
 * پیش‌نیاز: افزونهٔ WooCommerce فعال باشد.
 *
 * ── راه‌اندازی دسته‌بندی‌ها در ووکامرس (خیلی مهم) ──────────────────────────────
 * فرانت بر اساس «اسلاگِ» دسته‌ها کار می‌کند؛ نامِ نمایشی هرچه باشد مهم نیست، فقط اسلاگ باید دقیق باشد.
 * در Products → Categories دو دستهٔ والد بساز:
 *   - «چمن مصنوعی ورزشی»  با اسلاگ:  sports
 *   - «چمن مصنوعی تزیینی» با اسلاگ:  decorative
 * سپس زیردسته‌ها را به‌عنوان «فرزندِ» همان والد، با این اسلاگ‌ها بساز:
 *   ورزشی (parent=sports):    football, club, padel, golf, tennis, paintball, futsal, school, hockey
 *   تزیینی (parent=decorative): restaurant, rooftop, terrace-balcony, kindergarten, garden, patio,
 *                               hall, yard, workplace, villa, tile-grass, wall-grass, moketi, grass-fence
 * هر محصول را حداقل به زیردستهٔ مربوطه‌اش اختصاص بده (بهتر است والد را هم بزنی).
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('faraz/v1', '/checkout-handoff', [
        'methods' => 'POST',
        'callback' => 'faraz_woo_checkout_handoff',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * دریافت آرایهٔ آیتم‌ها از درخواست.
 * ورودی می‌تواند فیلد `items` به‌صورت JSON رشته‌ای باشد: [{"id":12,"qty":2}, ...]
 *
 * @return array<int, array{id:int, qty:int}>
 */
function faraz_woo_parse_handoff_items($request)
{
    $raw = $request->get_param('items');

    if (is_string($raw)) {
        $decoded = json_decode(wp_unslash($raw), true);
    } else {
        $decoded = $raw; // اگر به‌صورت آرایه ارسال شد
    }

    if (!is_array($decoded)) {
        return [];
    }

    $items = [];
    foreach ($decoded as $entry) {
        if (!is_array($entry)) {
            continue;
        }
        $id = isset($entry['id']) ? absint($entry['id']) : 0;
        $qty = isset($entry['qty']) ? absint($entry['qty']) : 1;
        if ($id > 0) {
            $items[] = ['id' => $id, 'qty' => max(1, $qty)];
        }
    }

    return $items;
}

function faraz_woo_checkout_handoff($request)
{
    // اگر ووکامرس فعال نبود
    if (!function_exists('WC') || !function_exists('wc_get_checkout_url')) {
        wp_safe_redirect(home_url('/'));
        exit;
    }

    // در بستر REST، سبد/سشن ووکامرس به‌صورت خودکار بارگذاری نمی‌شود
    if (function_exists('wc_load_cart')) {
        wc_load_cart();
    }

    $items = faraz_woo_parse_handoff_items($request);

    if (empty($items)) {
        // سبد خالی → به صفحهٔ فروشگاه/سبد برگرد
        wp_safe_redirect(wc_get_cart_url());
        exit;
    }

    // سبد فعلی را خالی کن تا دقیقاً همان چیزی که در React بود ساخته شود
    if (WC()->cart) {
        WC()->cart->empty_cart();

        foreach ($items as $item) {
            WC()->cart->add_to_cart($item['id'], $item['qty']);
        }

        WC()->cart->calculate_totals();

        // ذخیرهٔ سشن و ست‌شدن کوکی سبد قبل از ریدایرکت
        if (WC()->session) {
            WC()->session->set_customer_session_cookie(true);
        }
    }

    wp_safe_redirect(wc_get_checkout_url());
    exit;
}
