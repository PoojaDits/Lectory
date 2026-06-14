import HeroSlider from '@/components/sections/HeroSlider';
import PromoBanner from '@/components/sections/PromoBanner';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import PreOrder from '@/components/sections/PreOrder';
import BestSellers from '@/components/sections/BestSellers';
import Recommended from '@/components/sections/Recommended';
import NewArrivals from '@/components/sections/NewArrivals';
import Manga from '@/components/sections/Manga';
import ArtificialIntelligence from '@/components/sections/ArtificialIntelligence';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <PromoBanner />
      <FeaturedCategories />
      <PreOrder />
      <BestSellers />
      <Recommended />
      <Manga />
      <ArtificialIntelligence />
      <NewArrivals />
      <Testimonials />
      <Newsletter />
    </>
  );
}
