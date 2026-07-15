import { ChevronLeft, Home } from 'lucide-react';
import { buildBreadcrumbs } from '../utils/breadcrumb.js';
import { useSiteContent } from '../hooks/useSiteContent.js';

export function Breadcrumbs({ currentPath = '/' }) {
    const content = useSiteContent();
    const crumbs = buildBreadcrumbs(currentPath, content);
    const isHomeOnly = crumbs.length === 1;

    return (
        <nav className={`site-breadcrumb${isHomeOnly ? ' site-breadcrumb--home' : ''}`} aria-label="مسیر صفحه">
            <div className="container site-breadcrumb__inner">
                <ol className="site-breadcrumb__list">
                    {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1;
                        const isFirst = index === 0;

                        return (
                            <li key={`${crumb.href}-${crumb.label}`}>
                                {isLast ? (
                                    <span className="site-breadcrumb__current" aria-current="page">
                                        {isFirst ? <Home size={15} aria-hidden /> : null}
                                        <span>{crumb.label}</span>
                                    </span>
                                ) : (
                                    <a className="site-breadcrumb__link" href={crumb.href}>
                                        {isFirst ? <Home size={15} aria-hidden /> : null}
                                        <span>{crumb.label}</span>
                                    </a>
                                )}
                                {!isLast ? (
                                    <ChevronLeft className="site-breadcrumb__sep" size={15} aria-hidden />
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
