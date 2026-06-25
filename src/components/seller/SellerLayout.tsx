import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";
import ImpersonationBanner from "@/components/layout/ImpersonationBanner";
import { useSellerOrders } from "@/hooks/useCustomer";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Optional badge count surfaced in the sidebar (e.g. pending orders). */
  badge?: number;
}

interface SellerLayoutProps {
  /** Called when the user clicks "Back to store" from the top bar. */
  onNavigateHome: () => void;
  /** Called when the user logs out. */
  onLogin: () => void;
}

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors";

/**
 * Seller Portal layout — a persistent sidebar with the seller's
 * administrative navigation (Dashboard, Orders, Listings, Submit Book, Settings)
 * plus a top bar with the seller identity and a "Back to store" affordance.
 */
export default function SellerLayout({
  onNavigateHome,
  onLogin,
}: SellerLayoutProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);

  const { data: sellerOrders = [] } = useSellerOrders(currentUser?.id);
  const pendingOrderCount = sellerOrders.filter(
    (o) => o.status === "Created" || o.status === "Accepted"
  ).length;

  const items: NavItem[] = [
    { to: "/seller", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/seller/orders",
      label: "Orders",
      icon: ShoppingBag,
      badge: pendingOrderCount,
    },
    {
      to: "/seller/listings",
      label: "Listings",
      icon: Package,
    },
    {
      to: "/seller/submit-book",
      label: "Submit Book",
      icon: PlusCircle,
    },
    {
      to: "/seller/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    notify.info("Signed out of the seller portal.");
    onNavigateHome();
  };

  // ── Guard ──
  if (!currentUser || currentUser.role !== "seller") {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <ShieldCheck className="h-16 w-16 text-amber-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">
            Seller access required
          </h1>
          <p className="mt-2 max-w-md text-secondary-600">
            Please log in with a seller account to manage your listings and
            orders.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="rounded-full bg-primary-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800"
        >
          <LogIn className="mr-2 inline h-4 w-4" />
          Go to Login
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
      <ImpersonationBanner />

      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Sidebar ── */}
        <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm md:block">
          <div className="mb-6 flex items-center gap-3 border-b border-secondary-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-secondary-900">
                {currentUser.businessName ?? currentUser.name}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                Seller
              </p>
            </div>
          </div>

          <nav aria-label="Seller sections" className="flex flex-col gap-1">
            {items.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/seller"}
                className={({ isActive }) =>
                  cn(
                    linkBase,
                    isActive
                      ? "bg-primary-700 text-white shadow-sm"
                      : "text-secondary-700 hover:bg-primary-50 hover:text-primary-700"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                      "bg-primary-100 text-primary-800"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 space-y-2 border-t border-secondary-100 pt-5">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                navigate("/");
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-secondary-200 bg-white px-3 py-2.5 text-sm font-bold text-secondary-700 transition hover:bg-secondary-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
            </button>
            {!isImpersonating && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </aside>

        {/* ── Mobile top bar ── */}
        <div className="fixed inset-x-0 top-[60px] z-40 flex items-center justify-between border-b border-secondary-200 bg-white/95 px-4 py-2 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary-700" />
            <span className="text-sm font-extrabold text-secondary-900">
              Seller Portal
            </span>
          </div>
         
        </div>

        {/* ── Mobile sub-navigation ── */}
        <div className="fixed inset-x-0 top-[100px] z-40 flex overflow-x-auto border-b border-secondary-200 bg-white/95 px-4 py-2 backdrop-blur scrollbar-hide md:hidden gap-2">
          {items.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/seller"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary-700 text-white shadow-sm"
                    : "text-secondary-700 bg-secondary-100 hover:bg-primary-50 hover:text-primary-700"
                )
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[9px] font-extrabold text-primary-800">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* ── Page content ── */}
        <main className="min-w-0 flex-1 pt-[50px] md:pt-0 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
