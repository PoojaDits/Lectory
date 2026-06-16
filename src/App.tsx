import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// Layout
import Navbar from "@/components/layout/Navbar";
import ImpersonationBanner from "@/components/layout/ImpersonationBanner";
import Footer from "@/components/layout/Footer";

// Auth
import RegistrationPage from "@/components/auth/RegistrationPage";
import LoginPage from "@/components/auth/LoginPage";

// Dashboards / pages
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import CustomerAccount from "@/components/dashboard/CustomerAccount";
import BrowseBooksPage from "@/components/pages/BrowseBooksPage";
import BookDetailsPage from "@/components/pages/BookDetailsPage";
import CartPage from "@/components/pages/CartPage";

// Admin portal
import AdminShell from "@/components/admin/AdminShell";
import AdminOverview from "@/components/admin/AdminOverview";
import SellerApprovalPage from "@/components/admin/SellerApprovalPage";
import BookApprovalPage from "@/components/admin/BookApprovalPage";
import CatalogManagementPage from "@/components/admin/CatalogManagementPage";
import CustomerManagementPage from "@/components/admin/CustomerManagementPage";
import OrderManagementPage from "@/components/admin/OrderManagementPage";

// Routing
import ProtectedRoute from "@/components/routing/ProtectedRoute";

// Store
import { useAuthStore } from "@/stores/useAuthStore";

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
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Clear the impersonation-transition flag once the navigation that
  // the impersonation action triggered has actually landed. The flag
  // is set by impersonate()/stopImpersonating() and read by
  // ProtectedRoute to suppress its "permission denied" toast across
  // every intermediate render until the URL change commits.
  useEffect(() => {
    if (useAuthStore.getState().isRoleTransitioning) {
      useAuthStore.getState().endRoleTransition();
    }
  }, [location.pathname]);

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />
      <ImpersonationBanner />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseBooksPage onNavigateHome={goHome} />} />

        {/* Book details with seller picker (public) */}
        <Route
          path="/books/:id"
          element={<BookDetailsPage onNavigateHome={goHome} />}
        />

        {/* Cart (customer only) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute allow={["customer"]}>
              <CartPage onNavigateHome={goHome} />
            </ProtectedRoute>
          }
        />

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

        {/* Admin area — multi-page portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminShell onNavigateHome={goHome} onLogin={goLogin} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="sellers" element={<SellerApprovalPage />} />
          <Route path="books" element={<BookApprovalPage />} />
          <Route path="catalog" element={<CatalogManagementPage />} />
          <Route path="customers" element={<CustomerManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
