import { useState } from "react";
import { BookOpen, ShoppingCart, Search, Menu, X, User } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "Preorder", href: "#preorder" },
  { label: "Categories", href: "#categories" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "Recommended", href: "#recommended" },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Manga", href: "#manga" },
  { label: "AI Books", href: "#ai-books" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-2 shadow-lg shadow-amber-200 group-hover:shadow-amber-300 transition-shadow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-amber-900 tracking-tight">
                My Book Store
              </span>
              <span className="text-[10px] font-medium text-amber-600 tracking-widest uppercase">
                Read • Explore • Discover
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={
                  l.active
                    ? "text-amber-900 font-semibold border-b-2 border-amber-600 pb-0.5"
                    : "text-gray-600 hover:text-amber-800 transition-colors font-medium"
                }
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {[Search, User].map((Icon, i) => (
              <button
                key={i}
                className="p-2.5 rounded-full text-gray-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
            <button className="relative p-2.5 rounded-full text-gray-600 hover:text-amber-800 hover:bg-amber-50 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-amber-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-amber-100 mt-2 pt-4 space-y-3 animate-fade-in">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 ${
                  l.active
                    ? "text-amber-900 font-semibold"
                    : "text-gray-600 hover:text-amber-800"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
