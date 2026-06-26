import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import type { Customer, Order, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOverviewTabProps {
  customer: Customer;
  orders: Order[];
}

const ACTIVE_STATUSES: OrderStatus[] = ["Created", "Accepted", "Shipped"];

function initialsOf(customer: Customer): string {
  const a = customer.firstName?.trim()?.[0] ?? "";
  const b = customer.lastName?.trim()?.[0] ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}

export default function CustomerOverviewTab({
  customer,
  orders,
}: CustomerOverviewTabProps) {
  const initials = initialsOf(customer);
  const defaultAddress =
    customer.addresses?.find((address) => address.isDefault) ??
    customer.addresses?.[0];

  const orderCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      Created: 0,
      Accepted: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] ?? 0) + 1;
    });

    return counts;
  }, [orders]);

  const inTransitCount = orders.filter((order) =>
    ACTIVE_STATUSES.includes(order.status)
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalSpent = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-orange-900 p-6 shadow-lg shadow-primary-900/20 md:p-10">
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black text-white ring-4 ring-white/20 backdrop-blur sm:h-20 sm:w-20 sm:text-3xl">
              {initials}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary-100">
                Customer Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                Welcome back, {customer.firstName}
              </h1>
              <p className="mt-2 max-w-2xl text-primary-50/90">
                Track your book orders, manage delivery addresses, and keep your
                account details up to date from one place.
              </p>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right text-white/90 backdrop-blur sm:block">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary-100">
              Active Orders
            </p>
            <p className="mt-1 text-3xl font-black text-white">{inTransitCount}</p>
            <p className="text-xs text-primary-100/90">Currently being processed</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={Mail} label="Email" value={customer.email} />
        <InfoCard
          icon={MapPin}
          label="Default address"
          value={
            defaultAddress
              ? `${defaultAddress.city}, ${defaultAddress.state}`
              : "Not set"
          }
        />
        <InfoCard
          icon={Calendar}
          label="Member since"
          value={formatDate(customer.createdAt)}
        />
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
          tone="amber"
          hint={`${inTransitCount} in transit`}
        />
        <StatCard
          label="In Transit"
          value={inTransitCount}
          icon={Truck}
          tone="indigo"
          hint="Orders still on the way"
        />
        <StatCard
          label="Delivered"
          value={deliveredCount}
          icon={CheckCircle2}
          tone="emerald"
          hint="Completed purchases"
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={Wallet}
          tone="rose"
          hint="Excluding cancelled orders"
        />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
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
          tone="indigo"
        />
        <PipelineTile
          label="Delivered"
          value={orderCounts.Delivered}
          icon={CheckCircle2}
          tone="emerald"
        />
        <PipelineTile
          label="Cancelled"
          value={orderCounts.Cancelled}
          icon={XCircle}
          tone="rose"
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-secondary-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-secondary-100 p-6">
          <div>
            <h2 className="text-lg font-black text-secondary-900">
              Recent Orders
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Your latest purchases and current fulfillment statuses.
            </p>
          </div>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-xs font-black text-white transition hover:bg-primary-800"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            No orders yet. Browse the marketplace to find your next read.
          </div>
        ) : (
          <div className="divide-y divide-secondary-100">
            {recentOrders.map((order) => (
              <div
                key={String(order.id)}
                className="flex flex-col gap-4 p-5 transition hover:bg-primary-50/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-secondary-900">
                      Order #{String(order.id)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(order.createdAt)} · {order.items?.length ?? 0}{" "}
                      item(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary-700">
                    {formatCurrency(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          to="/account/orders"
          icon={Package}
          title="Track Orders"
          desc="See every purchase, shipment update, and delivered order in one place."
          color="amber"
        />
        <QuickActionCard
          to="/account/addresses"
          icon={MapPin}
          title="Manage Addresses"
          desc="Add delivery locations, update details, and set your default destination."
          color="indigo"
        />
        <QuickActionCard
          to="/account/settings"
          icon={Settings}
          title="Update Profile"
          desc="Keep your contact details and personal information current."
          color="emerald"
        />
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-secondary-200 bg-white p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 text-xs sm:text-sm font-semibold text-secondary-900 truncate" title={value}>{value}</p>
    </div>
  );
}

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
  const tones = {
    slate: "bg-secondary-100 text-secondary-700",
    blue: "bg-primary-50 text-primary-600",
    amber: "bg-primary-100 text-primary-700",
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
  } as const;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm min-w-0 overflow-hidden">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          tones[tone]
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 truncate">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
          {label}
        </p>
        <p className="text-2xl font-extrabold leading-none text-secondary-900 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickActionCard({
  to,
  icon: Icon,
  title,
  desc,
  color,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  title: string;
  desc: string;
  color: "emerald" | "amber" | "indigo" | "rose";
}) {
  const colors = {
    emerald: "from-emerald-600 to-teal-600",
    amber: "from-primary-600 to-orange-600",
    indigo: "from-indigo-600 to-blue-600",
    rose: "from-rose-600 to-pink-600",
  } as const;

  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-secondary-100 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
    >
      <div
        className={cn(
          "absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-10",
          colors[color]
        )}
      />
      <div className="relative z-10">
        <div
          className={cn(
            "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
            colors[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-black text-secondary-900 transition group-hover:text-primary-700">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
      </div>
    </Link>
  );
}
