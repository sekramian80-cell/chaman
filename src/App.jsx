import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
import { LoadingSpinner } from "./components/LoadingSpinner.jsx";
import { HomePage } from "./pages/HomePage.jsx";

const pageLoaders = {
    "/services": () => import("./pages/ServicesPage.jsx"),
    "/products": () => import("./pages/ProductsPage.jsx"),
    "/process": () => import("./pages/ProcessPage.jsx"),
    "/projects": () => import("./pages/ProjectsPage.jsx"),
    "/faq": () => import("./pages/FAQPage.jsx"),
};

const ServicesPage = lazy(() => pageLoaders["/services"]().then((m) => ({ default: m.ServicesPage })));
const ProductsPage = lazy(() => pageLoaders["/products"]().then((m) => ({ default: m.ProductsPage })));
const ProcessPage = lazy(() => pageLoaders["/process"]().then((m) => ({ default: m.ProcessPage })));
const ProjectsPage = lazy(() => pageLoaders["/projects"]().then((m) => ({ default: m.ProjectsPage })));
const FAQPage = lazy(() => pageLoaders["/faq"]().then((m) => ({ default: m.FAQPage })));

const routes = {
    "/": HomePage,
    "/services": ServicesPage,
    "/products": ProductsPage,
    "/process": ProcessPage,
    "/projects": ProjectsPage,
    "/faq": FAQPage,
};

function getCurrentPath() {
    return routes[window.location.pathname] ? window.location.pathname : "/";
}

export default function App() {
    const [currentPath, setCurrentPath] = useState(getCurrentPath);

    useEffect(() => {
        const handleRouteChange = () => {
            setCurrentPath(getCurrentPath());
            window.scrollTo({ top: 0, behavior: "auto" });
        };

        // SPA link interceptor: prevent full reloads on internal links
        const handleLinkClick = (e) => {
            const link = e.target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href) return;

            // Only handle internal paths (skip tel:, mailto:, external URLs, anchors)
            if (
                href.startsWith("http") ||
                href.startsWith("tel:") ||
                href.startsWith("mailto:") ||
                href.startsWith("#")
            ) {
                return;
            }

            // Skip if target is _blank
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
            const preloadPage = pageLoaders[pathname];
            if (preloadPage) void preloadPage().catch(() => {});
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

    const Page = useMemo(() => routes[currentPath] ?? HomePage, [currentPath]);

    return (
        <>
            <Header currentPath={currentPath} />
            <main className="page-router" key={currentPath}>
                <Suspense fallback={<LoadingSpinner />}>
                    <Page />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
