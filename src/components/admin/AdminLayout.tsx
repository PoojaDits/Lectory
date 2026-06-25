import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { notify } from "@/lib/toast";
import ImpersonationBanner from "@/components/layout/ImpersonationBanner";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

interface AdminLayoutProps {
  onNavigateHome: () => void; 
  onLogin: () => void;
  pendingCounts?: { sellers?: number; books?: number };
}

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors";
  
export default function AdminLayout({
  onNavigateHome,
  onLogin,
  pendingCounts,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  const items: NavItem[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/admin/sellers",
      label: "Seller Approval",
      icon: Store,
      badge: pendingCounts?.sellers,
    },
    {
      to: "/admin/books",
      label: "Book Approval",
      icon: BookOpen,
      badge: pendingCounts?.books,
    },
    { to: "/admin/catalog", label: "Catalog", icon: PackageSearch },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  const handleLogout = () => {
    logout();
    notify.info("Signed out of the admin portal.");
    onLogin();
  };

  // Guard
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <ShieldCheck className="h-16 w-16 text-amber-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">
            Admin access required
          </h1>
          <p className="mt-2 max-w-md text-secondary-600">
            Please log in with an admin account to manage the marketplace.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="rounded-full bg-primary-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800"
        >
          Go to Login
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-indigo-50/30">
      <ImpersonationBanner />

      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        {/*idebar*/}
        <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm md:block">
          <div className="mb-6 flex items-center gap-3 border-b border-secondary-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-secondary-900">
                {currentUser.name ?? currentUser.email}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                Admin
              </p>
            </div>
          </div>

          <nav aria-label="Admin sections" className="flex flex-col gap-1">
            {items.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    linkBase,
                    isActive
                      ? "bg-primary-900 text-white shadow-sm"
                      : "text-secondary-700 hover:bg-primary-50 hover:text-primary-900"
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
              ← Back to store
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/*Mobile top bar*/}
        <div className="fixed inset-x-0 top-[60px] z-40 flex items-center justify-between border-b border-secondary-200 bg-white/95 px-4 py-2 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            <span className="text-sm font-extrabold text-secondary-900">
              Admin Portal
            </span>
          </div>
      
        </div>

        {/* Mobile sub-navigation*/}
        <div className="fixed inset-x-0 top-[100px] z-40 flex overflow-x-auto border-b border-secondary-200 bg-white/95 px-4 py-2 backdrop-blur scrollbar-hide md:hidden gap-2">
          {items.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary-900 text-white shadow-sm"
                    : "text-secondary-700 bg-secondary-100 hover:bg-primary-50 hover:text-primary-900"
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

        {/*Page content */}
        <main className="min-w-0 flex-1 pb-16 pt-[50px] md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
