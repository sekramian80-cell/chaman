import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import logoUrl from "../assets/logo-faraz-mark.png";
import { isNavItemActive, isNavLinkActive } from "../content/navigation.js";
import { useSiteContent } from "../hooks/useSiteContent.js";

function NavItem({ item, currentPath, closeMenu }) {
    const hasChildren = item.children?.length > 0;
    const isActive = isNavItemActive(item, currentPath);
    const [isOpen, setIsOpen] = useState(isActive);

    useEffect(() => {
        if (isActive) setIsOpen(true);
    }, [isActive, currentPath]);

    if (!hasChildren) {
        return (
            <a
                className={isNavLinkActive(item.path, currentPath) ? "main-nav__link--active" : ""}
                href={item.href}
                onClick={closeMenu}
            >
                {item.label}
            </a>
        );
    }

    return (
        <div className={`main-nav__group ${isOpen ? "main-nav__group--open" : ""}`}>
            <div className="main-nav__parent">
                <a
                    className={isActive ? "main-nav__link--active" : ""}
                    href={item.href}
                    onClick={closeMenu}
                >
                    {item.label}
                </a>
                <button
                    className="main-nav__toggle"
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "بستن" : "باز کردن"} زیرمنوی ${item.label}`}
                    onClick={() => setIsOpen((open) => !open)}
                >
                    <ChevronDown size={18} />
                </button>
            </div>
            <div className="main-nav__submenu">
                {item.children.map((child) => (
                    <a
                        className={isNavLinkActive(child.path, currentPath) ? "main-nav__link--active" : ""}
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                    >
                        {child.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

export function Header({ currentPath = "/" }) {
    const { navigation } = useSiteContent();
    const menuItems = navigation?.items?.length ? navigation.items : [];
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 26);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") closeMenu();
        };

        document.body.classList.add("nav-lock");
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.classList.remove("nav-lock");
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isMenuOpen]);

    useEffect(() => {
        closeMenu();
    }, [currentPath]);

    return (
        <>
            <div className={`top-scroll-fade ${hasScrolled ? "top-scroll-fade--visible" : ""}`} aria-hidden="true" />
            <header className={`site-header site-header--premium ${hasScrolled ? "site-header--scrolled" : ""}`}>
                <span className="site-header__sheen" aria-hidden="true" />
                <a className="brand" href="/" aria-label="فراز چمن" onClick={closeMenu}>
                    <span className="brand__mark" aria-hidden="true">
                        <img className="brand__logo" src={logoUrl} alt="" decoding="async" fetchPriority="high" />
                    </span>
                    <span>
                        <strong>فراز چمن</strong>
                        <small>طراحی و اجرای چمن مصنوعی</small>
                    </span>
                </a>

                <nav className={`main-nav ${isMenuOpen ? "main-nav--open" : ""}`} aria-label="منوی اصلی">
                    {menuItems.map((item) => (
                        <NavItem closeMenu={closeMenu} currentPath={currentPath} item={item} key={item.id ?? item.href} />
                    ))}
                </nav>

                <div className="header-actions">
                    <a className="icon-link header-cta" href="tel:+989123365430" aria-label="تماس تلفنی">
                        <Phone size={19} />
                        <span>تماس سریع</span>
                    </a>
                    <button
                        className="menu-toggle"
                        type="button"
                        aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((current) => !current)}
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>
            {isMenuOpen ? (
                <button
                    type="button"
                    className="nav-backdrop"
                    aria-label="بستن منو"
                    onClick={closeMenu}
                />
            ) : null}
        </>
    );
}
