import { useState } from "react";
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
import { notify } from "@/lib/toast";

const NAV_LINKS: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Browse Books", to: "/browse" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-amber-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 p-2 shadow-lg shadow-amber-200 transition-shadow group-hover:shadow-amber-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-amber-900">
                My Book Store
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-amber-600">
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
                className="font-medium text-gray-600 transition-colors hover:text-amber-800"
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
                  className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
                >
                  <UserPlus className="h-4 w-4" />
                  {currentUser.name ?? "My Account"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-50"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
                >
                  <UserPlus className="h-4 w-4" />
                  Registration
                </Link>
              </>
            )}

            {currentUser?.role === "customer" && (
              <Link
                to="/account"
                className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-800"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-amber-50 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="animate-fade-in mt-2 space-y-3 border-t border-amber-100 pb-4 pt-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMobileMenu}
                className="block py-2 text-gray-600 hover:text-amber-800"
              >
                {link.label}
              </Link>
            ))}

            <div className="space-y-3 border-t border-amber-100 pt-3">
              {currentUser ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-900 px-4 py-3 text-center font-bold text-white"
                  >
                    <UserPlus className="h-4 w-4" />
                    {currentUser.name ?? "My Account"}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-center font-bold text-amber-900"
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
                    className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-center font-bold text-amber-900"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-900 px-4 py-3 text-center font-bold text-white"
                  >
                    <UserPlus className="h-4 w-4" />
                    Registration
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
