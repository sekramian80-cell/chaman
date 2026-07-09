# فراز چمن — Artificial Grass Landing Page

## Project Overview

**فراز چمن (Faraz Chaman)** is a Persian-language, single-page application (SPA) landing page for an artificial grass (چمن مصنوعی) design, sales, and installation business. The site showcases services, products, process, projects, and FAQs in a modern, visually rich, dark-themed interface with RTL (right-to-left) layout.

### Key Technologies

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks-based state management |
| **Vite 7** | Lightning-fast build tool and dev server |
| **lucide-react** | Open-source icon library (used throughout for UI icons) |
| **samim-font** | Persian (Farsi) web font (Samim) for RTL typography |
| **CSS (custom properties + animations)** | Full-featured, hand-crafted dark theme with CSS variables, gradients, keyframe animations, and responsive breakpoints |

### High-Level Architecture

The application follows a **simple SPA architecture** with hash-based routing:

```
index.html
  └── src/main.jsx          (entry point, React root mount)
       └── src/App.jsx      (app shell: routing, layout)
            ├── components/  (reusable UI components)
            │   ├── Header.jsx        (fixed header with nav)
            │   ├── Hero.jsx          (homepage hero section)
            │   ├── TrustStrip.jsx    (trust badges strip)
            │   ├── Services.jsx      (service cards section)
            │   ├── ProductShowcase.jsx (product display)
            │   ├── Process.jsx       (step-by-step process)
            │   ├── ProjectGallery.jsx (project examples)
            │   ├── FAQ.jsx           (accordion FAQ)
            │   ├── ContactCTA.jsx    (call-to-action section)
            │   ├── Footer.jsx        (site footer)
            │   ├── SectionHeader.jsx (reusable section heading)
            │   └── ScrollReveal.jsx  (intersection observer animation)
            ├── pages/
            │   ├── HomePage.jsx      (home page composition)
            │   ├── ServicesPage.jsx  (services detail page)
            │   ├── ProductsPage.jsx  (products detail page)
            │   ├── ProcessPage.jsx   (process detail page)
            │   ├── ProjectsPage.jsx  (projects detail page)
            │   ├── FAQPage.jsx       (FAQ detail page)
            │   └── PageHero.jsx      (reusable page hero banner)
            ├── data/
            │   └── content.js        (all static content in Persian)
            └── assets/               (hero images for each page)
```

Routing uses `window.location.hash` changes with a `hashchange` event listener — no React Router dependency.

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+ (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd artificial-grass-landing

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite dev server at `http://127.0.0.1:5173` (or next available port). The `--host 127.0.0.1` flag binds to localhost only.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory as static HTML/CSS/JS assets.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Running Tests

> **Note**: No test framework is currently configured in the project. If you add tests (e.g., Vitest, Playwright), run them with:
> ```bash
> npm run test
> ```

---

## Project Structure

### Main Directories

| Directory | Purpose |
|---|---|
| `src/` | All application source code |
| `src/components/` | Reusable React components (header, hero, cards, FAQ, etc.) |
| `src/pages/` | Page-level components that compose sections for each route |
| `src/data/` | Static Persian-language content strings and arrays |
| `src/assets/` | Image assets (PNG hero backgrounds for each page) |
| `dist/` | Production build output |
| `outputs/` | (Empty — potentially for generated assets or reports) |
| `work/` | (Empty — potentially for working files) |

### Key Files

| File | Role |
|---|---|
| `index.html` | HTML shell with RTL `dir="rtl"`, `lang="fa"`, and root `<div id="root">` |
| `vite.config.js` | Vite configuration: React plugin, `@` path alias to `src/`, cache settings |
| `package.json` | Dependencies, scripts (`dev`, `build`, `preview`), project metadata |
| `src/main.jsx` | React entry point — mounts `<App />` in StrictMode |
| `src/App.jsx` | App shell with hash-based routing, header/page/footer layout |
| `src/styles.css` | Complete dark-theme stylesheet (~1200 lines) with CSS custom properties, animations, and responsive design |
| `src/data/content.js` | All Persian text content: nav items, stats, services, products, process steps, projects, FAQs |

### Important Configuration Files

- **`package.json`**: Project metadata, dependencies, npm scripts
- **`vite.config.js`**: Build tool configuration (plugins, aliases, dev server)
- **`.gitignore`**: Currently only ignores `node_modules`

---

## Development Workflow

### Coding Standards & Conventions

1. **File Naming**: PascalCase for React components (`Header.jsx`, `HomePage.jsx`), camelCase for utilities (`content.js`)
2. **Component Structure**: Function components with named exports:
   ```jsx
   export function ComponentName({ props }) { ... }
   ```
3. **Imports**: Absolute `@/` alias maps to `src/` for clean imports:
   ```jsx
   import { Header } from '@/components/Header.jsx';
   ```
4. **Styling**: All styles live in `src/styles.css` using CSS custom properties (no CSS-in-JS or CSS modules). Class naming follows BEM-like conventions (`.site-header`, `.site-header--scrolled`, `.site-header__sheen`).
5. **State Management**: Local state using React hooks (`useState`, `useEffect`, `useMemo`, `useRef`). No external state management library.
6. **Content Separation**: All Persian text is centralized in `src/data/content.js` — components import content rather than hardcoding strings.

### Testing Approach

- No test infrastructure is currently set up.
- Recommended additions: **Vitest** (unit tests), **@testing-library/react** (component tests), **Playwright** (E2E tests).
- When adding tests, place them in `__tests__` directories alongside components or in a top-level `tests/` folder.

### Build & Deployment

1. Run `npm run build` to generate the `dist/` folder
2. Deploy `dist/` to any static hosting:
   - **Netlify**: Connect repo, build command `npm run build`, publish directory `dist`
   - **Vercel**: Auto-detects Vite, build command `npm run build`, output directory `dist`
   - **GitHub Pages**: Add `gh-pages` package and deploy script, or use CI/CD
   - **Traditional hosting**: Upload `dist/` contents via FTP

### Contribution Guidelines

- Create feature branches from `main`
- Keep content changes scoped to `src/data/content.js` when possible
- Test responsive layout at 3 breakpoints: desktop (1020px+), tablet (720-1020px), mobile (<720px)
- Verify RTL layout rendering after any CSS changes
- Run `npm run build` to confirm no build errors

---

## Key Concepts

### Domain-Specific Terminology

| Term (Persian) | English Meaning | Context |
|---|---|---|
| چمن مصنوعی | Artificial grass / synthetic turf | The core product/service |
| روف گاردن | Roof garden | Rooftop greenery installations |
| تراس | Terrace / balcony | Small outdoor spaces |
| ویلا | Villa | Private residential property |
| زیرسازی | Sub-base / ground preparation | The foundation work before turf installation |
| اجرا | Installation / execution | The process of laying the turf |
| زهکشی | Drainage | Water drainage capability |
| الیاف | Fibers | The synthetic grass blades |
| تراکم | Density | Stitches per square meter |
| ارتفاع نخ | Pile height | The height of the grass fibers |
| UV-stable | UV-stable | Resistant to sun fading |
| نگهداری | Maintenance | Care and upkeep |

### Core Abstractions

1. **Page Composition Pattern**: Each page (`HomePage`, `ServicesPage`, etc.) composes reusable section components. This keeps pages readable and components reusable.

2. **ScrollReveal Component**: A wrapper component that uses the Intersection Observer API to trigger CSS entrance animations when elements scroll into view. Styled via `.reveal` / `.reveal--visible` CSS classes.

3. **Hash-Based Router**: A minimal custom router in `App.jsx` that maps hash paths to page components. No external routing library needed.

4. **Static Content Layer**: All text content is centralized in `src/data/content.js` as exportable arrays/objects. This enables easy content editing without touching component logic.

### Design Patterns Used

- **Container/Presentational**: Pages act as containers composing presentational components
- **Compound Components**: Sections like `Services.jsx` use child components (`SectionHeader`, `ScrollReveal`) together
- **Observer Pattern**: `ScrollReveal` uses Intersection Observer for scroll-triggered animations
- **CSS Custom Properties (Theming)**: All colors, gradients, shadows, and radii are defined as CSS variables in `:root` for consistent theming

---

## Common Tasks

### Adding a New Service

1. Open `src/data/content.js` and add an entry to the `services` array:
   ```js
   {
     icon: YourIcon,  // import from 'lucide-react'
     title: 'عنوان جدید',
     description: 'توضیحات سرویس',
   }
   ```
2. The `Services.jsx` component will automatically render the new card.
3. Add an associated page hero image to `src/assets/` if needed.

### Adding a New Page

1. Create the component in `src/pages/` (e.g., `AboutPage.jsx`)
2. Compose it using existing section components and `PageHero`
3. Add a route entry in `src/App.jsx`:
   ```js
   const routes = {
     '/': HomePage,
     '/about': AboutPage,
     // ... existing routes
   };
   ```
4. Add a navigation link in `src/data/content.js` within the `navItems` array

### Changing Content (Text)

Edit `src/data/content.js` — this file drives all visible text. Structure:
- `navItems` — navigation menu labels and paths
- `heroStats` — statistics displayed on hero
- `trustItems` — trust badges below hero
- `services` — service cards
- `productHighlights` — product feature highlights
- `processSteps` — installation process steps
- `projects` — example projects
- `faqs` — FAQ question/answer pairs

### Updating Styles

- All styles live in `src/styles.css`
- CSS custom properties (variables) are defined in `:root { ... }`
- Responsive breakpoints at 1020px, 720px, and 420px
- Key animation classes: `.reveal`, `.reveal--visible`, `.hero__actions`, `.service-card`
- **Important**: The project uses `dir="rtl"` — use `margin-inline`, `padding-inline`, `inset-inline` etc. for logical CSS properties

### Replacing Images

1. Add new images to `src/assets/`
2. Import in the relevant component:
   ```jsx
   import myImage from '../assets/my-image.png';
   ```
3. Pass to the component using it (e.g., `<PageHero image={myImage}>`)

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|---|---|
| **Blank page on dev server** | Ensure you're accessing `http://127.0.0.1:5173` (not `localhost`). The dev server binds to `127.0.0.1`. |
| **Hash routing not working** | The router uses `#/path` format. Direct URL access (e.g., `/services`) won't work — always navigate via hash links. |
| **Persian fonts not displaying** | The `samim-font` package should be installed. Check `node_modules/samim-font/dist/font-face.css` is being imported in `main.jsx`. |
| **Build errors** | Run with the `--configLoader runner` flag as specified in the scripts. Ensure Vite 7 compatibility. |
| **Images not loading in production** | Use relative imports (`import img from '../assets/img.png'`) rather than string paths. Vite handles asset hashing with imports. |
| **RTL layout issues** | Check that the HTML element has `dir="rtl"`. Use logical CSS properties (`margin-inline`, `padding-inline-start`, `inset-inline-end`) instead of directional properties. |

### Debugging Tips

- Use React DevTools to inspect component state and props
- Check the browser console for any import or routing errors
- For scroll animation issues, verify the Intersection Observer is supported (all modern browsers)
- Use `npm run build && npm run preview` to test the production build locally
- The `ScrollReveal` component uses `threshold: 0.18` — adjust if animations trigger too early or late

---

## References

### Documentation

| Resource | Link |
|---|---|
| React 19 Docs | https://react.dev/ |
| Vite 7 Guide | https://vite.dev/guide/ |
| Lucide Icons | https://lucide.dev/icons/ |
| Samim Font | https://github.com/rastikerdar/samim-font |
| Intersection Observer API | https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API |
| CSS Custom Properties | https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties |

### Important Notes

- **StrictMode**: The app wraps `<App />` in `<StrictMode>`, which double-invokes effects in development. This is intentional — don't worry about duplicate console logs in dev.
- **Hash Routing Limitation**: The hash-based router does not support browser back/forward well with all paths. Consider migrating to `react-router-dom` for more complex routing needs.
- **No Backend**: This is a fully static landing page. Contact forms, analytics, or CMS integration would require additional services.

---

> **Note**: This document is based on the current state of the codebase. Sections marked with "Recommended" or "Consider" are suggestions for future improvements. Update this document as the project evolves.
