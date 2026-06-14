import { useState } from "react";
import {
  BookOpen,
  LogIn,
  Menu,
  Search,
  ShoppingCart,
  UserPlus,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const NAV_LINKS: { label: string; href: string; active?: boolean }[] = [
  { label: "Home", href: "#" },
  { label: "Browse Books", href: "#browse" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);

  const closeMobileMenu = () => setMobileOpen(false);

  const dashboardHash =
    currentUser?.role === "admin"
      ? "#admin"
      : currentUser?.role === "seller"
        ? "#seller"
        : "#account";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-amber-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#" className="group flex items-center gap-2">
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
          </a>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "border-b-2 border-amber-600 pb-0.5 font-semibold text-amber-900"
                    : "font-medium text-gray-600 transition-colors hover:text-amber-800"
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-full p-2.5 text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-800">
              <Search className="h-5 w-5" />
            </button>

            {currentUser ? (
              <a
                href={dashboardHash}
                className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
              >
                <UserPlus className="h-4 w-4" />
                {currentUser.name ?? "My Account"}
              </a>
            ) : (
              <>
                <a
                  href="#login"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-50"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </a>
                <a
                  href="#register"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
                >
                  <UserPlus className="h-4 w-4" />
                  Registration
                </a>
              </>
            )}

            <button className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-800">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>
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
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className={`block py-2 ${link.active
                    ? "font-semibold text-amber-900"
                    : "text-gray-600 hover:text-amber-800"
                  }`}
              >
                {link.label}
              </a>
            ))}

            <div className="space-y-3 border-t border-amber-100 pt-3">
              {currentUser ? (
                <a
                  href={dashboardHash}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-amber-900 px-4 py-3 text-center font-bold text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  {currentUser.name ?? "My Account"}
                </a>
              ) : (
                <>
                  <a
                    href="#login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-center font-bold text-amber-900"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </a>
                  <a
                    href="#register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-900 px-4 py-3 text-center font-bold text-white"
                  >
                    <UserPlus className="h-4 w-4" />
                    Registration
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
