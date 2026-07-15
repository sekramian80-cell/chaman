<?php
/**
 * فراز چمن — مدیریت نمونه کارها (افزودن، لیست، ویرایش، حذف)
 *
 * نحوه نصب:
 * 1. Code Snippets → Snippet جدید «فراز چمن — نمونه کارها» را باز کن
 * 2. کل این کد را در یک Snippet جدید PHP کپی کن
 * 3. Save Changes
 *
 * پیش‌نیاز: CPT با نامک project (و در صورت وجود taxonomy product_category برای دسته‌بندی)
 * فقط در پیشخوان اجرا می‌شود — روی سرعت سایت عمومی تأثیری ندارد.
 */

if (!defined('ABSPATH')) {
    exit;
}

const FARAZ_PROJ_META_PREFIX = '_faraz_';
const FARAZ_PROJ_MAIN_CATEGORY_SLUGS = ['sports', 'decorative'];

function faraz_proj_get_product_subcategories_tree()
{
    return [
        'sports' => [
            ['slug' => 'football', 'label' => 'فوتبال'],
            ['slug' => 'club', 'label' => 'باشگاه'],
            ['slug' => 'padel', 'label' => 'پدل'],
            ['slug' => 'golf', 'label' => 'گلف'],
            ['slug' => 'tennis', 'label' => 'تنیس'],
            ['slug' => 'paintball', 'label' => 'پینت بال'],
            ['slug' => 'futsal', 'label' => 'فوتسال'],
            ['slug' => 'school', 'label' => 'مدرسه'],
            ['slug' => 'hockey', 'label' => 'هاکی'],
        ],
        'decorative' => [
            ['slug' => 'restaurant', 'label' => 'رستوران'],
            ['slug' => 'rooftop', 'label' => 'پشت بام'],
            ['slug' => 'terrace-balcony', 'label' => 'تراس و بالکن'],
            ['slug' => 'kindergarten', 'label' => 'مهدکودک'],
            ['slug' => 'garden', 'label' => 'باغ'],
            ['slug' => 'patio', 'label' => 'پاسیو'],
            ['slug' => 'hall', 'label' => 'تالار'],
            ['slug' => 'yard', 'label' => 'حیاط'],
            ['slug' => 'workplace', 'label' => 'محیط کار'],
            ['slug' => 'villa', 'label' => 'ویلا'],
            ['slug' => 'tile-grass', 'label' => 'تایلی'],
            ['slug' => 'wall-grass', 'label' => 'دیواری'],
            ['slug' => 'moketi', 'label' => 'موکتی'],
            ['slug' => 'grass-fence', 'label' => 'فنس چمن'],
        ],
    ];
}

function faraz_proj_get_main_categories()
{
    return [
        'sports' => 'چمن مصنوعی ورزشی',
        'decorative' => 'چمن مصنوعی تزیینی',
    ];
}

function faraz_proj_get_subcategory_label($slug)
{
    foreach (faraz_proj_get_product_subcategories_tree() as $items) {
        foreach ($items as $item) {
            if ($item['slug'] === $slug) {
                return $item['label'];
            }
        }
    }

    return $slug;
}

function faraz_proj_get_flat_subcategories()
{
    $flat = [];

    foreach (faraz_proj_get_product_subcategories_tree() as $parent => $items) {
        foreach ($items as $item) {
            $flat[] = array_merge($item, ['parent' => $parent]);
        }
    }

    return $flat;
}

add_action('init', function () {
    if (!post_type_exists('project')) {
        return;
    }

    $meta_fields = [
        'short_description' => 'string',
        'project_meta' => 'string',
        'project_location' => 'string',
        'seo_title' => 'string',
        'seo_description' => 'string',
        'robots_noindex' => 'string',
        'gallery' => 'string',
        'primary_category' => 'string',
        'subcategory' => 'string',
    ];

    foreach ($meta_fields as $key => $type) {
        register_post_meta('project', FARAZ_PROJ_META_PREFIX . $key, [
            'type' => $type,
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
});

add_filter('rest_prepare_project', function ($response, $post) {
    $id = (int) $post->ID;
    $gallery_ids = faraz_proj_get_product_gallery_ids($id);
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

    $subcategory = faraz_proj_get_product_subcategory_slug($id);
    $primary_category = faraz_proj_get_product_primary_category_slug($id);

    $data = $response->get_data();
    $data['acf'] = array_merge($data['acf'] ?? [], [
        'short_description' => faraz_proj_get_product_meta($id, 'short_description') ?: get_the_excerpt($post),
        'project_meta' => faraz_proj_get_product_meta($id, 'project_meta'),
        'project_location' => faraz_proj_get_product_meta($id, 'project_location'),
        'seo_title' => faraz_proj_get_product_meta($id, 'seo_title'),
        'seo_description' => faraz_proj_get_product_meta($id, 'seo_description'),
        'robots_noindex' => faraz_proj_get_product_meta($id, 'robots_noindex') === '1',
        'gallery' => $gallery,
        'primary_category' => $primary_category,
        'subcategory' => $subcategory,
        'subcategory_label' => faraz_proj_get_subcategory_label($subcategory),
    ]);

    $response->set_data($data);

    return $response;
}, 10, 2);

add_action('init', function () {
    if (!taxonomy_exists('product_category')) {
        return;
    }

    foreach (faraz_proj_get_main_categories() as $slug => $name) {
        faraz_proj_ensure_product_term($slug, $name, 0);
    }

    foreach (faraz_proj_get_product_subcategories_tree() as $parent_slug => $children) {
        $parent = get_term_by('slug', $parent_slug, 'product_category');
        $parent_id = $parent ? (int) $parent->term_id : 0;

        foreach ($children as $child) {
            faraz_proj_ensure_product_term($child['slug'], $child['label'], $parent_id);
        }
    }
}, 20);

add_action('admin_menu', function () {
    if (!post_type_exists('project')) {
        return;
    }

    add_submenu_page(
        'edit.php?post_type=project',
        'مدیریت نمونه کارها',
        'مدیریت نمونه کارها',
        'edit_posts',
        'faraz-manage-projects',
        'faraz_proj_render_products_list_page'
    );

    add_submenu_page(
        'edit.php?post_type=project',
        'افزودن نمونه کار جدید',
        'افزودن نمونه کار جدید',
        'edit_posts',
        'faraz-add-project',
        'faraz_proj_render_add_product_page'
    );

    add_submenu_page(
        null,
        'ویرایش نمونه کار',
        'ویرایش نمونه کار',
        'edit_posts',
        'faraz-edit-project',
        'faraz_proj_render_edit_product_page'
    );
}, 30);

add_action('admin_enqueue_scripts', function ($hook) {
    if (!faraz_proj_is_product_admin_page($hook)) {
        return;
    }

    wp_register_style('faraz-project-admin', false);
    wp_enqueue_style('faraz-project-admin');
    wp_add_inline_style('faraz-project-admin', faraz_proj_admin_css());

    if (in_array($hook, ['project_page_faraz-add-project', 'project_page_faraz-edit-project'], true)) {
        wp_enqueue_media();
        wp_register_script('faraz-project-admin', false, ['jquery'], '1.2.0', true);
        wp_enqueue_script('faraz-project-admin');
        wp_add_inline_script('faraz-project-admin', faraz_proj_form_js());
        wp_localize_script('faraz-project-admin', 'farazProjSubcategories', faraz_proj_get_product_subcategories_tree());
    }

    if ($hook === 'project_page_faraz-manage-projects') {
        wp_register_script('faraz-project-list', false, ['jquery'], '1.2.0', true);
        wp_enqueue_script('faraz-project-list');
        wp_add_inline_script('faraz-project-list', faraz_proj_list_js());
    }
});

add_action('admin_post_faraz_save_project', 'faraz_proj_handle_save_product');
add_action('admin_post_faraz_update_project', 'faraz_proj_handle_update_product');
add_action('admin_post_faraz_delete_project', 'faraz_proj_handle_delete_product');

function faraz_proj_handle_save_product()
{
    if (!current_user_can('edit_posts')) {
        wp_die('دسترسی مجاز نیست.');
    }

    check_admin_referer('faraz_save_project');

    $form = faraz_proj_parse_product_form_request();
    if (is_wp_error($form)) {
        faraz_proj_redirect_with_notice('error', $form->get_error_message(), 'faraz-add-project');
    }

    $status = isset($_POST['save_as_draft']) ? 'draft' : 'publish';
    $post_id = wp_insert_post([
        'post_type' => 'project',
        'post_title' => $form['title'],
        'post_content' => $form['content'],
        'post_excerpt' => $form['short_description'],
        'post_status' => $status,
        'post_name' => $form['slug'] !== '' ? $form['slug'] : '',
    ], true);

    if (is_wp_error($post_id)) {
        faraz_proj_redirect_with_notice('error', $post_id->get_error_message(), 'faraz-add-project');
    }

    faraz_proj_persist_product_data((int) $post_id, $form);

    $message = $status === 'publish' ? 'نمونه کار با موفقیت ثبت شد.' : 'نمونه کار به‌صورت پیش‌نویس ذخیره شد.';
    faraz_proj_redirect_with_notice('success', $message, 'faraz-manage-projects');
}

function faraz_proj_handle_update_product()
{
    if (!current_user_can('edit_posts')) {
        wp_die('دسترسی مجاز نیست.');
    }

    check_admin_referer('faraz_update_project');

    $post_id = absint($_POST['project_id'] ?? 0);
    $post = faraz_proj_get_product_post($post_id);

    if (!$post) {
        faraz_proj_redirect_with_notice('error', 'نمونه کار یافت نشد.', 'faraz-manage-projects');
    }

    $form = faraz_proj_parse_product_form_request();
    if (is_wp_error($form)) {
        faraz_proj_redirect_with_notice('error', $form->get_error_message(), 'faraz-edit-project', ['project_id' => $post_id]);
    }

    $status = isset($_POST['save_as_draft']) ? 'draft' : 'publish';
    $updated = wp_update_post([
        'ID' => $post_id,
        'post_title' => $form['title'],
        'post_content' => $form['content'],
        'post_excerpt' => $form['short_description'],
        'post_status' => $status,
        'post_name' => $form['slug'] !== '' ? $form['slug'] : $post->post_name,
    ], true);

    if (is_wp_error($updated)) {
        faraz_proj_redirect_with_notice('error', $updated->get_error_message(), 'faraz-edit-project', ['project_id' => $post_id]);
    }

    faraz_proj_persist_product_data($post_id, $form);

    $message = $status === 'publish' ? 'تغییرات نمونه کار ذخیره شد.' : 'نمونه کار به‌صورت پیش‌نویس ذخیره شد.';
    faraz_proj_redirect_with_notice('success', $message, 'faraz-manage-projects');
}

function faraz_proj_handle_delete_product()
{
    if (!current_user_can('delete_posts')) {
        wp_die('دسترسی مجاز نیست.');
    }

    $post_id = absint($_GET['post_id'] ?? 0);
    check_admin_referer('faraz_delete_project_' . $post_id);

    $post = faraz_proj_get_product_post($post_id);
    if (!$post) {
        faraz_proj_redirect_with_notice('error', 'نمونه کار یافت نشد.', 'faraz-manage-projects');
    }

    $deleted = wp_trash_post($post_id);
    if (!$deleted) {
        faraz_proj_redirect_with_notice('error', 'حذف نمونه کار انجام نشد.', 'faraz-manage-projects');
    }

    faraz_proj_redirect_with_notice('success', 'نمونه کار به سطل زباله منتقل شد.', 'faraz-manage-projects');
}

function faraz_proj_render_add_product_page()
{
    faraz_proj_render_product_form([
        'mode' => 'add',
        'values' => faraz_proj_get_empty_product_form_values(),
        'page_title' => 'افزودن نمونه کار جدید',
        'page_description' => 'ابتدا دسته اصلی (ورزشی یا تزیینی) را انتخاب کنید، سپس زیردسته دقیق پروژه را مشخص کنید.',
        'submit_label' => 'افزودن و انتشار نمونه کار',
        'action' => 'faraz_save_project',
        'nonce_action' => 'faraz_save_project',
        'back_url' => faraz_proj_admin_page_url('faraz-manage-projects'),
    ]);
}

function faraz_proj_render_edit_product_page()
{
    $post_id = absint($_GET['project_id'] ?? 0);
    $post = faraz_proj_get_product_post($post_id);

    if (!$post) {
        echo '<div class="wrap"><div class="notice notice-error"><p>نمونه کار یافت نشد.</p></div></div>';
        return;
    }

    faraz_proj_render_product_form([
        'mode' => 'edit',
        'values' => faraz_proj_get_product_form_values($post_id),
        'page_title' => 'ویرایش نمونه کار',
        'page_description' => 'مقادیر فعلی محصول را تغییر دهید و در پایان «ثبت تغییرات» را بزنید.',
        'submit_label' => 'ثبت تغییرات',
        'action' => 'faraz_update_project',
        'nonce_action' => 'faraz_update_project',
        'back_url' => faraz_proj_admin_page_url('faraz-manage-projects'),
        'project_id' => $post_id,
    ]);
}

function faraz_proj_render_products_list_page()
{
    if (!current_user_can('edit_posts')) {
        return;
    }

    $notice = sanitize_key($_GET['faraz_notice'] ?? '');
    $message = isset($_GET['faraz_message']) ? sanitize_text_field(wp_unslash($_GET['faraz_message'])) : '';
    $products = faraz_proj_get_products_for_list();
    $main_categories = faraz_proj_get_main_categories();
    ?>
    <div class="wrap faraz-project-admin" dir="rtl">
        <div class="faraz-list-header">
            <div>
                <h1>مدیریت نمونه کارها</h1>
                <p class="description">لیست همه نمونه کارها با فیلتر زیردسته. ویرایش و حذف از همین صفحه انجام می‌شود.</p>
            </div>
            <a class="button button-primary" href="<?php echo esc_url(faraz_proj_admin_page_url('faraz-add-project')); ?>">افزودن نمونه کار جدید</a>
        </div>

        <?php faraz_proj_render_admin_notice($notice, $message); ?>

        <div class="faraz-card faraz-list-card">
            <div class="faraz-tabs" role="tablist" aria-label="فیلتر محصولات">
                <button type="button" class="faraz-tab is-active" data-filter="all">همه</button>
                <button type="button" class="faraz-tab" data-filter="sports">ورزشی</button>
                <button type="button" class="faraz-tab" data-filter="decorative">تزیینی</button>
                <?php foreach (faraz_proj_get_flat_subcategories() as $item) : ?>
                    <button
                        type="button"
                        class="faraz-tab faraz-tab--child"
                        data-filter="<?php echo esc_attr($item['slug']); ?>"
                        data-parent="<?php echo esc_attr($item['parent']); ?>"
                    >
                        <?php echo esc_html($item['label']); ?>
                    </button>
                <?php endforeach; ?>
            </div>

            <div class="faraz-table-wrap">
                <table class="widefat fixed striped faraz-projects-table">
                    <thead>
                        <tr>
                            <th class="col-thumb">تصویر</th>
                            <th>عنوان نمونه کار</th>
                            <th>دسته اصلی</th>
                            <th>زیردسته</th>
                            <th>موقعیت / شهر</th>
                            <th>وضعیت</th>
                            <th class="col-actions">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!$products) : ?>
                            <tr class="faraz-empty-row">
                                <td colspan="7">هنوز نمونه کاری ثبت نشده است.</td>
                            </tr>
                        <?php else : ?>
                            <?php foreach ($products as $product) : ?>
                                <tr
                                    data-primary="<?php echo esc_attr($product['primary_category']); ?>"
                                    data-subcategory="<?php echo esc_attr($product['subcategory']); ?>"
                                >
                                    <td class="col-thumb">
                                        <?php if ($product['thumb']) : ?>
                                            <img src="<?php echo esc_url($product['thumb']); ?>" alt="" class="faraz-thumb" />
                                        <?php else : ?>
                                            <span class="faraz-thumb faraz-thumb--empty">—</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <strong><?php echo esc_html($product['title']); ?></strong>
                                        <?php if ($product['project_meta']) : ?>
                                            <div class="faraz-row-meta"><?php echo esc_html($product['project_meta']); ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td><?php echo esc_html($product['primary_label']); ?></td>
                                    <td><?php echo esc_html($product['subcategory_label']); ?></td>
                                    <td><?php echo esc_html($product['price'] ?: '—'); ?></td>
                                    <td>
                                        <span class="faraz-status faraz-status--<?php echo esc_attr($product['status']); ?>">
                                            <?php echo esc_html($product['status_label']); ?>
                                        </span>
                                    </td>
                                    <td class="col-actions">
                                        <a class="button button-small" href="<?php echo esc_url($product['edit_url']); ?>">ویرایش</a>
                                        <a
                                            class="button button-small button-link-delete faraz-delete-project"
                                            href="<?php echo esc_url($product['delete_url']); ?>"
                                            data-title="<?php echo esc_attr($product['title']); ?>"
                                        >حذف</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <p class="faraz-list-count">
                <span id="faraz-visible-count"><?php echo count($products); ?></span>
                نمونه کار نمایش داده می‌شود
            </p>
        </div>
    </div>
    <?php
}

function faraz_proj_render_product_form($config)
{
    if (!current_user_can('edit_posts')) {
        return;
    }

    $values = $config['values'];
    $notice = sanitize_key($_GET['faraz_notice'] ?? '');
    $message = isset($_GET['faraz_message']) ? sanitize_text_field(wp_unslash($_GET['faraz_message'])) : '';
    $categories = faraz_proj_get_main_categories();
    $is_edit = $config['mode'] === 'edit';
    $featured_url = $values['featured_image_id'] ? wp_get_attachment_image_url($values['featured_image_id'], 'medium') : '';

    wp_localize_script('faraz-project-admin', 'farazProjFormInit', [
        'featuredId' => (int) $values['featured_image_id'],
        'featuredUrl' => $featured_url ?: '',
        'galleryIds' => array_map('intval', $values['gallery_ids']),
        'primaryCategory' => $values['primary_category'] ?: 'sports',
        'subcategory' => $values['subcategory'] ?: '',
        'lockSlug' => $is_edit,
    ]);
    ?>
    <div class="wrap faraz-project-admin" dir="rtl">
        <div class="faraz-list-header">
            <div>
                <h1><?php echo esc_html($config['page_title']); ?></h1>
                <p class="description"><?php echo esc_html($config['page_description']); ?></p>
            </div>
            <a class="button" href="<?php echo esc_url($config['back_url']); ?>">بازگشت به لیست</a>
        </div>

        <?php faraz_proj_render_admin_notice($notice, $message); ?>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="faraz-product-form">
            <?php wp_nonce_field($config['nonce_action']); ?>
            <input type="hidden" name="action" value="<?php echo esc_attr($config['action']); ?>" />
            <?php if ($is_edit) : ?>
                <input type="hidden" name="project_id" value="<?php echo esc_attr((int) $config['project_id']); ?>" />
            <?php endif; ?>
            <input type="hidden" name="featured_image_id" id="featured_image_id" value="<?php echo esc_attr((int) $values['featured_image_id']); ?>" />
            <input type="hidden" name="gallery_ids" id="gallery_ids" value="<?php echo esc_attr(implode(',', $values['gallery_ids'])); ?>" />

            <div class="faraz-grid">
                <div class="faraz-main">
                    <div class="faraz-card">
                        <h2>اطلاعات اصلی</h2>
                        <p>
                            <label for="project_title"><strong>عنوان نمونه کار</strong> <span class="required">*</span></label>
                            <input type="text" class="large-text" id="project_title" name="project_title" required value="<?php echo esc_attr($values['title']); ?>" />
                        </p>
                        <p>
                            <label for="short_description"><strong>توضیحات کوتاه</strong></label>
                            <textarea id="short_description" name="short_description" rows="3" class="large-text"><?php echo esc_textarea($values['short_description']); ?></textarea>
                        </p>
                        <p>
                            <label for="project_meta"><strong>مشخصات کارت</strong></label>
                            <input type="text" class="large-text" id="project_meta" name="project_meta" value="<?php echo esc_attr($values['project_meta']); ?>" />
                        </p>
                        <p>
                            <label for="project_content"><strong>محتوای اصلی نمونه کار</strong></label>
                            <?php
                            wp_editor($values['content'], 'project_content', [
                                'textarea_name' => 'project_content',
                                'textarea_rows' => 12,
                                'media_buttons' => true,
                                'teeny' => false,
                            ]);
                            ?>
                        </p>
                    </div>

                    <div class="faraz-card">
                        <h2>تصویر شاخص و گالری</h2>
                        <div class="faraz-media-block">
                            <label><strong>تصویر شاخص</strong></label>
                            <div id="featured-preview" class="faraz-media-preview <?php echo $featured_url ? '' : 'faraz-media-preview--empty'; ?>">
                                <?php if ($featured_url) : ?>
                                    <img src="<?php echo esc_url($featured_url); ?>" alt="" />
                                <?php else : ?>
                                    هنوز تصویری انتخاب نشده است.
                                <?php endif; ?>
                            </div>
                            <p class="faraz-media-actions">
                                <button type="button" class="button button-secondary" id="pick-featured-image">انتخاب تصویر شاخص</button>
                                <button type="button" class="button-link-delete" id="remove-featured-image">حذف</button>
                            </p>
                        </div>
                        <div class="faraz-media-block">
                            <label><strong>گالری تصاویر</strong></label>
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
                            <label><strong>دسته اصلی</strong> <span class="required">*</span></label>
                            <?php foreach ($categories as $slug => $label) : ?>
                                <label class="faraz-radio">
                                    <input type="radio" name="project_category" value="<?php echo esc_attr($slug); ?>" <?php checked($values['primary_category'], $slug); ?> required />
                                    <?php echo esc_html($label); ?>
                                </label>
                            <?php endforeach; ?>
                        </p>
                        <p>
                            <label for="project_subcategory"><strong>زیردسته</strong> <span class="required">*</span></label>
                            <select id="project_subcategory" name="project_subcategory" class="regular-text" required>
                                <option value="">یک زیردسته انتخاب کنید</option>
                            </select>
                        </p>
                        <p>
                            <label for="project_location"><strong>موقعیت / شهر</strong></label>
                            <input type="text" class="regular-text" id="project_location" name="project_location" value="<?php echo esc_attr($values['project_location']); ?>" />
                        </p>
                        <p>
                            <label for="post_slug"><strong>آدرس URL (نامک)</strong></label>
                            <input type="text" class="regular-text" id="post_slug" name="post_slug" value="<?php echo esc_attr($values['slug']); ?>" dir="ltr" />
                        </p>
                        <p>
                            <label class="faraz-check">
                                <input type="checkbox" name="robots_index" value="1" <?php checked($values['robots_index']); ?> />
                                <strong>اجازه ایندکس شدن توسط گوگل</strong>
                            </label>
                        </p>
                        <p class="faraz-submit-row">
                            <button type="submit" class="button button-primary button-hero"><?php echo esc_html($config['submit_label']); ?></button>
                            <button type="submit" name="save_as_draft" value="1" class="button">ذخیره پیش‌نویس</button>
                        </p>
                    </div>
                    <div class="faraz-card">
                        <h2>سئو (SEO)</h2>
                        <p>
                            <label for="seo_title"><strong>متا عنوان</strong></label>
                            <input type="text" class="large-text" id="seo_title" name="seo_title" value="<?php echo esc_attr($values['seo_title']); ?>" />
                        </p>
                        <p>
                            <label for="seo_description"><strong>متا توضیحات</strong></label>
                            <textarea id="seo_description" name="seo_description" rows="4" class="large-text"><?php echo esc_textarea($values['seo_description']); ?></textarea>
                        </p>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <?php
}

function faraz_proj_parse_product_form_request()
{
    $title = sanitize_text_field(wp_unslash($_POST['project_title'] ?? ''));
    if ($title === '') {
        return new WP_Error('faraz_missing_title', 'عنوان نمونه کار الزامی است.');
    }

    $category = sanitize_key($_POST['project_category'] ?? '');
    $subcategory = sanitize_key($_POST['project_subcategory'] ?? '');
    $main_categories = array_keys(faraz_proj_get_main_categories());

    if (!in_array($category, $main_categories, true)) {
        return new WP_Error('faraz_invalid_category', 'دسته اصلی معتبر نیست.');
    }

    $allowed_subcategories = array_column(faraz_proj_get_product_subcategories_tree()[$category] ?? [], 'slug');
    if (!in_array($subcategory, $allowed_subcategories, true)) {
        return new WP_Error('faraz_invalid_subcategory', 'زیردسته را انتخاب کنید.');
    }

    $gallery_raw = sanitize_text_field(wp_unslash($_POST['gallery_ids'] ?? ''));

    return [
        'title' => $title,
        'short_description' => sanitize_textarea_field(wp_unslash($_POST['short_description'] ?? '')),
        'content' => wp_kses_post(wp_unslash($_POST['project_content'] ?? '')),
        'project_meta' => sanitize_text_field(wp_unslash($_POST['project_meta'] ?? '')),
        'project_location' => sanitize_text_field(wp_unslash($_POST['project_location'] ?? '')),
        'seo_title' => sanitize_text_field(wp_unslash($_POST['seo_title'] ?? '')),
        'seo_description' => sanitize_textarea_field(wp_unslash($_POST['seo_description'] ?? '')),
        'slug' => sanitize_title(wp_unslash($_POST['post_slug'] ?? '')),
        'category' => $category,
        'subcategory' => $subcategory,
        'featured_image_id' => absint($_POST['featured_image_id'] ?? 0),
        'gallery_ids' => array_values(array_filter(array_map('absint', explode(',', $gallery_raw)))),
        'allow_index' => isset($_POST['robots_index']) && $_POST['robots_index'] === '1',
    ];
}

function faraz_proj_persist_product_data($post_id, $form)
{
    if ($form['featured_image_id'] > 0) {
        set_post_thumbnail($post_id, $form['featured_image_id']);
    } else {
        delete_post_thumbnail($post_id);
    }

    faraz_proj_assign_product_terms($post_id, $form['category'], $form['subcategory']);
    faraz_proj_update_product_meta($post_id, 'short_description', $form['short_description']);
    faraz_proj_update_product_meta($post_id, 'project_meta', $form['project_meta']);
    faraz_proj_update_product_meta($post_id, 'project_location', $form['project_location']);
    faraz_proj_update_product_meta($post_id, 'seo_title', $form['seo_title']);
    faraz_proj_update_product_meta($post_id, 'seo_description', $form['seo_description']);
    faraz_proj_update_product_meta($post_id, 'robots_noindex', $form['allow_index'] ? '0' : '1');
    faraz_proj_update_product_meta($post_id, 'gallery', implode(',', $form['gallery_ids']));
    faraz_proj_update_product_meta($post_id, 'subcategory', $form['subcategory']);
    faraz_proj_update_product_meta($post_id, 'primary_category', $form['category']);

    if (function_exists('update_field')) {
        update_field('short_description', $form['short_description'], $post_id);
        update_field('project_meta', $form['project_meta'], $post_id);
        update_field('project_location', $form['project_location'], $post_id);
        update_field('seo_title', $form['seo_title'], $post_id);
        update_field('seo_description', $form['seo_description'], $post_id);
        update_field('gallery', $form['gallery_ids'], $post_id);
        update_field('robots_noindex', $form['allow_index'] ? 0 : 1, $post_id);
        update_field('subcategory', $form['subcategory'], $post_id);
        update_field('primary_category', $form['category'], $post_id);
    }
}

function faraz_proj_get_empty_product_form_values()
{
    return [
        'title' => '',
        'short_description' => '',
        'content' => '',
        'project_meta' => '',
        'project_location' => '',
        'seo_title' => '',
        'seo_description' => '',
        'slug' => '',
        'primary_category' => 'sports',
        'subcategory' => '',
        'featured_image_id' => 0,
        'gallery_ids' => [],
        'robots_index' => true,
    ];
}

function faraz_proj_get_product_form_values($post_id)
{
    $post = get_post($post_id);
    $featured_id = (int) get_post_thumbnail_id($post_id);

    return [
        'title' => $post ? $post->post_title : '',
        'short_description' => faraz_proj_get_product_meta($post_id, 'short_description') ?: ($post->post_excerpt ?? ''),
        'content' => $post ? $post->post_content : '',
        'project_meta' => faraz_proj_get_product_meta($post_id, 'project_meta'),
        'project_location' => faraz_proj_get_product_meta($post_id, 'project_location'),
        'seo_title' => faraz_proj_get_product_meta($post_id, 'seo_title'),
        'seo_description' => faraz_proj_get_product_meta($post_id, 'seo_description'),
        'slug' => $post ? $post->post_name : '',
        'primary_category' => faraz_proj_get_product_primary_category_slug($post_id) ?: 'sports',
        'subcategory' => faraz_proj_get_product_subcategory_slug($post_id),
        'featured_image_id' => $featured_id,
        'gallery_ids' => faraz_proj_get_product_gallery_ids($post_id),
        'robots_index' => faraz_proj_get_product_meta($post_id, 'robots_noindex') !== '1',
    ];
}

function faraz_proj_get_products_for_list()
{
    $posts = get_posts([
        'post_type' => 'project',
        'post_status' => ['publish', 'draft', 'pending', 'private'],
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
    ]);

    $main_categories = faraz_proj_get_main_categories();
    $rows = [];

    foreach ($posts as $post) {
        $id = (int) $post->ID;
        $primary = faraz_proj_get_product_primary_category_slug($id);
        $subcategory = faraz_proj_get_product_subcategory_slug($id);
        $status = $post->post_status;

        $rows[] = [
            'id' => $id,
            'title' => $post->post_title,
            'project_meta' => faraz_proj_get_product_meta($id, 'project_meta'),
            'price' => faraz_proj_get_product_meta($id, 'project_location'),
            'primary_category' => $primary,
            'primary_label' => $main_categories[$primary] ?? '—',
            'subcategory' => $subcategory,
            'subcategory_label' => $subcategory ? faraz_proj_get_subcategory_label($subcategory) : '—',
            'status' => $status,
            'status_label' => faraz_proj_get_status_label($status),
            'thumb' => get_the_post_thumbnail_url($id, 'thumbnail') ?: '',
            'edit_url' => faraz_proj_admin_page_url('faraz-edit-project', ['project_id' => $id]),
            'delete_url' => wp_nonce_url(
                admin_url('admin-post.php?action=faraz_delete_project&post_id=' . $id),
                'faraz_delete_project_' . $id
            ),
        ];
    }

    return $rows;
}

function faraz_proj_get_status_label($status)
{
    $labels = [
        'publish' => 'منتشر شده',
        'draft' => 'پیش‌نویس',
        'pending' => 'در انتظار',
        'private' => 'خصوصی',
    ];

    return $labels[$status] ?? $status;
}

function faraz_proj_get_product_post($post_id)
{
    $post = get_post((int) $post_id);

    if (!$post || $post->post_type !== 'project') {
        return null;
    }

    return $post;
}

function faraz_proj_is_product_admin_page($hook)
{
    return in_array($hook, [
        'project_page_faraz-manage-projects',
        'project_page_faraz-add-project',
        'project_page_faraz-edit-project',
    ], true);
}

function faraz_proj_admin_page_url($page, $args = [])
{
    return add_query_arg(array_merge(['page' => $page], $args), admin_url('edit.php?post_type=project'));
}

function faraz_proj_render_admin_notice($notice, $message)
{
    if ($notice === 'success' && $message !== '') {
        echo '<div class="notice notice-success is-dismissible"><p>' . esc_html($message) . '</p></div>';
        return;
    }

    if ($notice === 'error' && $message !== '') {
        echo '<div class="notice notice-error is-dismissible"><p>' . esc_html($message) . '</p></div>';
    }
}

function faraz_proj_get_product_meta($post_id, $key)
{
    return get_post_meta((int) $post_id, FARAZ_PROJ_META_PREFIX . $key, true);
}

function faraz_proj_update_product_meta($post_id, $key, $value)
{
    update_post_meta((int) $post_id, FARAZ_PROJ_META_PREFIX . $key, $value);
}

function faraz_proj_get_product_gallery_ids($post_id)
{
    $raw = faraz_proj_get_product_meta($post_id, 'gallery');
    if ($raw === '') {
        return [];
    }

    return array_values(array_filter(array_map('absint', explode(',', $raw))));
}

function faraz_proj_ensure_product_term($slug, $name, $parent_id = 0)
{
    $existing = get_term_by('slug', $slug, 'product_category');

    if ($existing && !is_wp_error($existing)) {
        if ($parent_id > 0 && (int) $existing->parent !== (int) $parent_id) {
            wp_update_term((int) $existing->term_id, 'product_category', ['parent' => (int) $parent_id]);
        }

        return (int) $existing->term_id;
    }

    $args = ['slug' => $slug];
    if ($parent_id > 0) {
        $args['parent'] = (int) $parent_id;
    }

    $result = wp_insert_term($name, 'product_category', $args);

    if (is_wp_error($result)) {
        return 0;
    }

    return (int) $result['term_id'];
}

function faraz_proj_assign_product_terms($post_id, $category_slug, $subcategory_slug)
{
    if (!taxonomy_exists('product_category')) {
        return;
    }

    $term_ids = [];
    $parent_term = get_term_by('slug', $category_slug, 'product_category');
    $child_term = get_term_by('slug', $subcategory_slug, 'product_category');

    if ($parent_term && !is_wp_error($parent_term)) {
        $term_ids[] = (int) $parent_term->term_id;
    }

    if ($child_term && !is_wp_error($child_term)) {
        $term_ids[] = (int) $child_term->term_id;
    }

    if ($term_ids) {
        wp_set_object_terms((int) $post_id, $term_ids, 'product_category', false);
    }
}

function faraz_proj_get_product_terms($post_id)
{
    $terms = get_the_terms((int) $post_id, 'product_category');

    if (!$terms || is_wp_error($terms)) {
        return [];
    }

    return $terms;
}

function faraz_proj_get_product_primary_category_slug($post_id)
{
    $saved = faraz_proj_get_product_meta($post_id, 'primary_category');
    if ($saved !== '') {
        return $saved;
    }

    foreach (faraz_proj_get_product_terms($post_id) as $term) {
        if (in_array($term->slug, FARAZ_PROJ_MAIN_CATEGORY_SLUGS, true)) {
            return $term->slug;
        }
    }

    return '';
}

function faraz_proj_get_product_subcategory_slug($post_id)
{
    $saved = faraz_proj_get_product_meta($post_id, 'subcategory');
    if ($saved !== '') {
        return $saved;
    }

    foreach (faraz_proj_get_product_terms($post_id) as $term) {
        if (!in_array($term->slug, FARAZ_PROJ_MAIN_CATEGORY_SLUGS, true)) {
            return $term->slug;
        }
    }

    return '';
}

function faraz_proj_redirect_with_notice($type, $message, $page = 'faraz-manage-projects', $args = [])
{
    $redirect = add_query_arg(array_merge([
        'page' => $page,
        'faraz_notice' => $type,
        'faraz_message' => rawurlencode($message),
    ], $args), admin_url('edit.php?post_type=project'));

    wp_safe_redirect($redirect);
    exit;
}

function faraz_proj_admin_css()
{
    return '
        .faraz-project-admin .description { margin-bottom: 0; }
        .faraz-list-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; }
        .faraz-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 20px; align-items: start; }
        .faraz-card { background: #fff; border: 1px solid #dcdcde; border-radius: 8px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
        .faraz-list-card { padding-top: 14px; }
        .faraz-card h2 { margin: 0 0 14px; font-size: 16px; }
        .faraz-card p { margin: 0 0 16px; }
        .faraz-card p:last-child { margin-bottom: 0; }
        .faraz-hint { display: block; color: #646970; font-size: 12px; margin-top: 6px; }
        .required { color: #d63638; }
        .faraz-radio, .faraz-check { display: flex; align-items: center; gap: 8px; margin: 8px 0; font-weight: 400; }
        #project_subcategory { width: 100%; max-width: 100%; }
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
        .faraz-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #ececec; }
        .faraz-tab { border: 1px solid #dcdcde; background: #f6f7f7; color: #1d2327; border-radius: 999px; padding: 6px 14px; cursor: pointer; font-size: 13px; }
        .faraz-tab:hover { background: #fff; }
        .faraz-tab.is-active { background: #2271b1; border-color: #2271b1; color: #fff; }
        .faraz-tab--child { background: #fff; }
        .faraz-table-wrap { overflow-x: auto; }
        .faraz-projects-table .col-thumb { width: 72px; }
        .faraz-projects-table .col-actions { width: 150px; }
        .faraz-thumb { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; display: block; border: 1px solid #dcdcde; }
        .faraz-thumb--empty { display: inline-flex; align-items: center; justify-content: center; background: #f6f7f7; color: #8c8f94; }
        .faraz-row-meta { color: #646970; font-size: 12px; margin-top: 4px; }
        .faraz-status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; background: #eef5ea; color: #1e6021; }
        .faraz-status--draft { background: #f2f2f2; color: #646970; }
        .faraz-status--pending { background: #fff6e5; color: #8a5b00; }
        .faraz-list-count { margin: 14px 0 0; color: #646970; font-size: 13px; }
        .faraz-empty-row td { text-align: center; color: #646970; padding: 28px !important; }
        @media (max-width: 1100px) { .faraz-grid, .faraz-list-header { grid-template-columns: 1fr; flex-direction: column; } }
    ';
}

function faraz_proj_form_js()
{
    return <<<'JS'
jQuery(function ($) {
    let featuredFrame;
    let galleryFrame;
    let galleryIds = (window.farazProjFormInit && window.farazProjFormInit.galleryIds) || [];

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

    function getSelectedMainCategory() {
        return $('input[name="project_category"]:checked').val() || 'sports';
    }

    function renderSubcategories() {
        const main = getSelectedMainCategory();
        const $select = $('#project_subcategory');
        const items = (window.farazProjSubcategories && window.farazProjSubcategories[main]) || [];
        const preferred = (window.farazProjFormInit && window.farazProjFormInit.subcategory) || $select.val();

        $select.empty().append('<option value="">یک زیردسته انتخاب کنید</option>');
        items.forEach(function (item) {
            $select.append('<option value="' + item.slug + '">' + item.label + '</option>');
        });

        if (preferred && items.some(function (item) { return item.slug === preferred; })) {
            $select.val(preferred);
        }
    }

    if (window.farazProjFormInit) {
        const init = window.farazProjFormInit;
        $('input[name="project_category"][value="' + init.primaryCategory + '"]').prop('checked', true);
        if (init.featuredId && init.featuredUrl) {
            renderFeatured(init.featuredId, init.featuredUrl);
        }
    }

    renderSubcategories();
    renderGallery();
    $('input[name="project_category"]').on('change', function () {
        $('#project_subcategory').val('');
        renderSubcategories();
    });

    $('#pick-featured-image').on('click', function (e) {
        e.preventDefault();
        if (featuredFrame) { featuredFrame.open(); return; }
        featuredFrame = wp.media({ title: 'انتخاب تصویر شاخص', button: { text: 'استفاده از این تصویر' }, multiple: false });
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
        if (galleryFrame) { galleryFrame.open(); return; }
        galleryFrame = wp.media({ title: 'افزودن تصاویر به گالری', button: { text: 'افزودن به گالری' }, multiple: true });
        galleryFrame.on('select', function () {
            galleryFrame.state().get('selection').each(function (attachment) {
                const json = attachment.toJSON();
                if (!galleryIds.includes(json.id)) galleryIds.push(json.id);
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

    $('#project_title').on('input', function () {
        const $slug = $('#post_slug');
        if ((window.farazProjFormInit && window.farazProjFormInit.lockSlug) || $slug.val().trim() !== '') return;
        const slug = $(this).val().toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
        $slug.val(slug);
    });
});
JS;
}

function faraz_proj_list_js()
{
    return <<<'JS'
jQuery(function ($) {
    function applyFilter(filter) {
        let visible = 0;
        $('.faraz-projects-table tbody tr').not('.faraz-empty-row').each(function () {
            const $row = $(this);
            const primary = $row.data('primary');
            const subcategory = $row.data('subcategory');
            let show = false;

            if (filter === 'all') {
                show = true;
            } else if (filter === 'sports' || filter === 'decorative') {
                show = primary === filter;
            } else {
                show = subcategory === filter;
            }

            $row.toggle(show);
            if (show) visible += 1;
        });

        $('#faraz-visible-count').text(visible);
    }

    $('.faraz-tab').on('click', function () {
        $('.faraz-tab').removeClass('is-active');
        $(this).addClass('is-active');
        applyFilter($(this).data('filter'));
    });

    $('.faraz-delete-project').on('click', function (e) {
        const title = $(this).data('title') || 'این محصول';
        if (!window.confirm('آیا از حذف «' + title + '» مطمئن هستید؟')) {
            e.preventDefault();
        }
    });

    applyFilter('all');
});
JS;
}


