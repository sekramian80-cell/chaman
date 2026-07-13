import { ContactCTA } from "../components/ContactCTA.jsx";
import { ProductCategoryPreview } from "../components/ProductCategoryPreview.jsx";
import { ProductShowcase } from "../components/ProductShowcase.jsx";
import productsHero from "../assets/hero-products-football.jpg";
import { productCategoryList } from "../content/productCategories.js";
import { useSiteContent } from "../hooks/useSiteContent.js";
import { PageHero } from "./PageHero.jsx";

export function ProductsPage() {
    const { products } = useSiteContent();

    return (
        <>
            <PageHero
                image={productsHero}
                eyebrow="صفحه محصولات"
                title="دسته‌بندی محصولات و نمونه پروژه‌های چمن مصنوعی"
                description="محصولات بر اساس کاربرد به دو بخش ورزشی و تزیینی تقسیم شده‌اند تا انتخاب مدل و دیدن نمونه اجرا ساده‌تر باشد."
                primaryLabel="استعلام قیمت"
                secondaryLabel="مشاهده خدمات"
                secondaryHref="/services"
            />
            <ProductShowcase />
            {productCategoryList.map((category) => (
                <ProductCategoryPreview
                    category={category}
                    items={products?.byCategory?.[category.slug] || []}
                    key={category.slug}
                />
            ))}
            <ContactCTA />
        </>
    );
}
