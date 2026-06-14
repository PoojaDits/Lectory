import { useEffect, useState } from "react";
import { useInitialize } from "@/hooks/useInitialize";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Registration
import RegistrationPage from "@/components/auth/RegistrationPage";

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

type AppView = "home" | "registration";

const getHashValue = () => window.location.hash.replace(/^#/, "");

const getViewFromHash = (): AppView => {
  const hash = getHashValue();
  return hash.startsWith("register") ? "registration" : "home";
};

function HomePage() {
  useInitialize();

  return (
    <>
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
    </>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>(getViewFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setView(getViewFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (view !== "home") {
      return;
    }

    const sectionId = getHashValue();
    if (!sectionId) {
      window.scrollTo({ top: 0 });
      return;
    }

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [view]);

  const navigateHome = () => {
    window.location.hash = "";
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      {view === "home" && <HomePage />}
      {view === "registration" && <RegistrationPage onNavigateHome={navigateHome} />}
    </div>
  );
}
