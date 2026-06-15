import { Routes, Route, useNavigate } from "react-router-dom";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Auth
import RegistrationPage from "@/components/auth/RegistrationPage";
import LoginPage from "@/components/auth/LoginPage";

// Dashboards / pages
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import CustomerAccount from "@/components/dashboard/CustomerAccount";
import BrowseBooksPage from "@/components/pages/BrowseBooksPage";

// Routing
import ProtectedRoute from "@/components/routing/ProtectedRoute";

// Home sections
import HeroSlider from "@/components/sections/HeroSlider";
import PromoBanner from "@/components/sections/PromoBanner";
import PreOrder from "@/components/sections/PreOrder";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import BestSellers from "@/components/sections/BestSellers";
import Recommended from "@/components/sections/Recommended";
import NewArrivals from "@/components/sections/NewArrivals";
import Manga from "@/components/sections/Manga";
import ArtificialIntelligence from "@/components/sections/ArtificialIntelligence";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

function HomePage() {
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
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseBooksPage onNavigateHome={goHome} />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <LoginPage
              onNavigateHome={goHome}
              onNavigateRegister={goRegister}
            />
          }
        />
        <Route
          path="/register"
          element={<RegistrationPage onNavigateHome={goHome} />}
        />

        {/* Customer area */}
        <Route
          path="/account"
          element={
            <ProtectedRoute allow={["customer"]}>
              <CustomerAccount onNavigateHome={goHome} onLogin={goLogin} />
            </ProtectedRoute>
          }
        />

        {/* Seller area */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allow={["seller"]}>
              <SellerDashboard onNavigateHome={goHome} onLogin={goLogin} />
            </ProtectedRoute>
          }
        />

        {/* Admin area */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard onNavigateHome={goHome} onLogin={goLogin} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
