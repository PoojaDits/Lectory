import { useMemo } from "react";
import {

  BookOpen,
  CheckCircle2,
  DollarSign,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,

  XCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSellerOrders } from "@/hooks/useCustomer";
import { useSellerListings, useApprovedBooks } from "@/hooks/useSeller";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";
import type { OrderStatus } from "@/types";

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);

  const { data: orders = [], isLoading: ordersLoading } = useSellerOrders(
    currentUser?.id
  );
  const { data: listings = [] } = useSellerListings(currentUser?.id);
  const { data: approvedBooks = [] } = useApprovedBooks();

  const orderCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      Created: 0,
      Accepted: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    });
    return counts;
  }, [orders]);

  const revenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const activeListings = listings.filter((l) => l.active && l.stock > 0).length;

  const pendingActionOrders = orders.filter(
    (o) => o.status === "Created" || o.status === "Accepted"
  );

  return (
    <div className="space-y-8 mt-[65px]">
      {/* ── Welcome Header ── */}
      <header className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-orange-900 p-8 md:p-12 relative shadow-lg shadow-primary-900/20">
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest text-primary-100">
            Seller Command Center
          </p>
          <h1 className="mt-2 text-3xl font-black text-white md:text-4xl tracking-tight">
            Welcome, {currentUser?.businessName ?? currentUser?.name ?? "Seller"}
          </h1>
          <p className="mt-2 max-w-2xl text-primary-50/90">
            Monitor your sales, manage your inventory, and process orders from
            your seller dashboard.
          </p>
        </div>
      </header>

      {/* ── Stats Overview ── */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
          tone="amber"
          hint={`${pendingActionOrders.length} pending action`}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          tone="amber"
          hint="From delivered orders"
        />
        <StatCard
          label="Active Listings"
          value={activeListings}
          icon={Package}
          tone="amber"
          hint={`of ${listings.length} total`}
        />
        <StatCard
          label="Approved Books"
          value={approvedBooks.length}
          icon={BookOpen}
          tone="amber"
          hint="In marketplace catalog"
        />
      </section>

      {/* ── Order Pipeline ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <PipelineTile
          label="Created"
          value={orderCounts.Created}
          icon={AlertCircle}
          tone="amber"
        />
        <PipelineTile
          label="Accepted"
          value={orderCounts.Accepted}
          icon={CheckCircle2}
          tone="amber"
        />
        <PipelineTile
          label="Shipped"
          value={orderCounts.Shipped}
          icon={Truck}
          tone="amber"
        />
        <PipelineTile
          label="Delivered"
          value={orderCounts.Delivered}
          icon={CheckCircle2}
          tone="amber"
        />
        <PipelineTile
          label="Cancelled"
          value={orderCounts.Cancelled}
          icon={XCircle}
          tone="rose"
        />
      </section>

      {/* ── Recent Orders ── */}
      <section className="rounded-3xl border border-secondary-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-secondary-100 p-6">
          <div>
            <h2 className="text-lg font-black text-secondary-900">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest customer orders for your listings
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/seller/orders")}
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-xs font-black text-white hover:bg-primary-800 transition shadow-sm"
          >
            View All
            <TrendingUp className="h-3.5 w-3.5" />
          </button>
        </div>

        {ordersLoading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            No orders yet. They will appear here when customers purchase your
            listings.
          </div>
        ) : (
          <div className="divide-y divide-secondary-100">
            {orders.slice(0, 5).map((order) => (
              <div
                key={String(order.id)}
                className="flex items-center justify-between p-5 hover:bg-primary-50/30 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="font-black text-secondary-900 text-sm">
                    #{String(order.id)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary-700">
                    {formatCurrency(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-slate-400">
                    {order.items?.length ?? 0} item(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Quick Actions ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          icon={ShoppingBag}
          title="Manage Orders"
          desc="Accept, ship, and deliver customer orders in real time."
          color="amber"
          onClick={() => navigate("/seller/orders")}
        />
        <QuickActionCard
          icon={Package}
          title="View Listings"
          desc="Manage prices, stock, and visibility for your books."
          color="amber"
          onClick={() => navigate("/seller/listings")}
        />
        <QuickActionCard
          icon={BookOpen}
          title="Submit New Book"
          desc="Add new book titles to the marketplace catalog for approval."
          color="amber"
          onClick={() => navigate("/seller/submit-book")}
        />
      </section>
    </div>
  );
}

// ── Pipeline tile ──────────────────────────────────────

function PipelineTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof ShoppingBag;
  tone: "slate" | "blue" | "amber" | "indigo" | "emerald" | "rose";
}) {
  // Warm amber palette — uses different intensities of amber/orange
  // to distinguish pipeline stages while staying on-theme.
  const tones = {
    slate: "bg-secondary-100 text-secondary-700",
    blue: "bg-primary-50 text-primary-600",
    amber: "bg-primary-100 text-primary-700",
    indigo: "bg-primary-200 text-primary-800",
    emerald: "bg-orange-100 text-orange-800",
    rose: "bg-rose-100 text-rose-800",
  } as const;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          tones[tone]
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-extrabold leading-none text-secondary-900">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Quick Action Card ──────────────────────────────────

function QuickActionCard({
  icon: Icon,
  title,
  desc,
  color,
  onClick,
}: {
  icon: typeof LayoutDashboard;
  title: string;
  desc: string;
  color: "emerald" | "amber" | "indigo" | "rose";
  onClick: () => void;
}) {
  const colors = {
    emerald: "from-primary-700 to-orange-700 border-primary-200 hover:border-amber-300",
    amber: "from-primary-600 to-orange-600 border-primary-200 hover:border-amber-300",
    indigo: "from-primary-600 to-orange-600 border-primary-200 hover:border-amber-300",
    rose: "from-rose-600 to-pink-600 border-rose-200 hover:border-rose-300",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition-all overflow-hidden relative"
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -mr-8 -mt-8 bg-gradient-to-br",
          colors[color].split(" ")[0],
          colors[color].split(" ")[1]
        )}
      />
      <div className="relative z-10">
        <div
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-4 text-white",
            colors[color].split(" ")[0],
            colors[color].split(" ")[1]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-black text-secondary-900 group-hover:text-primary-700 transition">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}

