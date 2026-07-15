/**
 * محتوای بخش پروژه‌های نمونه (fallback محلی)
 */
import { MapPin, Ruler, Sparkles } from 'lucide-react';
import heroArtificialGrass from '../assets/hero-artificial-grass.jpg';
import residentialBalconyImage from '../assets/services/residential-balcony.jpg';
import rooftopGardenImage from '../assets/services/rooftop-garden.jpg';
import sportsFieldImage from '../assets/services/sports-field.jpg';
import villaYardImage from '../assets/services/villa-yard.jpg';

export const projects = [
    {
        id: 1,
        slug: 'rooftop-garden-family',
        href: '/projects/rooftop-garden-family',
        title: 'روف گاردن خانوادگی',
        meta: '۱۲۰ متر مربع · تهران',
        location: 'تهران',
        description: 'چمن پرمیوم با مسیر سنگی، زهکشی تقویت شده و لبه‌کاری مخفی.',
        contentText:
            'در این پروژه روف گاردن، تمرکز روی ایجاد فضای سبز قابل استفاده برای خانواده بود؛ از انتخاب مدل چمن مناسب نور مستقیم تا زهکشی لایه‌ای و مسیرهای سنگی هماهنگ با مبلمان فضای باز. نتیجه، سطحی یکدست، نرم و مقاوم در برابر رفت‌وآمد روزانه است.',
        contentHtml: '',
        image: rooftopGardenImage,
        imageAlt: 'روف گاردن با چمن مصنوعی',
        gallery: [{ url: rooftopGardenImage, alt: 'روف گاردن با چمن مصنوعی' }],
        primaryCategory: 'decorative',
        subcategory: 'rooftop',
        subcategoryLabel: 'پشت بام',
    },
    {
        id: 2,
        slug: 'villa-yard-kordan',
        href: '/projects/villa-yard-kordan',
        title: 'حیاط ویلایی',
        meta: '۲۴۰ متر مربع · کردان',
        location: 'کردان',
        description: 'ترکیب چمن چندبافت با فضای نشیمن و مسیر رفت‌وآمد پرتردد.',
        contentText:
            'حیاط ویلا با ترکیب بافت‌های مختلف چمن، فضای نشیمن و مسیر پیاده‌روی طراحی شد. زیرسازی دقیق، ثبات سطح در برابر رطوبت و ظاهر طبیعی پس از نصب، از اصلی‌ترین نکات این اجرا بوده است.',
        contentHtml: '',
        image: villaYardImage,
        imageAlt: 'حیاط ویلایی با چمن مصنوعی',
        gallery: [{ url: villaYardImage, alt: 'حیاط ویلایی با چمن مصنوعی' }],
        primaryCategory: 'decorative',
        subcategory: 'villa',
        subcategoryLabel: 'ویلا',
    },
    {
        id: 3,
        slug: 'football-training-field',
        href: '/projects/football-training-field',
        title: 'زمین فوتبال آموزشی',
        meta: '۷۰۰ متر مربع · کرج',
        location: 'کرج',
        description: 'اجرای استاندارد ورزشی با زیرسازی دقیق و خطوط‌کشی تمیز.',
        contentText:
            'زمین فوتبال آموزشی با استانداردهای ورزشی اجرا شد؛ از تراکم الیاف و پرکننده مناسب تا خطوط‌کشی واضح و زهکشی سریع. هدف، سطحی مطمئن برای تمرین مداوم و نگهداری کم‌هزینه بوده است.',
        contentHtml: '',
        image: sportsFieldImage,
        imageAlt: 'زمین فوتبال با چمن مصنوعی',
        gallery: [{ url: sportsFieldImage, alt: 'زمین فوتبال با چمن مصنوعی' }],
        primaryCategory: 'sports',
        subcategory: 'football',
        subcategoryLabel: 'فوتبال',
    },
    {
        id: 4,
        slug: 'modern-terrace-balcony',
        href: '/projects/modern-terrace-balcony',
        title: 'تراس و بالکن مدرن',
        meta: '۴۵ متر مربع · تهران',
        location: 'تهران',
        description: 'نصب تمیز برای فضای کوچک با ظاهر طبیعی و نگهداری آسان.',
        contentText:
            'در فضاهای کوچک مثل بالکن، جزئیات نصب اهمیت بیشتری دارد. این پروژه با برش دقیق، اتصال نامرئی و انتخاب مدل مناسب ضخامت اجرا شد تا فضای محدود، سبز، مرتب و قابل شستشو باشد.',
        contentHtml: '',
        image: residentialBalconyImage,
        imageAlt: 'تراس با چمن مصنوعی',
        gallery: [{ url: residentialBalconyImage, alt: 'تراس با چمن مصنوعی' }],
        primaryCategory: 'decorative',
        subcategory: 'terrace-balcony',
        subcategoryLabel: 'تراس و بالکن',
    },
    {
        id: 5,
        slug: 'green-villa-yard',
        href: '/projects/green-villa-yard',
        title: 'محوطه سبز ویلا',
        meta: '۳۱۰ متر مربع · شهریار',
        location: 'شهریار',
        description: 'ترکیب چمن و مسیر پیاده‌روی با جزئیات دقیق و زهکشی سریع.',
        contentText:
            'محوطه ویلا با ترکیب چمن مصنوعی و مسیر پیاده‌روی، فضایی یکپارچه و همیشه سبز ساخت. تمرکز روی زهکشی سریع، لبه‌کاری تمیز و هماهنگی رنگ با نمای ساختمان بوده است.',
        contentHtml: '',
        image: heroArtificialGrass,
        imageAlt: 'محوطه سبز ویلا',
        gallery: [{ url: heroArtificialGrass, alt: 'محوطه سبز ویلا' }],
        primaryCategory: 'decorative',
        subcategory: 'yard',
        subcategoryLabel: 'حیاط',
    },
];

export const projectStats = [
    { icon: Ruler, value: '۴۵۰ متر', label: 'نمونه متراژ ماهانه' },
    { icon: MapPin, value: 'تهران و کرج', label: 'مناطق پرتکرار اجرا' },
    { icon: Sparkles, value: '۳ سبک', label: 'مسکونی، تجاری، روف' },
];
