/**
 * داده اسلایدر زیردسته‌ها — صفحه اصلی
 */
import heroArtificialGrass from '../assets/hero-artificial-grass.jpg';
import commercialSpaceImage from '../assets/services/commercial-space.jpg';
import residentialBalconyImage from '../assets/services/residential-balcony.jpg';
import rooftopGardenImage from '../assets/services/rooftop-garden.jpg';
import sportsFieldImage from '../assets/services/sports-field.jpg';
import villaYardImage from '../assets/services/villa-yard.jpg';
import { productSubcategories } from './productSubcategories.js';

const subcategoryImages = {
    football: sportsFieldImage,
    club: sportsFieldImage,
    padel: sportsFieldImage,
    golf: sportsFieldImage,
    tennis: sportsFieldImage,
    paintball: sportsFieldImage,
    futsal: sportsFieldImage,
    school: sportsFieldImage,
    hockey: sportsFieldImage,
    restaurant: commercialSpaceImage,
    rooftop: rooftopGardenImage,
    'terrace-balcony': residentialBalconyImage,
    kindergarten: villaYardImage,
    garden: villaYardImage,
    patio: villaYardImage,
    hall: commercialSpaceImage,
    yard: villaYardImage,
    workplace: commercialSpaceImage,
    villa: villaYardImage,
    'tile-grass': heroArtificialGrass,
    'wall-grass': heroArtificialGrass,
    moketi: heroArtificialGrass,
    'grass-fence': heroArtificialGrass,
};

const categoryPaths = {
    sports: '/products/sports',
    decorative: '/products/decorative',
};

function buildSliderItems(parent, items) {
    return items.map((item) => ({
        slug: item.slug,
        label: item.label,
        title: `چمن مصنوعی ${item.label}`,
        href: categoryPaths[parent],
        image: subcategoryImages[item.slug] || heroArtificialGrass,
        parent,
    }));
}

export const subcategorySliderItems = [
    ...buildSliderItems('sports', productSubcategories.sports),
    ...buildSliderItems('decorative', productSubcategories.decorative),
];
