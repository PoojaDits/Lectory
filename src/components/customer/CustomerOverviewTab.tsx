import { Link } from "react-router-dom";
import {
  BookOpen,
  MapPin,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Customer, Order } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOverviewTabProps {
  customer: Customer;
  orders: Order[];
  cartCount: number;
}

export default function CustomerOverviewTab({
  customer,
  orders,
  cartCount,
}: CustomerOverviewTabProps) {
  const defaultAddress = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 p-8 text-white shadow-xl shadow-amber-950/10 sm:p-12">
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border-4 border-white/20 bg-amber-700 shadow-inner sm:h-24 sm:w-24">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.firstName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-black text-amber-100 sm:text-4xl">
                  {customer.firstName?.[0] || "C"}
                </div>
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-950/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-200 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Premium Customer
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                Welcome back, {customer.firstName}!
              </h1>
              <p className="mt-1 max-w-xl text-sm text-amber-100/80 sm:text-base">
                Explore the latest book marketplace additions, track your active deliveries, and manage your saved addresses.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-amber-950 shadow-lg shadow-white/10 transition hover:bg-amber-100 hover:scale-105"
            >
              <BookOpen className="h-4 w-4 text-amber-800" />
              Browse Store
            </Link>
          </div>
        </div>
      </section>

      {/* Stat Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          title="Total Orders"
          value={orders.length}
          subtitle={orders.length > 0 ? "View your order history" : "No orders yet"}
          linkTo="orders"
          tone="emerald"
        />
        <StatCard
          icon={ShoppingCart}
          title="Cart Items"
          value={cartCount}
          subtitle={cartCount > 0 ? "Ready for checkout" : "Your cart is empty"}
          linkTo="/cart"
          tone="amber"
          isExternal
        />
        <StatCard
          icon={MapPin}
          title="Saved Addresses"
          value={customer.addresses?.length || 0}
          subtitle={defaultAddress ? `Default: ${defaultAddress.label}` : "Add a delivery address"}
          linkTo="addresses"
          tone="indigo"
        />
        <StatCard
          icon={Clock}
          title="Member Since"
          value={formatDate(customer.createdAt).split(",")[0]}
          subtitle="Lectory Book Club"
          linkTo="settings"
          tone="slate"
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Recent Orders Preview */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your most recent purchases on Lectory</p>
            </div>
            {orders.length > 0 && (
              <Link
                to="orders"
                className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 hover:text-amber-700 transition"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-200 mb-3" />
              <p className="font-extrabold text-slate-700">No recent orders</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">When you place an order, its tracking status will appear here.</p>
              <Link
                to="/browse"
                className="mt-5 rounded-full bg-amber-900 px-6 py-2.5 text-xs font-black text-white hover:bg-amber-800 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 mt-4 space-y-4">
              {recentOrders.map((o) => (
                <li key={String(o.id)} className="pt-4 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 p-4 rounded-2xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">Order #{String(o.id)}</span>
                        <StatusBadge status={o.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {formatDate(o.createdAt)} · <span className="font-bold text-slate-800">{o.items?.length || 1} items</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-base font-black text-emerald-700">
                        {formatCurrency(o.total)}
                      </span>
                      <Link
                        to={`orders`}
                        className="rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition shadow-sm"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick Address Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-black text-slate-900">Default Address</h3>
              <Link
                to="addresses"
                className="text-xs font-bold text-amber-900 hover:text-amber-700 transition"
              >
                Manage
              </Link>
            </div>

            {defaultAddress ? (
              <div className="rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-4 border border-amber-200/50 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-amber-900/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                    Default
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-900 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-black text-sm text-slate-900">{defaultAddress.fullName}</p>
                    <p className="font-semibold text-amber-900">{defaultAddress.label}</p>
                    <p className="break-words leading-relaxed">{defaultAddress.street}</p>
                    <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</p>
                    <p>{defaultAddress.country}</p>
                    <p className="pt-1 font-semibold text-slate-800">📞 {defaultAddress.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <MapPin className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No default address set</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Add a delivery address to make quick 1-click checkouts easier.
                </p>
                <Link
                  to="addresses"
                  className="mt-4 inline-block rounded-full bg-amber-900 px-5 py-2 text-xs font-bold text-white hover:bg-amber-800 transition"
                >
                  Add Address
                </Link>
              </div>
            )}
          </div>

          {/* Customer Support Banner */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-xl sm:p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-200 backdrop-blur-md">
                24/7 Concierge
              </span>
              <h4 className="text-lg font-black tracking-tight sm:text-xl">
                Need help with your order?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our marketplace team and seller network are always available to resolve any shipping or book condition queries.
              </p>
              <button
                type="button"
                onClick={() => alert("Our support agents can be reached at support@lectory.com or via phone at 1-800-LECTORY. We reply within 2 hours!")}
                className="mt-2 rounded-full bg-white px-5 py-2.5 text-xs font-black text-slate-900 hover:bg-amber-100 transition shadow-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  linkTo,
  tone,
  isExternal,
}: {
  icon: typeof Package;
  title: string;
  value: string | number;
  subtitle: string;
  linkTo: string;
  tone: "emerald" | "amber" | "indigo" | "slate";
  isExternal?: boolean;
}) {
  const tones = {
    emerald: "from-emerald-500 to-teal-600 text-white",
    amber: "from-amber-500 to-orange-600 text-white",
    indigo: "from-indigo-500 to-blue-600 text-white",
    slate: "from-slate-800 to-slate-900 text-white",
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <Link to={linkTo} className="block group">{children}</Link>
    ) : (
      <Link to={linkTo} className="block group">{children}</Link>
    );

  return (
    <CardWrapper>
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl group-hover:border-slate-200">
        <div className="flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[tone]} shadow-md`}>
            <Icon className="h-6 w-6" />
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-amber-900 group-hover:translate-x-0.5 transition" />
        </div>
        <p className="mt-4 text-2xl font-black text-slate-900">{value}</p>
        <h3 className="text-sm font-extrabold text-slate-800 mt-0.5">{title}</h3>
        <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>
    </CardWrapper>
  );
}
