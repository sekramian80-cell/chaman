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
        title: 'روف گاردن خانوادگی',
        meta: '۱۲۰ متر مربع | تهران',
        description: 'چمن پرمیوم با مسیر سنگی، زهکشی تقویت شده و لبه‌کاری مخفی.',
        image: rooftopGardenImage,
        imageAlt: 'روف گاردن با چمن مصنوعی',
        primaryCategory: 'decorative',
        subcategory: 'rooftop',
        subcategoryLabel: 'پشت بام',
    },
    {
        id: 2,
        title: 'حیاط ویلایی',
        meta: '۲۴۰ متر مربع | کردان',
        description: 'ترکیب چمن چندبافت با فضای نشیمن و مسیر رفت‌وآمد پرتردد.',
        image: villaYardImage,
        imageAlt: 'حیاط ویلایی با چمن مصنوعی',
        primaryCategory: 'decorative',
        subcategory: 'villa',
        subcategoryLabel: 'ویلا',
    },
    {
        id: 3,
        title: 'زمین فوتبال آموزشی',
        meta: '۷۰۰ متر مربع | کرج',
        description: 'اجرای استاندارد ورزشی با زیرسازی دقیق و خطوط‌کشی تمیز.',
        image: sportsFieldImage,
        imageAlt: 'زمین فوتبال با چمن مصنوعی',
        primaryCategory: 'sports',
        subcategory: 'football',
        subcategoryLabel: 'فوتبال',
    },
    {
        id: 4,
        title: 'تراس و بالکن مدرن',
        meta: '۴۵ متر مربع | تهران',
        description: 'نصب تمیز برای فضای کوچک با ظاهر طبیعی و نگهداری آسان.',
        image: residentialBalconyImage,
        imageAlt: 'تراس با چمن مصنوعی',
        primaryCategory: 'decorative',
        subcategory: 'terrace-balcony',
        subcategoryLabel: 'تراس و بالکن',
    },
    {
        id: 5,
        title: 'محوطه سبز ویلا',
        meta: '۳۱۰ متر مربع | شهریار',
        description: 'ترکیب چمن و مسیر پیاده‌روی با جزئیات دقیق و زهکشی سریع.',
        image: heroArtificialGrass,
        imageAlt: 'محوطه سبز ویلا',
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
