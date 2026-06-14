import { useEffect, useState } from "react";
import { useInitialize } from "@/hooks/useInitialize";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Auth
import RegistrationPage from "@/components/auth/RegistrationPage";
import LoginPage from "@/components/auth/LoginPage";

// Dashboards
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import CustomerAccount from "@/components/dashboard/CustomerAccount";
import BrowseBooksPage from "@/components/pages/BrowseBooksPage";

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

import type { UserRole } from "@/types";

type AppView =
  | "home"
  | "registration"
  | "login"
  | "admin"
  | "seller"
  | "account"
  | "browse";

const getHashValue = () => window.location.hash.replace(/^#/, "");

const getViewFromHash = (): AppView => {
  const hash = getHashValue();
  if (hash.startsWith("register")) return "registration";
  if (hash.startsWith("login")) return "login";
  if (hash.startsWith("admin")) return "admin";
  if (hash.startsWith("seller")) return "seller";
  if (hash.startsWith("account")) return "account";
  if (hash.startsWith("browse")) return "browse";
  return "home";
};

const setHash = (hash: string) => {
  window.location.hash = hash;
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
    setHash("");
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateLogin = () => setHash("login");
  const navigateRegister = () => setHash("register");

  const handleLoginSuccess = (role: UserRole) => {
    if (role === "admin") setHash("admin");
    else if (role === "seller") setHash("seller");
    else setHash("account");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      {view === "home" && <HomePage />}
      {view === "registration" && (
        <RegistrationPage onNavigateHome={navigateHome} />
      )}
      {view === "login" && (
        <LoginPage
          onNavigateHome={navigateHome}
          onLoginSuccess={handleLoginSuccess}
          onNavigateRegister={navigateRegister}
        />
      )}
      {view === "admin" && (
        <AdminDashboard
          onNavigateHome={navigateHome}
          onLogin={navigateLogin}
        />
      )}
      {view === "seller" && (
        <SellerDashboard
          onNavigateHome={navigateHome}
          onLogin={navigateLogin}
        />
      )}
      {view === "account" && (
        <CustomerAccount
          onNavigateHome={navigateHome}
          onLogin={navigateLogin}
        />
      )}
      {view === "browse" && (
        <BrowseBooksPage onNavigateHome={navigateHome} />
      )}
    </div>
  );
}
