import { useEffect, useMemo, useState } from 'react';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { FAQPage } from './pages/FAQPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProcessPage } from './pages/ProcessPage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';

const routes = {
  '/': HomePage,
  '/services': ServicesPage,
  '/products': ProductsPage,
  '/process': ProcessPage,
  '/projects': ProjectsPage,
  '/faq': FAQPage,
};

function getCurrentPath() {
  const hashPath = window.location.hash.replace(/^#/, '');
  return routes[hashPath] ? hashPath : '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(getCurrentPath());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const Page = useMemo(() => routes[currentPath] ?? HomePage, [currentPath]);

  return (
    <>
      <Header currentPath={currentPath} />
      <main className="page-router" key={currentPath}>
        <Page />
      </main>
      <Footer />
    </>
  );
}
