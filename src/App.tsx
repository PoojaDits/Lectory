import { useInitialize } from "@/hooks/useInitialize";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Sections
import HeroSlider from "@/components/sections/HeroSlider";
import PromoBanner from "@/components/sections/PromoBanner";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import Bestsellers from "@/components/sections/Bestsellers";
import NewArrivals from "@/components/sections/NewArrivals";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

export default function App() {
  useInitialize();

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main>
        <HeroSlider />
        <PromoBanner />
        <FeaturedCategories />
        <Bestsellers />
        <NewArrivals />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
