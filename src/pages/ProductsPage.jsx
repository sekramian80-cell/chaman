import { ContactCTA } from '../components/ContactCTA.jsx';
import { CategoryBrowser } from '../components/CategoryBrowser.jsx';
import { ProductCategoryPreview } from '../components/ProductCategoryPreview.jsx';
import { ProductShowcase } from '../components/ProductShowcase.jsx';
import productsHero from '../assets/hero-products-football.jpg';
import { pageHeros } from '../content/contact.js';
import { productCategoryConfig } from '../content/productCategories.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { getCategoryPath } from '../utils/routing.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

// از گرهِ درختِ دسته یک آبجکت سازگار با ProductCategoryPreview می‌سازد
function toPreviewCategory(node) {
    const config = productCategoryConfig[node.slug];
    return {
        slug: node.slug,
        title: config?.title || node.title,
        eyebrow: config?.eyebrow || 'دستهٔ محصولات',
        description:
            config?.description ||
            `محصولات دستهٔ «${node.title}»؛ برای مشاوره و استعلام قیمت با ما در تماس باشید.`,
        path: getCategoryPath(node.slug),
        previewLimit: 4,
    };
}

export function ProductsPage() {
    const { products, navigation } = useSiteContent();
    const tree = products?.tree || [];
    const total = products?.cards?.length || 0;
    const hero = pageHeros.products;

    const description =
        total > 0
            ? `${toPersianNumber(total)} محصول در دسته‌های مختلف؛ برای انتخاب دقیق‌تر، دستهٔ موردنظرت را ببین.`
            : hero?.description ||
              'مقایسه ظاهر، تراکم، دوام و کاربردهای مختلف برای انتخاب بهترین مدل متناسب با فضای شما.';

    return (
        <div className="products-page">
            <PageHero
                image={productsHero}
                eyebrow={hero?.eyebrow || 'صفحه محصولات'}
                title={hero?.title || 'مدل‌های پیشنهادی چمن مصنوعی'}
                description={description}
                primaryLabel={hero?.primaryLabel || 'استعلام قیمت'}
                secondaryLabel={hero?.secondaryLabel || 'مشاهده پروژه‌ها'}
                secondaryHref="/projects"
                seam="petal"
            />
            <ProductShowcase />
            <CategoryBrowser tree={tree} navItems={navigation?.items || []} />
            {tree.map((node) => (
                <ProductCategoryPreview
                    category={toPreviewCategory(node)}
                    items={products?.byCategory?.[node.slug] || []}
                    key={node.slug}
                />
            ))}
            <ContactCTA />
        </div>
    );
}
