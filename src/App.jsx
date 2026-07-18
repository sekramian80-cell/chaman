import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "./components/Breadcrumbs.jsx";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
import { LoadingSpinner } from "./components/LoadingSpinner.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import {
    getCategorySlugFromPath,
    getProductSlugFromPath,
    getProjectSlugFromPath,
    isProductCategoryPath,
    isProductDetailPath,
    isProjectDetailPath,
    resolveRoute,
} from "./utils/routing.js";

const pageLoaders = {
    "/services": () => import("./pages/ServicesPage.jsx"),
    "/products": () => import("./pages/ProductsPage.jsx"),
    "/products/:category": () => import("./pages/ProductCategoryPage.jsx"),
    "/product/:slug": () => import("./pages/ProductDetailPage.jsx"),
    "/process": () => import("./pages/ProcessPage.jsx"),
    "/projects": () => import("./pages/ProjectsPage.jsx"),
    "/projects/:slug": () => import("./pages/ProjectDetailPage.jsx"),
    "/faq": () => import("./pages/FAQPage.jsx"),
    "/contact": () => import("./pages/ContactPage.jsx"),
    "/cart": () => import("./pages/CartPage.jsx"),
};

const ServicesPage = lazy(() => pageLoaders["/services"]().then((m) => ({ default: m.ServicesPage })));
const ProductsPage = lazy(() => pageLoaders["/products"]().then((m) => ({ default: m.ProductsPage })));
const ProductCategoryPage = lazy(() =>
    pageLoaders["/products/:category"]().then((m) => ({ default: m.ProductCategoryPage })),
);
const ProcessPage = lazy(() => pageLoaders["/process"]().then((m) => ({ default: m.ProcessPage })));
const ProjectsPage = lazy(() => pageLoaders["/projects"]().then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() =>
    pageLoaders["/projects/:slug"]().then((m) => ({ default: m.ProjectDetailPage })),
);
const ProductDetailPage = lazy(() =>
    pageLoaders["/product/:slug"]().then((m) => ({ default: m.ProductDetailPage })),
);
const FAQPage = lazy(() => pageLoaders["/faq"]().then((m) => ({ default: m.FAQPage })));
const ContactPage = lazy(() => pageLoaders["/contact"]().then((m) => ({ default: m.ContactPage })));
const CartPage = lazy(() => pageLoaders["/cart"]().then((m) => ({ default: m.CartPage })));

const staticRoutes = {
    "/": HomePage,
    "/services": ServicesPage,
    "/products": ProductsPage,
    "/process": ProcessPage,
    "/projects": ProjectsPage,
    "/faq": FAQPage,
    "/contact": ContactPage,
    "/cart": CartPage,
};

function resolveCurrentRoute() {
    return resolveRoute(
        window.location.pathname,
        staticRoutes,
        ProjectDetailPage,
        HomePage,
        ProductDetailPage,
        ProductCategoryPage,
    );
}

function toAppPath(href) {
    try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return null;
        return `${url.pathname}${url.search}${url.hash}` || "/";
    } catch {
        return null;
    }
}

export default function App() {
    const [route, setRoute] = useState(() => resolveCurrentRoute());

    useEffect(() => {
        const handleRouteChange = () => {
            setRoute(resolveCurrentRoute());
            window.scrollTo({ top: 0, behavior: "auto" });
        };

        const handleLinkClick = (e) => {
            const link = e.target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href) return;

            if (
                href.startsWith("http") ||
                href.startsWith("tel:") ||
                href.startsWith("mailto:") ||
                href.startsWith("#")
            ) {
                return;
            }

            if (link.target === "_blank") return;

            const nextPath = toAppPath(href);
            if (!nextPath) return;

            e.preventDefault();
            history.pushState(null, "", nextPath);
            handleRouteChange();
        };

        const handleRouteIntent = (e) => {
            const link = e.target.closest("a");
            const href = link?.getAttribute("href");
            if (!href?.startsWith("/")) return;

            const pathname = new URL(href, window.location.origin).pathname;
            if (pageLoaders[pathname]) {
                void pageLoaders[pathname]().catch(() => {});
                return;
            }

            if (isProjectDetailPath(pathname)) {
                void pageLoaders["/projects/:slug"]().catch(() => {});
                return;
            }

            if (isProductDetailPath(pathname)) {
                void pageLoaders["/product/:slug"]().catch(() => {});
                return;
            }

            if (isProductCategoryPath(pathname)) {
                void pageLoaders["/products/:category"]().catch(() => {});
            }
        };

        document.addEventListener("click", handleLinkClick);
        document.addEventListener("pointerover", handleRouteIntent, { passive: true });
        document.addEventListener("focusin", handleRouteIntent);
        window.addEventListener("popstate", handleRouteChange);

        return () => {
            document.removeEventListener("click", handleLinkClick);
            document.removeEventListener("pointerover", handleRouteIntent);
            document.removeEventListener("focusin", handleRouteIntent);
            window.removeEventListener("popstate", handleRouteChange);
        };
    }, []);

    const { path: currentPath, Page, params, isProjectDetail, isProductDetail, isProductCategory } = route;
    const projectSlug = params?.slug || (isProjectDetail ? getProjectSlugFromPath(currentPath) : "");
    const productSlug = params?.slug || (isProductDetail ? getProductSlugFromPath(currentPath) : "");
    const categorySlug = params?.slug || (isProductCategory ? getCategorySlugFromPath(currentPath) : "");
    const pageKey = useMemo(() => {
        if (projectSlug && isProjectDetail) return `project:${projectSlug}`;
        if (productSlug && isProductDetail) return `product:${productSlug}`;
        if (categorySlug && isProductCategory) return `category:${categorySlug}`;
        return currentPath;
    }, [currentPath, projectSlug, productSlug, categorySlug, isProjectDetail, isProductDetail, isProductCategory]);
    const showBreadcrumbs = currentPath !== "/";

    return (
        <>
            <a className="skip-link" href="#main-content">
                پرش به محتوای اصلی
            </a>
            <Header currentPath={currentPath} />
            {showBreadcrumbs ? <Breadcrumbs currentPath={currentPath} /> : null}
            <main id="main-content" className="page-router" key={pageKey} tabIndex={-1}>
                <Suspense fallback={<LoadingSpinner />}>
                    {isProjectDetail ? (
                        <ProjectDetailPage slug={projectSlug} />
                    ) : isProductDetail ? (
                        <ProductDetailPage slug={productSlug} />
                    ) : isProductCategory ? (
                        <ProductCategoryPage categorySlug={categorySlug} />
                    ) : (
                        <Page />
                    )}
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
