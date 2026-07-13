<?php
/**
 * فراز چمن — فرم ساده افزودن محصول در پیشخوان وردپرس
 *
 * نحوه نصب:
 * 1. در وردپرس برو به Code Snippets → Add New
 * 2. کل این فایل را کپی کن (از خط بعد از این کامنت تا انتها)
 * 3. نوع Snippet را PHP Snippet بگذار و Run everywhere را فعال کن
 * 4. Save و Activate
 *
 * پیش‌نیاز: CPT با نامک product و taxonomy با نامک product_category
 */

if (!defined('ABSPATH')) {
    exit;
}

const FARAZ_PRODUCT_META_PREFIX = '_faraz_';

/**
 * ----------------------------------------
 * ثبت متا برای REST API (Headless React)
 * ----------------------------------------
 */
add_action('init', function () {
    if (!post_type_exists('product')) {
        return;
    }

    $meta_fields = [
        'short_description' => 'string',
        'project_meta' => 'string',
        'product_price' => 'string',
        'seo_title' => 'string',
        'seo_description' => 'string',
        'robots_noindex' => 'string',
        'gallery' => 'string',
    ];

    foreach ($meta_fields as $key => $type) {
        register_post_meta('product', FARAZ_PRODUCT_META_PREFIX . $key, [
            'type' => $type,
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
});

/**
 * خروجی acf در REST برای سازگاری با فرانت React
 */
add_filter('rest_prepare_product', function ($response, $post) {
    $id = (int) $post->ID;
    $gallery_ids = faraz_get_product_gallery_ids($id);
    $gallery = [];

    foreach ($gallery_ids as $attachment_id) {
        $url = wp_get_attachment_image_url($attachment_id, 'large');
        if ($url) {
            $gallery[] = [
                'id' => (int) $attachment_id,
                'url' => $url,
                'alt' => get_post_meta($attachment_id, '_wp_attachment_image_alt', true) ?: '',
            ];
        }
    }

    $data = $response->get_data();
    $data['acf'] = array_merge($data['acf'] ?? [], [
        'short_description' => faraz_get_product_meta($id, 'short_description') ?: get_the_excerpt($post),
        'project_meta' => faraz_get_product_meta($id, 'project_meta'),
        'product_price' => faraz_get_product_meta($id, 'product_price'),
        'seo_title' => faraz_get_product_meta($id, 'seo_title'),
        'seo_description' => faraz_get_product_meta($id, 'seo_description'),
        'robots_noindex' => faraz_get_product_meta($id, 'robots_noindex') === '1',
        'gallery' => $gallery,
    ]);

    $response->set_data($data);

    return $response;
}, 10, 2);

/**
 * ----------------------------------------
 * ایجاد دسته‌بندی‌های پیش‌فرض
 * ----------------------------------------
 */
add_action('init', function () {
    if (!taxonomy_exists('product_category')) {
        return;
    }

    $categories = [
        'sports' => 'چمن مصنوعی ورزشی',
        'decorative' => 'چمن مصنوعی تزیینی',
    ];

    foreach ($categories as $slug => $name) {
        if (!term_exists($slug, 'product_category')) {
            wp_insert_term($name, 'product_category', ['slug' => $slug]);
        }
    }
}, 20);

/**
 * ----------------------------------------
 * منوی پیشخوان
 * ----------------------------------------
 */
add_action('admin_menu', function () {
    if (!post_type_exists('product')) {
        return;
    }

    add_submenu_page(
        'edit.php?post_type=product',
        'افزودن محصول جدید',
        'افزودن محصول جدید',
        'edit_posts',
        'faraz-add-product',
        'faraz_render_add_product_page'
    );
}, 30);

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'product_page_faraz-add-product') {
        return;
    }

    wp_enqueue_media();
    wp_register_style('faraz-product-admin', false);
    wp_enqueue_style('faraz-product-admin');
    wp_add_inline_style('faraz-product-admin', faraz_product_admin_css());
    wp_register_script('faraz-product-admin', false, ['jquery'], '1.0.0', true);
    wp_enqueue_script('faraz-product-admin');
    wp_add_inline_script('faraz-product-admin', faraz_product_admin_js());
});

/**
 * ----------------------------------------
 * ذخیره فرم
 * ----------------------------------------
 */
add_action('admin_post_faraz_save_product', 'faraz_handle_save_product');

function faraz_handle_save_product()
{
    if (!current_user_can('edit_posts')) {
        wp_die('دسترسی مجاز نیست.');
    }

    check_admin_referer('faraz_save_product');

    $title = sanitize_text_field(wp_unslash($_POST['product_title'] ?? ''));
    if ($title === '') {
        faraz_redirect_with_notice('error', 'نام محصول الزامی است.');
    }

    $short_description = sanitize_textarea_field(wp_unslash($_POST['short_description'] ?? ''));
    $content = wp_kses_post(wp_unslash($_POST['product_content'] ?? ''));
    $project_meta = sanitize_text_field(wp_unslash($_POST['project_meta'] ?? ''));
    $product_price = sanitize_text_field(wp_unslash($_POST['product_price'] ?? ''));
    $seo_title = sanitize_text_field(wp_unslash($_POST['seo_title'] ?? ''));
    $seo_description = sanitize_textarea_field(wp_unslash($_POST['seo_description'] ?? ''));
    $slug = sanitize_title(wp_unslash($_POST['post_slug'] ?? ''));
    $category = sanitize_key($_POST['product_category'] ?? '');
    $featured_image_id = absint($_POST['featured_image_id'] ?? 0);
    $gallery_raw = sanitize_text_field(wp_unslash($_POST['gallery_ids'] ?? ''));
    $allow_index = isset($_POST['robots_index']) && $_POST['robots_index'] === '1';
    $status = isset($_POST['save_as_draft']) ? 'draft' : 'publish';

    $gallery_ids = array_values(array_filter(array_map('absint', explode(',', $gallery_raw))));

    $post_data = [
        'post_type' => 'product',
        'post_title' => $title,
        'post_content' => $content,
        'post_excerpt' => $short_description,
        'post_status' => $status,
    ];

    if ($slug !== '') {
        $post_data['post_name'] = $slug;
    }

    $post_id = wp_insert_post($post_data, true);

    if (is_wp_error($post_id)) {
        faraz_redirect_with_notice('error', $post_id->get_error_message());
    }

    if ($featured_image_id > 0) {
        set_post_thumbnail($post_id, $featured_image_id);
    }

    if ($category && taxonomy_exists('product_category')) {
        $term = get_term_by('slug', $category, 'product_category');
        if ($term && !is_wp_error($term)) {
            wp_set_object_terms($post_id, [(int) $term->term_id], 'product_category', false);
        }
    }

    faraz_update_product_meta($post_id, 'short_description', $short_description);
    faraz_update_product_meta($post_id, 'project_meta', $project_meta);
    faraz_update_product_meta($post_id, 'product_price', $product_price);
    faraz_update_product_meta($post_id, 'seo_title', $seo_title);
    faraz_update_product_meta($post_id, 'seo_description', $seo_description);
    faraz_update_product_meta($post_id, 'robots_noindex', $allow_index ? '0' : '1');
    faraz_update_product_meta($post_id, 'gallery', implode(',', $gallery_ids));

    if (function_exists('update_field')) {
        update_field('short_description', $short_description, $post_id);
        update_field('project_meta', $project_meta, $post_id);
        update_field('product_price', $product_price, $post_id);
        update_field('seo_title', $seo_title, $post_id);
        update_field('seo_description', $seo_description, $post_id);
        update_field('gallery', $gallery_ids, $post_id);
        update_field('robots_noindex', $allow_index ? 0 : 1, $post_id);
    }

    $message = $status === 'publish'
        ? 'محصول با موفقیت ثبت شد.'
        : 'محصول به‌صورت پیش‌نویس ذخیره شد.';

    $redirect = add_query_arg([
        'page' => 'faraz-add-product',
        'faraz_notice' => 'success',
        'faraz_message' => rawurlencode($message),
        'faraz_post_id' => $post_id,
    ], admin_url('edit.php?post_type=product'));

    wp_safe_redirect($redirect);
    exit;
}

/**
 * ----------------------------------------
 * رندر صفحه فرم
 * ----------------------------------------
 */
function faraz_render_add_product_page()
{
    if (!current_user_can('edit_posts')) {
        return;
    }

    $notice = sanitize_key($_GET['faraz_notice'] ?? '');
    $message = isset($_GET['faraz_message']) ? sanitize_text_field(wp_unslash($_GET['faraz_message'])) : '';
    $saved_post_id = absint($_GET['faraz_post_id'] ?? 0);

    $categories = [
        'sports' => 'چمن مصنوعی ورزشی',
        'decorative' => 'چمن مصنوعی تزیینی',
    ];

    ?>
    <div class="wrap faraz-product-admin" dir="rtl">
        <h1>افزودن محصول جدید</h1>
        <p class="description">از این فرم برای ثبت سریع محصول در دسته ورزشی یا تزیینی استفاده کنید. داده‌ها در API سایت React هم در دسترس خواهند بود.</p>

        <?php if ($notice === 'success' && $message !== '') : ?>
            <div class="notice notice-success is-dismissible">
                <p>
                    <?php echo esc_html($message); ?>
                    <?php if ($saved_post_id > 0) : ?>
                        <a href="<?php echo esc_url(get_edit_post_link($saved_post_id)); ?>">ویرایش محصول</a>
                        |
                        <a href="<?php echo esc_url(get_permalink($saved_post_id)); ?>" target="_blank" rel="noopener">مشاهده در وردپرس</a>
                    <?php endif; ?>
                </p>
            </div>
        <?php elseif ($notice === 'error' && $message !== '') : ?>
            <div class="notice notice-error is-dismissible"><p><?php echo esc_html($message); ?></p></div>
        <?php endif; ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="faraz-product-form">
            <?php wp_nonce_field('faraz_save_product'); ?>
            <input type="hidden" name="action" value="faraz_save_product" />
            <input type="hidden" name="featured_image_id" id="featured_image_id" value="0" />
            <input type="hidden" name="gallery_ids" id="gallery_ids" value="" />

            <div class="faraz-grid">
                <div class="faraz-main">
                    <div class="faraz-card">
                        <h2>اطلاعات اصلی</h2>

                        <p>
                            <label for="product_title"><strong>۱. نام محصول</strong> <span class="required">*</span></label>
                            <input type="text" class="large-text" id="product_title" name="product_title" required placeholder="مثلاً زمین فوتبال استاندارد" />
                        </p>

                        <p>
                            <label for="short_description"><strong>۲. توضیحات کوتاه</strong></label>
                            <textarea id="short_description" name="short_description" rows="3" class="large-text" placeholder="متنی که زیر عکس در کارت محصولات نمایش داده می‌شود"></textarea>
                        </p>

                        <p>
                            <label for="project_meta"><strong>مشخصات کارت</strong> <span class="faraz-hint">(اختیاری — مثلاً ۷۱۱ متر مربع | تهران)</span></label>
                            <input type="text" class="large-text" id="project_meta" name="project_meta" placeholder="۷۱۱ متر مربع | تهران" />
                        </p>

                        <p>
                            <label for="product_content"><strong>۳. محتوای اصلی محصول</strong></label>
                            <?php
                            wp_editor('', 'product_content', [
                                'textarea_name' => 'product_content',
                                'textarea_rows' => 12,
                                'media_buttons' => true,
                                'teeny' => false,
                            ]);
                            ?>
                            <span class="faraz-hint">برای صفحه اختصاصی هر محصول در آینده استفاده می‌شود.</span>
                        </p>
                    </div>

                    <div class="faraz-card">
                        <h2>۴. تصویر شاخص و گالری</h2>

                        <div class="faraz-media-block">
                            <label><strong>تصویر شاخص (کارت محصولات)</strong></label>
                            <div id="featured-preview" class="faraz-media-preview faraz-media-preview--empty">هنوز تصویری انتخاب نشده است.</div>
                            <p class="faraz-media-actions">
                                <button type="button" class="button button-secondary" id="pick-featured-image">انتخاب تصویر شاخص</button>
                                <button type="button" class="button-link-delete" id="remove-featured-image">حذف</button>
                            </p>
                        </div>

                        <div class="faraz-media-block">
                            <label><strong>گالری تصاویر (صفحه محصول)</strong></label>
                            <div id="gallery-preview" class="faraz-gallery-preview"></div>
                            <p class="faraz-media-actions">
                                <button type="button" class="button button-secondary" id="pick-gallery-images">افزودن به گالری</button>
                                <button type="button" class="button-link-delete" id="clear-gallery-images">پاک کردن گالری</button>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="faraz-side">
                    <div class="faraz-card">
                        <h2>تنظیمات انتشار</h2>

                        <p>
                            <label><strong>۵. دسته‌بندی محصول</strong> <span class="required">*</span></label>
                            <?php foreach ($categories as $slug => $label) : ?>
                                <label class="faraz-radio">
                                    <input type="radio" name="product_category" value="<?php echo esc_attr($slug); ?>" <?php checked($slug, 'sports'); ?> required />
                                    <?php echo esc_html($label); ?>
                                </label>
                            <?php endforeach; ?>
                        </p>

                        <p>
                            <label for="product_price"><strong>۹. قیمت</strong></label>
                            <input type="text" class="regular-text" id="product_price" name="product_price" placeholder="مثلاً از ۱,۲۵۰,۰۰۰ تومان" />
                        </p>

                        <p>
                            <label for="post_slug"><strong>۷. آدرس URL (نامک)</strong></label>
                            <input type="text" class="regular-text" id="post_slug" name="post_slug" placeholder="zamin-football-ostandard" dir="ltr" />
                            <span class="faraz-hint">فقط حروف انگلیسی، عدد و خط تیره. خالی = خودکار</span>
                        </p>

                        <p>
                            <label class="faraz-check">
                                <input type="checkbox" name="robots_index" value="1" checked />
                                <strong>۸. اجازه ایندکس شدن توسط گوگل</strong>
                            </label>
                            <span class="faraz-hint">اگر تیک را بردارید، محصول noindex می‌شود.</span>
                        </p>

                        <p class="faraz-submit-row">
                            <button type="submit" class="button button-primary button-hero">افزودن و انتشار محصول</button>
                            <button type="submit" name="save_as_draft" value="1" class="button">ذخیره پیش‌نویس</button>
                        </p>
                    </div>

                    <div class="faraz-card">
                        <h2>۶. سئو (SEO)</h2>

                        <p>
                            <label for="seo_title"><strong>متا عنوان (Meta Title)</strong></label>
                            <input type="text" class="large-text" id="seo_title" name="seo_title" maxlength="70" placeholder="عنوان برای گوگل" />
                        </p>

                        <p>
                            <label for="seo_description"><strong>متا توضیحات (Meta Description)</strong></label>
                            <textarea id="seo_description" name="seo_description" rows="4" class="large-text" maxlength="160" placeholder="توضیح کوتاه برای نتایج جستجو"></textarea>
                        </p>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <?php
}

/**
 * ----------------------------------------
 * Helpers
 * ----------------------------------------
 */
function faraz_get_product_meta($post_id, $key)
{
    return get_post_meta((int) $post_id, FARAZ_PRODUCT_META_PREFIX . $key, true);
}

function faraz_update_product_meta($post_id, $key, $value)
{
    update_post_meta((int) $post_id, FARAZ_PRODUCT_META_PREFIX . $key, $value);
}

function faraz_get_product_gallery_ids($post_id)
{
    $raw = faraz_get_product_meta($post_id, 'gallery');
    if ($raw === '') {
        return [];
    }

    return array_values(array_filter(array_map('absint', explode(',', $raw))));
}

function faraz_redirect_with_notice($type, $message)
{
    $redirect = add_query_arg([
        'page' => 'faraz-add-product',
        'faraz_notice' => $type,
        'faraz_message' => rawurlencode($message),
    ], admin_url('edit.php?post_type=product'));

    wp_safe_redirect($redirect);
    exit;
}

function faraz_product_admin_css()
{
    return '
        .faraz-product-admin .description { margin-bottom: 18px; }
        .faraz-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 20px; align-items: start; }
        .faraz-card { background: #fff; border: 1px solid #dcdcde; border-radius: 8px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
        .faraz-card h2 { margin: 0 0 14px; font-size: 16px; }
        .faraz-card p { margin: 0 0 16px; }
        .faraz-card p:last-child { margin-bottom: 0; }
        .faraz-hint { display: block; color: #646970; font-size: 12px; margin-top: 6px; }
        .required { color: #d63638; }
        .faraz-radio, .faraz-check { display: flex; align-items: center; gap: 8px; margin: 8px 0; font-weight: 400; }
        .faraz-media-block { margin-bottom: 18px; }
        .faraz-media-preview { min-height: 160px; border: 1px dashed #c3c4c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f6f7f7; }
        .faraz-media-preview img { width: 100%; height: auto; display: block; }
        .faraz-media-preview--empty { color: #646970; font-size: 13px; padding: 16px; text-align: center; }
        .faraz-gallery-preview { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 10px; min-height: 40px; }
        .faraz-gallery-item { position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #dcdcde; aspect-ratio: 1; }
        .faraz-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .faraz-gallery-item button { position: absolute; top: 4px; left: 4px; width: 22px; height: 22px; border: 0; border-radius: 50%; background: rgba(0,0,0,.65); color: #fff; cursor: pointer; line-height: 1; }
        .faraz-media-actions { display: flex; gap: 10px; align-items: center; }
        .faraz-submit-row { display: flex; flex-direction: column; gap: 8px; }
        .faraz-submit-row .button-hero { width: 100%; text-align: center; justify-content: center; }
        @media (max-width: 1100px) { .faraz-grid { grid-template-columns: 1fr; } }
    ';
}

function faraz_product_admin_js()
{
    return <<<'JS'
jQuery(function ($) {
    let featuredFrame;
    let galleryFrame;
    let galleryIds = [];

    function renderFeatured(id, url) {
        $('#featured_image_id').val(id || 0);
        const $preview = $('#featured-preview');
        if (!id || !url) {
            $preview.addClass('faraz-media-preview--empty').html('هنوز تصویری انتخاب نشده است.');
            return;
        }
        $preview.removeClass('faraz-media-preview--empty').html('<img src="' + url + '" alt="" />');
    }

    function renderGallery() {
        $('#gallery_ids').val(galleryIds.join(','));
        const $wrap = $('#gallery-preview').empty();
        galleryIds.forEach(function (id) {
            const attachment = wp.media.attachment(id);
            attachment.fetch().then(function () {
                const url = attachment.get('url');
                const $item = $('<div class="faraz-gallery-item"></div>');
                $item.append('<img src="' + url + '" alt="" />');
                $item.append('<button type="button" data-id="' + id + '" aria-label="حذف">×</button>');
                $wrap.append($item);
            });
        });
    }

    $('#pick-featured-image').on('click', function (e) {
        e.preventDefault();
        if (featuredFrame) {
            featuredFrame.open();
            return;
        }
        featuredFrame = wp.media({
            title: 'انتخاب تصویر شاخص',
            button: { text: 'استفاده از این تصویر' },
            multiple: false
        });
        featuredFrame.on('select', function () {
            const attachment = featuredFrame.state().get('selection').first().toJSON();
            renderFeatured(attachment.id, attachment.url);
        });
        featuredFrame.open();
    });

    $('#remove-featured-image').on('click', function (e) {
        e.preventDefault();
        renderFeatured(0, '');
    });

    $('#pick-gallery-images').on('click', function (e) {
        e.preventDefault();
        if (galleryFrame) {
            galleryFrame.open();
            return;
        }
        galleryFrame = wp.media({
            title: 'افزودن تصاویر به گالری',
            button: { text: 'افزودن به گالری' },
            multiple: true
        });
        galleryFrame.on('select', function () {
            galleryFrame.state().get('selection').each(function (attachment) {
                const json = attachment.toJSON();
                if (!galleryIds.includes(json.id)) {
                    galleryIds.push(json.id);
                }
            });
            renderGallery();
        });
        galleryFrame.open();
    });

    $('#clear-gallery-images').on('click', function (e) {
        e.preventDefault();
        galleryIds = [];
        renderGallery();
    });

    $('#gallery-preview').on('click', 'button', function () {
        const id = parseInt($(this).data('id'), 10);
        galleryIds = galleryIds.filter(function (item) { return item !== id; });
        renderGallery();
    });

    $('#product_title').on('input', function () {
        const $slug = $('#post_slug');
        if ($slug.val().trim() !== '') return;
        const slug = $(this).val()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        $slug.val(slug);
    });
});
JS;
}
