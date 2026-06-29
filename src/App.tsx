import { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// Layout
import Navbar from "@/components/layout/Navbar";
import ImpersonationBanner from "@/components/layout/ImpersonationBanner";
import Footer from "@/components/layout/Footer";

/*
 * UI-06 fix: code-splitting.
 * Everything except the layout chrome and the above-the-fold home sections is
 * lazy-loaded so the initial bundle no longer ships the admin / seller /
 * customer portals to every visitor. Each route now becomes its own chunk.
 */

// Auth
const RegistrationPage = lazy(() => import("@/components/auth/RegistrationPage"));
const VerifyOtpPage = lazy(() => import("@/components/auth/VerifyOtpPage"));
const ForgotPasswordPage = lazy(() => import("@/components/auth/ForgotPasswordPage"));
const LoginPage = lazy(() => import("@/components/auth/LoginPage"));

// Seller portal (multi-page)
const SellerLayout = lazy(() => import("@/components/seller/SellerLayout"));
const SellerDashboardPage = lazy(() => import("@/components/seller/SellerDashboardPage"));
const SellerOrdersPage = lazy(() => import("@/components/seller/SellerOrdersPage"));
const SellerListingsPage = lazy(() => import("@/components/seller/SellerListingPage"));
const SellerSubmitBookPage = lazy(() => import("@/components/seller/SellerSubmitBookPage"));
const SellerSettingsPage = lazy(() => import("@/components/seller/SellerSettingsPage"));
const CustomerAccount = lazy(() => import("@/components/dashboard/CustomerAccount"));
const ChangePasswordTab = lazy(() => import("@/components/dashboard/ChangePasswordTab"));
const BrowseBooksPage = lazy(() => import("@/components/pages/BrowseBooksPage"));
const BookDetailsPage = lazy(() => import("@/components/pages/BookDetailsPage"));
const StoresPage = lazy(() => import("@/components/pages/StorePage"));
const StoreDetailsPage = lazy(() => import("@/components/pages/StoreDetailsPage"));
const CartPage = lazy(() => import("@/components/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/components/pages/CheckoutPage"));

// Admin portal
const AdminShell = lazy(() => import("@/components/admin/AdminShell"));
const AdminOverview = lazy(() => import("@/components/admin/AdminOverview"));
const SellerApprovalPage = lazy(() => import("@/components/admin/SellerApprovalPage"));
const BookApprovalPage = lazy(() => import("@/components/admin/BookApprovalPage"));
const CatalogManagementPage = lazy(() => import("@/components/admin/CatalogManagementPage"));
const CustomerManagementPage = lazy(() => import("@/components/admin/CustomerManagementPage"));
const OrderManagementPage = lazy(() => import("@/components/admin/OrderManagementPage"));

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
  "/verify-otp": "Verify OTP",
  "/forgot-password": "Forgot Password",
};

const SELLER_ROUTE_TITLES: Record<string, string> = {
  "/seller": "Seller Dashboard",
  "/seller/orders": "Seller Orders",
  "/seller/listings": "Seller Listings",
  "/seller/submit-book": "Submit Book",
  "/seller/settings": "Seller Settings",
  "/seller/security": "Change Password",
};

const ADMIN_ROUTE_TITLES: Record<string, string> = {
  "/admin": "Admin Overview",
  "/admin/sellers": "Seller Approvals",
  "/admin/books": "Book Approvals",
  "/admin/catalog": "Catalog Management",
  "/admin/customers": "Customer Management",
  "/admin/orders": "Order Management",
  "/admin/security": "Change Password",
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

/** Lightweight full-page fallback shown while a lazy route chunk loads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-primary-700">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
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
      {/*
        UI-02 fix: single global offset for the fixed navbar.
        The navbar is `h-16` (64px) / `md:h-20` (80px), so the app shell
        reserves the same space here once. Individual pages must NOT add
        their own top padding/margin to clear the navbar anymore.
      */}
      <ImpersonationBanner />
      <div className="pt-16 md:pt-20">
      <Suspense fallback={<RouteFallback />}>
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
        {/* Cart (public and customer) */}
        <Route path="/cart" element={<CartPage />} />
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
        <Route
          path="/verify-otp"
          element={<VerifyOtpPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
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
          <Route path="security" element={<ChangePasswordTab />} />
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
          <Route path="security" element={<ChangePasswordTab />} />
        </Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
      </Suspense>
      </div>
    </div>
  );
}
