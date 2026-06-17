import { useState } from 'react';
import HeroSlider from '@/components/sections/HeroSlider';
import PromoBanner from '@/components/sections/PromoBanner';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import PreOrder from '@/components/sections/PreOrder';
import BestSellers from '@/components/sections/BestSellers';
import Recommended from '@/components/sections/Recommended';
import NewArrivals from '@/components/sections/NewArrivals';
import Manga from '@/components/sections/Manga';
import ArtificialIntelligence from '@/components/sections/ArtificialIntelligence';
import Newsletter from '@/components/sections/Newsletter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

const SECTIONS = [
  { id: 'preorder', component: PreOrder },
  { id: 'bestsellers', component: BestSellers },
  { id: 'recommended', component: Recommended },
  { id: 'manga', component: Manga },
  { id: 'ai', component: ArtificialIntelligence },
  { id: 'newarrivals', component: NewArrivals },
  { id: 'newsletter', component: Newsletter },
];

export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(2); // Show first 2 sections from list initially
  
  const hasMore = visibleCount < SECTIONS.length;

  const sentinelRef = useInfiniteScroll({
    hasMore,
    onLoadMore: () => setVisibleCount((prev) => prev + 1),
    rootMargin: '400px', // Start loading the next section 400px before reaching the end
  });

  return (
    <>
      <HeroSlider />
      <PromoBanner />
      <FeaturedCategories />
      
      {/* Infinite Loaded Sections */}
      {SECTIONS.slice(0, visibleCount).map((item) => {
        const SectionComponent = item.component;
        return <SectionComponent key={item.id} />;
      })}

      {/* Sentinel element for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="py-20 flex justify-center items-center bg-amber-50/30">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            <p className="text-sm font-medium text-amber-800/60">Loading more amazing books...</p>
          </div>
        </div>
      )}
    </>
  );
}
