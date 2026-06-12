
import { useInitialize } from "@/hooks/useInitialize";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Sections
import HeroSlider from "./components/sections/HeroSlider";
import PromoBanner from "./components/sections/PromoBanner";
import PreOrder from "./components/sections/PreOrder";
import FeaturedCategories from "./components/sections/FeaturedCategories";
import BestSellers from "./components/sections/BestSellers";
import Recommended from "./components/sections/Recommended";
import NewArrivals from "./components/sections/NewArrivals";
import Manga from "./components/sections/Manga";
import ArtificialIntelligence from "./components/sections/ArtificialIntelligence";
import Testimonials from "./components/sections/Testimonials";
import Newsletter from "./components/sections/Newsletter";

export default function App() {
  useInitialize();

 
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      <Navbar />
      <main>
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
      </main>
      <Footer />
    </div>
  );
}
