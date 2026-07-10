import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
import { LoadingSpinner } from "./components/LoadingSpinner.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx").then((m) => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx").then((m) => ({ default: m.ServicesPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage.jsx").then((m) => ({ default: m.ProductsPage })));
const ProcessPage = lazy(() => import("./pages/ProcessPage.jsx").then((m) => ({ default: m.ProcessPage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.jsx").then((m) => ({ default: m.ProjectsPage })));
const FAQPage = lazy(() => import("./pages/FAQPage.jsx").then((m) => ({ default: m.FAQPage })));

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

        document.addEventListener("click", handleLinkClick);
        window.addEventListener("popstate", handleRouteChange);

        return () => {
            document.removeEventListener("click", handleLinkClick);
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
