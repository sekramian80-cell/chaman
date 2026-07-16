import { ContactCTA } from '../components/ContactCTA.jsx';
import { ProductCategoryGate } from '../components/ProductCategoryGate.jsx';
import { ProductCategoryPreview } from '../components/ProductCategoryPreview.jsx';
import { ProductShowcase } from '../components/ProductShowcase.jsx';
import productsHero from '../assets/hero-products-football.jpg';
import { pageHeros } from '../content/contact.js';
import { productCategoryList } from '../content/productCategories.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { toPersianNumber } from '../utils/persianNumber.js';
import { PageHero } from './PageHero.jsx';

export function ProductsPage() {
    const { products } = useSiteContent();
    const sportsCount = products?.byCategory?.sports?.length || 0;
    const decorativeCount = products?.byCategory?.decorative?.length || 0;
    const total = sportsCount + decorativeCount;
    const hero = pageHeros.products;

    const description =
        total > 0
            ? `${toPersianNumber(total)} نمونه از چمن ورزشی و تزیینی؛ مقایسه ظاهر، تراکم و کاربرد برای انتخاب دقیق‌تر.`
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
            <ProductCategoryGate
                counts={{
                    sports: sportsCount,
                    decorative: decorativeCount,
                }}
            />
            {productCategoryList.map((category) => (
                <ProductCategoryPreview
                    category={category}
                    items={products?.byCategory?.[category.slug] || []}
                    key={category.slug}
                />
            ))}
            <ContactCTA />
        </div>
    );
}
