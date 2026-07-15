import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "./components/Breadcrumbs.jsx";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
import { LoadingSpinner } from "./components/LoadingSpinner.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { resolveRoute } from "./utils/routing.js";

const pageLoaders = {
    "/services": () => import("./pages/ServicesPage.jsx"),
    "/products": () => import("./pages/ProductsPage.jsx"),
    "/products/sports": () => import("./pages/ProductCategoryPage.jsx"),
    "/products/decorative": () => import("./pages/ProductCategoryPage.jsx"),
    "/process": () => import("./pages/ProcessPage.jsx"),
    "/projects": () => import("./pages/ProjectsPage.jsx"),
    "/projects/:slug": () => import("./pages/ProjectDetailPage.jsx"),
    "/faq": () => import("./pages/FAQPage.jsx"),
    "/contact": () => import("./pages/ContactPage.jsx"),
};

const ServicesPage = lazy(() => pageLoaders["/services"]().then((m) => ({ default: m.ServicesPage })));
const ProductsPage = lazy(() => pageLoaders["/products"]().then((m) => ({ default: m.ProductsPage })));
const ProductSportsPage = lazy(() =>
    pageLoaders["/products/sports"]().then((m) => ({ default: m.ProductSportsPage })),
);
const ProductDecorativePage = lazy(() =>
    pageLoaders["/products/decorative"]().then((m) => ({ default: m.ProductDecorativePage })),
);
const ProcessPage = lazy(() => pageLoaders["/process"]().then((m) => ({ default: m.ProcessPage })));
const ProjectsPage = lazy(() => pageLoaders["/projects"]().then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() =>
    pageLoaders["/projects/:slug"]().then((m) => ({ default: m.ProjectDetailPage })),
);
const FAQPage = lazy(() => pageLoaders["/faq"]().then((m) => ({ default: m.FAQPage })));
const ContactPage = lazy(() => pageLoaders["/contact"]().then((m) => ({ default: m.ContactPage })));

const staticRoutes = {
    "/": HomePage,
    "/services": ServicesPage,
    "/products": ProductsPage,
    "/products/sports": ProductSportsPage,
    "/products/decorative": ProductDecorativePage,
    "/process": ProcessPage,
    "/projects": ProjectsPage,
    "/faq": FAQPage,
    "/contact": ContactPage,
};

function resolveCurrentRoute() {
    return resolveRoute(window.location.pathname, staticRoutes, ProjectDetailPage, HomePage);
}

export default function App() {
    const [route, setRoute] = useState(resolveCurrentRoute);

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

            e.preventDefault();
            history.pushState(null, "", href);
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

            if (/^\/projects\/[^/]+\/?$/.test(pathname)) {
                void pageLoaders["/projects/:slug"]().catch(() => {});
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

    const { path: currentPath, Page, params } = route;
    const pageKey = useMemo(
        () => (params.slug ? `${currentPath}:${params.slug}` : currentPath),
        [currentPath, params.slug],
    );

    return (
        <>
            <Header currentPath={currentPath} />
            <Breadcrumbs currentPath={currentPath} />
            <main className="page-router" key={pageKey}>
                <Suspense fallback={<LoadingSpinner />}>
                    <Page {...params} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
