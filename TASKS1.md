# TASKS — اتصال فراز چمن به وردپرس (Headless CMS)

این فایل شامل لیست قدم‌به‌قدم تغییرات مورد نیاز برای تبدیل سایت فراز چمن به یک front-end متصل به وردپرس از طریق REST API است.

> **Base URL**: `https://api.farazchaman.ir/wp-json/wp/v2`

---

## ✅ Task 1: ایجاد ساختار سرویس API و مدل‌های داده

**هدف**: ایجاد لایه سرویس مجزا برای ارتباط با API وردپرس به همراه model/interfaceهای مربوطه

### زیرتسک‌ها:
- [ ] ایجاد پوشه `src/services/`
- [ ] ایجاد فایل `src/services/api.js` برای کانفیگ axios/fetch با base URL
- [ ] ایجاد فایل `src/services/wordpress.js` با متدهای:
  - `getPosts()`
  - `getPages()`
  - `getCategories()`
  - `getMedia(id)` 
  - `getMenus()`
- [ ] ایجاد پوشه `src/models/` با فایل‌های type interface برای:
  - `PostModel.js`
  - `PageModel.js`
  - `ServiceModel.js`
  - `ProjectModel.js`
  - `MenuItemModel.js`
- [ ] نصب وابستگی `axios` (یا استفاده از fetch native)
- [ ] ایجاد یک فایل `src/config.js` برای ذخیره base URL و سایر تنظیمات

---

## ✅ Task 2: جداسازی محتوا از کامپوننت‌ها (Content Extraction)

**هدف**: تمام محتوای فارسی که الان در `src/data/content.js` هست رو به فایل‌های مجزا تقسیم کنیم تا:
1. از API قابل دریافت باشن
2. به‌سادگی قابل ویرایش باشن
3. در زمان عدم دسترسی به API، fallback داشته باشن

### زیرتسک‌ها:
- [ ] ایجاد پوشه `src/content/`
- [ ] ایجاد فایل `src/content/navigation.js` → منوی اصلی (برگرفته از API Menus یا fallback)
- [ ] ایجاد فایل `src/content/hero.js` → متن‌های hero صفحه اصلی
- [ ] ایجاد فایل `src/content/services.js` → لیست خدمات
- [ ] ایجاد فایل `src/content/products.js` → هایلایت‌های محصولات
- [ ] ایجاد فایل `src/content/process.js` → مراحل اجرا
- [ ] ایجاد فایل `src/content/projects.js` → پروژه‌های نمونه
- [ ] ایجاد فایل `src/content/faq.js` → سوالات متداول
- [ ] ایجاد فایل `src/content/stats.js` → آمارها
- [ ] ایجاد فایل `src/content/trust.js` → موارد اعتماد (TrustStrip)
- [ ] ایجاد فایل `src/content/testimonial.js` → نظرات مشتریان
- [ ] ایجاد فایل `src/content/contact.js` → اطلاعات تماس و CTA
- [ ] به‌روزرسانی کامپوننت‌ها برای import از فایل‌های مجزا

---

## ✅ Task 3: ایجاد Data Layer (Hooks و Context)

**هدف**: ساختن hooks سفارشی و context برای مدیریت state دیتاهای گرفته شده از API

### زیرتسک‌ها:
- [ ] ایجاد `src/hooks/useWordPress.js` — هوک اصلی دریافت دیتا
- [ ] ایجاد `src/hooks/useMedia.js` — هوک دریافت تصاویر
- [ ] ایجاد `src/hooks/useContent.js` — هوک ترکیبی (اول API بعد fallback)
- [ ] ایجاد `src/context/ContentContext.jsx` — برای مدیریت سراسری دیتا
- [ ] ایجاد `src/context/ContentProvider.jsx` — Provider که دیتا رو در لود اولیه fetch می‌کنه

---

## ✅ Task 4: دریافت تصاویر از API وردپرس

**هدف**: تمام تصاویر hero که الان local هستن، از API وردپرس دریافت بشن

### زیرتسک‌ها:
- [ ] ایجاد `src/services/mediaService.js`
- [ ] تغییر `src/pages/PageHero.jsx` به دریافت تصاویر از API
- [ ] تغییر `src/components/Hero.jsx` به دریافت تصویر از API
- [ ] حذف تصاویر استاتیک از `src/assets/` (و ذخیره در API)
- [ ] اضافه کردن lazy loading برای تصاویر

---

## ✅ Task 5: ریفکتور کامپوننت‌های صفحه

**هدف**: کامپوننت‌ها به جای import مستقیم از فایل‌های content، از API/repository لایه بخونن

### زیرتسک‌ها:
- [ ] ریفکتور `src/pages/HomePage.jsx`
- [ ] ریفکتور `src/pages/ServicesPage.jsx`
- [ ] ریفکتور `src/pages/ProductsPage.jsx`
- [ ] ریفکتور `src/pages/ProcessPage.jsx`
- [ ] ریفکتور `src/pages/ProjectsPage.jsx`
- [ ] ریفکتور `src/pages/FAQPage.jsx`
- [ ] ریفکتور کامپوننت‌های:
  - `Header.jsx`
  - `Footer.jsx`
  - `Hero.jsx`
  - `Services.jsx`
  - `ProductShowcase.jsx`
  - `Process.jsx`
  - `ProjectGallery.jsx`
  - `FAQ.jsx`
  - `ContactCTA.jsx`
  - `TrustStrip.jsx`

---

## ✅ Task 6: مدیریت خطا و حالت‌های Loading/Empty/Error

**هدف**: اضافه کردن UX مناسب برای زمان‌هایی که API در دسترس نیست یا خطا داره

### زیرتسک‌ها:
- [ ] ایجاد `src/components/LoadingSpinner.jsx`
- [ ] ایجاد `src/components/ErrorMessage.jsx`
- [ ] ایجاد `src/components/EmptyState.jsx`
- [ ] پیاده‌سازی fallback mechanism (دیتای محلی در صورت عدم دسترسی به API)
- [ ] اضافه کردن try/catch به تمام درخواست‌های API

---

## ✅ Task 7: بهینه‌سازی و کد نهایی

**هدف**: اطمینان از performance و maintainability

### زیرتسک‌ها:
- [ ] اضافه کردن React.lazy و Suspense برای pages
- [ ] پیاده‌سازی caching با React Query (TanStack Query) — اختیاری
- [ ] cleanup کردن فایل‌های قدیمی (`src/data/content.js`)
- [ ] به‌روزرسانی `CONTINUE.md`
- [ ] تست کامل build

---

## ساختار نهایی پوشه‌ها (پس از اتمام همه Tasks)

```
src/
├── assets/               # فقط فایل‌های استاتیک واقعی (logo, icons)
├── components/           # کامپوننت‌های UI (بدون تغییر)
├── config/               # کانفیگ‌ها
│   └── index.js          # base URL, settings
├── content/              # محتوای فارسی جدا شده (fallback)
│   ├── navigation.js
│   ├── hero.js
│   ├── services.js
│   ├── products.js
│   ├── process.js
│   ├── projects.js
│   ├── faq.js
│   ├── stats.js
│   ├── trust.js
│   ├── testimonial.js
│   └── contact.js
├── context/              # React Context برای مدیریت state
│   ├── ContentContext.jsx
│   └── ContentProvider.jsx
├── hooks/                # Custom hooks
│   ├── useWordPress.js
│   ├── useMedia.js
│   └── useContent.js
├── models/               # Type/Interface models
│   ├── PostModel.js
│   ├── PageModel.js
│   ├── ServiceModel.js
│   └── ...
├── pages/                # صفحات (بدون تغییر)
├── services/             # API service layer
│   ├── api.js            # Axios instance with baseURL
│   ├── wordpress.js      # WordPress API methods
│   └── mediaService.js   # Media/image helpers
├── App.jsx
├── main.jsx
└── styles.css
```

---

## ترتیب پیشنهادی اجرا

1. **Task 1** ← ساخت زیرساخت API
2. **Task 2** ← جداسازی محتوا (بدون تغییر در نحوه مصرف فعلی)
3. **Task 3** ← hooks و context
4. **Task 5** ← ریفکتور کامپوننت‌ها برای استفاده از data layer جدید
5. **Task 4** ← اتصال تصاویر به API
6. **Task 6** ← مدیریت خطا و حالت‌های مختلف
7. **Task 7** ← بهینه‌سازی نهایی

> **نکته**: API فعلی (https://api.farazchaman.ir/wp-json/wp/v2) دیتای واقعی ندارد. ساختار Tasks طوری طراحی شده که با اضافه شدن دیتا به API، فقط کافیه endpointها مشخص بشن و بقیه زیرساخت آماده است.
