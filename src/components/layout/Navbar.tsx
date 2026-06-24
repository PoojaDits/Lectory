import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  UserPlus,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCart } from "@/hooks/useCart";
import { notify } from "@/lib/toast";

const NAV_LINKS: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Browse Books", to: "/browse" },
  { label: "Stores", to: "/stores" },
];

// Must match the `duration-200` class on the mobile menu (in ms).
// We use this to keep the element mounted long enough for the
// `animate-out` exit animation to finish before unmounting.
const MOBILE_MENU_ANIM_MS = 200;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // `renderMobileMenu` is the "is in the DOM" flag. We keep it true for
  // MOBILE_MENU_ANIM_MS after closing so the exit animation can play.
  const [renderMobileMenu, setRenderMobileMenu] = useState(false);

  // Bug UI-049 fix (smooth): defer unmount so the exit animation plays.
  useEffect(() => {
    if (mobileOpen) {
      setRenderMobileMenu(true);
      return;
    }
    const timer = window.setTimeout(
      () => setRenderMobileMenu(false),
      MOBILE_MENU_ANIM_MS,
    );
    return () => window.clearTimeout(timer);
  }, [mobileOpen]);

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { count: cartCount } = useCart();

  const closeMobileMenu = () => setMobileOpen(false);

  const dashboardPath =
    currentUser?.role === "admin"
      ? "/admin"
      : currentUser?.role === "seller"
        ? "/seller"
        : "/account";

  const handleLogout = () => {
    logout();
    notify.info("You have been logged out.");
    closeMobileMenu();
    navigate("/");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-primary-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-2 shadow-lg shadow-primary-200 transition-shadow group-hover:shadow-amber-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-primary-900">
                Lectory
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-primary-600">
                Read • Explore • Discover
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-medium text-gray-600 transition-colors hover:text-primary-800"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800"
                >
                  <UserPlus className="h-4 w-4" />
                  {currentUser.name ?? "My Account"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-900 transition hover:bg-primary-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-900 transition hover:bg-primary-50"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </>
            )}
            {currentUser?.role === "customer" && (
              <Link
                to="/cart"
                className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-800"
                aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-900 px-1 text-[10px] font-bold text-white shadow">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-primary-50 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/*
          Mobile Menu — Bug UI-049 fix (smooth).

          - `renderMobileMenu` controls mount/unmount. We keep it `true` for
            MOBILE_MENU_ANIM_MS after close so the exit animation can play
            before React removes the element.
          - On open: `animate-in slide-in-from-top-2 fade-in-0 duration-200 ease-out`
          - On close: `animate-out slide-out-to-top-2 fade-out-0 duration-200 ease-out`

          Both are transform-based (translateY + opacity) so they run on the
          GPU and stay smooth even on low-end mobile devices.
        */}
        {renderMobileMenu && (
          <div
            id="mobile-menu"
            aria-hidden={!mobileOpen}
            className={`md:hidden ${
              mobileOpen
                ? "animate-in slide-in-from-top-2 fade-in-0 duration-200 ease-out"
                : "animate-out slide-out-to-top-2 fade-out-0 duration-200 ease-out"
            }`}
          >
            <div className="mt-2 space-y-3 border-t border-primary-100 pb-4 pt-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="block py-2 text-gray-600 hover:text-primary-800"
                >
                  {link.label}
                </Link>
              ))}
              <div className="space-y-3 border-t border-primary-100 pt-3">
                {currentUser ? (
                  <>
                    <Link
                      to={dashboardPath}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-primary-900 px-4 py-3 text-center font-bold text-white"
                    >
                      <UserPlus className="h-4 w-4" />
                      {currentUser.name ?? "My Account"}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-200 bg-white px-4 py-3 text-center font-bold text-primary-900"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-primary-200 bg-white px-4 py-3 text-center font-bold text-primary-900"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-primary-900 px-4 py-3 text-center font-bold text-white"
                    >
                      <UserPlus className="h-4 w-4" />
                      Registration
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
