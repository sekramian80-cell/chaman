import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { navItems } from '../data/content.js';

export function Header({ currentPath = '/' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <span className="site-header__sheen" aria-hidden="true" />
      <a className="brand" href="#/" aria-label="فراز چمن" onClick={closeMenu}>
        <span className="brand__mark">ف</span>
        <span>
          <strong>فراز چمن</strong>
          <small>طراحی و اجرای چمن مصنوعی</small>
        </span>
      </a>

      <nav className={`main-nav ${isMenuOpen ? 'main-nav--open' : ''}`} aria-label="منوی اصلی">
        {navItems.map((item) => (
          <a
            className={currentPath === item.path ? 'main-nav__link--active' : ''}
            key={item.href}
            href={item.href}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a className="icon-link" href="tel:+989120000000" aria-label="تماس تلفنی">
          <Phone size={19} />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
