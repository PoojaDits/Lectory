import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  UserCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useCustomerProfile,
  useCustomerOrders,
  useUpdateCustomerProfile,
} from "@/hooks/useCustomer";

// Sub-tabs
import CustomerOverviewTab from "@/components/customer/CustomerOverviewTab";
import CustomerAddressesTab from "@/components/customer/CustomerAddressesTab";
import CustomerSettingsTab from "@/components/customer/CustomerSettingsTab";
import CustomerOrdersTab from "../customer/CustomerOrdersTab";

interface CustomerAccountProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

export default function CustomerAccount({
  onNavigateHome,
  onLogin,
}: CustomerAccountProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const location = useLocation();

  // Fresh backend queries
  const { data: customerProfile, isLoading: isCustomerLoading } = useCustomerProfile(
    currentUser?.id
  );
  const { data: customerOrders = [], isLoading: isOrdersLoading } = useCustomerOrders(
    currentUser?.id
  );
  const updateProfile = useUpdateCustomerProfile();

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  // ── Guard ──
  if (!currentUser || currentUser.role !== "customer") {
    return (
      <main className="min-h-screen bg-primary-50 px-4 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-primary-100">
          <UserCircle className="mx-auto h-14 w-14 text-primary-700" />
          <h1 className="mt-4 text-3xl font-black text-secondary-900">
            Customer login required
          </h1>
          <p className="mt-2 text-slate-500">
            Please log in as a customer to view your account dashboard.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 rounded-full bg-primary-900 px-6 py-3 font-bold text-white hover:bg-primary-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  // Determine active nav
  const subPath = location.pathname.replace("/account", "").replace(/^\//, "") || "";

  const TABS = [
    { id: "", label: "Overview", icon: LayoutDashboard, exact: true },
    { id: "orders", label: "My Orders", icon: Package, badge: customerOrders.length },
    { id: "addresses", label: "My Addresses", icon: MapPin, badge: customerProfile?.addresses?.length },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50/70 via-white to-orange-50/60 px-4 pb-20 pt-[120px]">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white px-5 py-2.5 text-sm font-black text-primary-900 shadow-sm transition hover:bg-primary-50/80 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </button>
          {!isImpersonating && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-secondary-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-secondary-800 shadow-md"
            >
              <LogOut className="h-4 w-4 text-amber-400" />
              Logout
            </button>
          )}
        </div>

        {/* Loading state */}
        {(isCustomerLoading || isOrdersLoading) && !customerProfile ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin text-primary-700" />
            <p className="mt-4 font-bold text-secondary-600">Loading your impressive profile dashboard…</p>
          </div>
        ) : !customerProfile ? (
          <div className="rounded-[2.5rem] bg-white p-12 text-center shadow-xl">
            <p className="text-lg font-black text-secondary-900">Failed to load customer details.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-primary-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-800"
            >
              Retry
            </button>
          </div>
        ) : (
          /* Dashboard Main Shell */
          <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Sidebar Navigation */}
            <aside className="space-y-4">
              <nav className="flex flex-row md:flex-col gap-2 rounded-[2.5rem] border border-secondary-200/80 bg-white p-4 shadow-sm overflow-x-auto md:overflow-visible md:sticky md:top-24">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.exact ? subPath === "" : subPath.startsWith(tab.id);

                  return (
                    <Link
                      key={tab.id}
                      to={`/account/${tab.id}`.replace(/\/$/, "")}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-black transition whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-primary-900 to-orange-900 text-white shadow-md shadow-amber-950/10 scale-[1.02]"
                          : "text-secondary-600 hover:bg-primary-50 hover:text-primary-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${isActive ? "text-primary-200" : "text-slate-400"}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge != null && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-secondary-100 text-secondary-600"
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Tab Contents */}
            <section className="min-w-0">
              <Routes>
                <Route
                  index
                  element={
                    <CustomerOverviewTab
                      customer={customerProfile}
                      orders={customerOrders}
                    />
                  }
                />
                <Route
                  path="orders"
                  element={<CustomerOrdersTab orders={customerOrders} />}
                />
                <Route
                  path="addresses"
                  element={
                    <CustomerAddressesTab
                      customer={customerProfile}
                      onUpdateAddresses={(addresses) =>
                        updateProfile.mutate({
                          id: customerProfile.id!,
                          updates: { addresses },
                        })
                      }
                    />
                  }
                />
                <Route
                  path="settings"
                  element={
                    <CustomerSettingsTab
                      customer={customerProfile}
                      onUpdateProfile={async (updates) => {
                        await updateProfile.mutateAsync({
                          id: customerProfile.id!,
                          updates,
                        });
                      }}
                    />
                  }
                />
              </Routes>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
