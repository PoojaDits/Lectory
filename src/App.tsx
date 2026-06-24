import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// Layout
import Navbar from "@/components/layout/Navbar";
import ImpersonationBanner from "@/components/layout/ImpersonationBanner";
import Footer from "@/components/layout/Footer";

// Auth
import RegistrationPage from "@/components/auth/RegistrationPage";
import LoginPage from "@/components/auth/LoginPage";

// Seller portal (multi-page)
import SellerLayout from "@/components/seller/SellerLayout";
import SellerDashboardPage from "@/components/seller/SellerDashboardPage";
import SellerOrdersPage from "@/components/seller/SellerOrdersPage";
import SellerListingsPage from "@/components/seller/SellerListingPage";
import SellerSubmitBookPage from "@/components/seller/SellerSubmitBookPage";
import SellerSettingsPage from "@/components/seller/SellerSettingsPage";
import CustomerAccount from "@/components/dashboard/CustomerAccount";
import BrowseBooksPage from "@/components/pages/BrowseBooksPage";
import BookDetailsPage from "@/components/pages/BookDetailsPage";
import StoresPage from "@/components/pages/StorePage";
import StoreDetailsPage from "@/components/pages/StoreDetailsPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";

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

// Brand name used in every document.title
const BRAND = "Lectory";

// Per-route page titles. Falls back to BRAND when no match.
const ROUTE_TITLES: Record<string, string> = {
  "/": BRAND,
  "/browse": "Browse Books",
  "/stores": "Stores",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/login": "Login",
  "/register": "Register",
};

const SELLER_ROUTE_TITLES: Record<string, string> = {
  "/seller": "Seller Dashboard",
  "/seller/orders": "Seller Orders",
  "/seller/listings": "Seller Listings",
  "/seller/submit-book": "Submit Book",
  "/seller/settings": "Seller Settings",
};

const ADMIN_ROUTE_TITLES: Record<string, string> = {
  "/admin": "Admin Overview",
  "/admin/sellers": "Seller Approvals",
  "/admin/books": "Book Approvals",
  "/admin/catalog": "Catalog Management",
  "/admin/customers": "Customer Management",
  "/admin/orders": "Order Management",
};

/**
 * Resolve the page title for a given pathname.
 * - Exact match wins.
 * - Dynamic routes (e.g. /books/:id, /stores/:id) use regex.
 * - /account/* maps to "My Account".
 * - Unknown routes fall back to the brand name.
 */
function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname] !== undefined) return ROUTE_TITLES[pathname];
  if (SELLER_ROUTE_TITLES[pathname] !== undefined) return SELLER_ROUTE_TITLES[pathname];
  if (ADMIN_ROUTE_TITLES[pathname] !== undefined) return ADMIN_ROUTE_TITLES[pathname];

  if (/^\/books\/[^/]+/.test(pathname)) return "Book Details";
  if (/^\/stores\/[^/]+/.test(pathname)) return "Store Details";
  if (/^\/account\/?.*/.test(pathname)) return "My Account";

  return BRAND;
}

/**
 * Format the final document.title:
 * - On home (BRAND only): "Lectory"
 * - On other pages:        "Lectory | Page Name"
 */
function buildTitle(pathname: string): string {
  const page = getPageTitle(pathname);
  return page === BRAND ? BRAND : `${BRAND} | ${page}`;
}

function HomePage() {
  return (
    <>
      <main className="overflow-x-hidden w-full">
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

  // Bug UI-050 fix: keep <title> in sync with the current route.
  useEffect(() => {
    document.title = buildTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (useAuthStore.getState().isRoleTransitioning) {
      useAuthStore.getState().endRoleTransition();
    }
  }, [location.pathname]);

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");

  return (
    <div className="min-h-screen bg-white font-sans text-secondary-900 antialiased">
      <Navbar />
      <ImpersonationBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseBooksPage onNavigateHome={goHome} />} />
        {/* Stores (sellers shown as bookstores) */}
        <Route path="/stores" element={<StoresPage onNavigateHome={goHome} />} />
        <Route
          path="/stores/:id"
          element={<StoreDetailsPage onNavigateHome={goHome} />}
        />
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
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allow={["customer"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        {/* Auth */}
        <Route
          path="/login"
          element={
            <LoginPage
              onNavigateRegister={goRegister}
            />
          }
        />
        <Route
          path="/register"
          element={<RegistrationPage />}
        />
        {/* Customer area */}
        <Route
          path="/account/*"
          element={
            <ProtectedRoute allow={["customer"]}>
              <CustomerAccount onNavigateHome={goHome} onLogin={goLogin} />
            </ProtectedRoute>
          }
        />
        {/* Seller area — multi-page portal */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allow={["seller"]}>
              <SellerLayout onNavigateHome={goHome} onLogin={goLogin} />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerDashboardPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          <Route path="listings" element={<SellerListingsPage />} />
          <Route path="submit-book" element={<SellerSubmitBookPage />} />
          <Route path="settings" element={<SellerSettingsPage />} />
        </Route>
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
