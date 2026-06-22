import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import type { Customer, Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOverviewTabProps {
  customer: Customer;
  orders: Order[];
}

/** Orders that are still in-flight — not yet with the customer. */
const ACTIVE_STATUSES: OrderStatus[] = ["Created", "Accepted", "Shipped"];
/** Orders that have reached a terminal state. */
const HISTORY_STATUSES: OrderStatus[] = ["Delivered", "Cancelled"];

/** Fulfillment pipeline shown on the "Yet to Reach" progress tracker. */
const PIPELINE: OrderStatus[] = ["Created", "Accepted", "Shipped", "Delivered"];

/** Up to two leading initials (first + last name) for the avatar. */
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
    customer.addresses?.find((a) => a.isDefault) ?? customer.addresses?.[0];
  const phone = customer.phone ?? defaultAddress?.phone;

  const { active, history } = useMemo(() => {
    const byDate = [...orders].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
    return {
      active: byDate.filter((o) => ACTIVE_STATUSES.includes(o.status)),
      history: byDate.filter((o) => HISTORY_STATUSES.includes(o.status)),
    };
  }, [orders]);

  const deliveredCount = history.filter((o) => o.status === "Delivered").length;
  const totalSpent = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ───────── Profile header ───────── */}
      <section className="overflow-hidden rounded-[2rem] border border-secondary-200/80 bg-white shadow-sm">
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-r from-primary-700 via-orange-700 to-primary-800 sm:h-28" />

        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar: initials badge */}
              <div className="-mt-12 sm:-mt-14">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-orange-700 text-3xl font-black text-white shadow-lg ring-4 ring-white sm:h-28 sm:w-28 sm:text-4xl">
                  {initials}
                </div>
              </div>

              <div className="pb-1">
                <h1 className="text-2xl font-black tracking-tight text-secondary-900 sm:text-3xl">
                  {customer.firstName} {customer.lastName}
                </h1>
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active member
                </span>
              </div>
            </div>

            <Link
              to="/account/settings"
              className="inline-flex items-center gap-2 self-start rounded-full border border-secondary-200 bg-white px-5 py-2.5 text-sm font-black text-secondary-700 shadow-sm transition hover:bg-primary-50 hover:text-primary-900 sm:self-auto"
            >
              Edit profile
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Contact meta */}
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-secondary-100 pt-6 text-sm text-secondary-600 sm:grid-cols-2 lg:grid-cols-4">
            <MetaItem icon={Mail} label="Email" value={customer.email} />
            {phone && <MetaItem icon={Phone} label="Phone" value={phone} />}
            <MetaItem
              icon={Calendar}
              label="Member since"
              value={formatDate(customer.createdAt)}
            />
            <MetaItem
              icon={MapPin}
              label="Default address"
              value={
                defaultAddress
                  ? `${defaultAddress.city}, ${defaultAddress.state}`
                  : "Not set"
              }
            />
          </div>
        </div>
      </section>

      {/* ───────── Stat cards ───────── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total orders"
          value={String(orders.length)}
          tint="bg-primary-50 text-primary-700"
        />
        <StatCard
          icon={Truck}
          label="Yet to reach"
          value={String(active.length)}
          tint="bg-indigo-50 text-indigo-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered"
          value={String(deliveredCount)}
          tint="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          icon={Wallet}
          label="Total spent"
          value={formatCurrency(totalSpent)}
          tint="bg-rose-50 text-rose-700"
        />
      </section>

      {/* ───────── Yet to reach (active orders) ───────── */}
      <section className="rounded-[2rem] border border-secondary-200/80 bg-white p-6 shadow-sm sm:p-8">
        <SectionHeader
          icon={Truck}
          title="Yet to reach"
          subtitle="Orders currently being prepared or on their way to you."
          count={active.length}
        />

        {active.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders in transit"
            text="You have no active orders right now. When you place a new order it will appear here."
            cta={{ label: "Browse books", to: "/browse" }}
          />
        ) : (
          <div className="space-y-5">
            {active.map((order) => (
              <ActiveOrderCard key={String(order.id)} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* ───────── Order history (delivered + cancelled) ───────── */}
      <section className="rounded-[2rem] border border-secondary-200/80 bg-white p-6 shadow-sm sm:p-8">
        <SectionHeader
          icon={Clock}
          title="Order history"
          subtitle="Your delivered and cancelled orders."
          count={history.length}
          action={
            <Link
              to="/account/orders"
              className="text-sm font-black text-primary-700 hover:text-primary-800 hover:underline"
            >
              View all
            </Link>
          }
        />

        {history.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No completed orders yet"
            text="Once an order is delivered or cancelled it will show up in your history."
            cta={{ label: "Start shopping", to: "/browse" }}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-secondary-100">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-secondary-100 bg-secondary-50/70 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Items</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {history.slice(0, 6).map((order) => (
                  <tr key={String(order.id)} className="hover:bg-primary-50/40">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-700">
                      #{String(order.id).slice(-6)}
                    </td>
                    <td className="px-4 py-3 text-secondary-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                      {(order.items?.length ?? 0)}{" "}
                      {order.items?.length === 1 ? "book" : "books"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-black text-secondary-900">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ───────────────────────── Sub-components ───────────────────────── */

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="truncate font-semibold text-secondary-900">{value}</p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-3xl border border-secondary-100 bg-white p-5 shadow-sm">
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-black text-secondary-900 sm:text-3xl">{value}</div>
      <div className="mt-0.5 text-xs font-semibold text-slate-500">{label}</div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  action,
}: {
  icon: typeof Package;
  title: string;
  subtitle: string;
  count: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-secondary-900">
            {title}
            <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-bold text-slate-500">
              {count}
            </span>
          </h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

/** An active order with a 4-step fulfilment progress tracker. */
function ActiveOrderCard({ order }: { order: Order }) {
  const items = order.items ?? [];
  const currentStep = PIPELINE.indexOf(order.status); // -1 if Cancelled (not shown here)

  return (
    <div className="rounded-3xl border border-secondary-100 bg-secondary-50/50 p-5 transition hover:border-primary-200 hover:bg-white hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Item thumbnails */}
          <div className="flex -space-x-3">
            {items.slice(0, 3).map((it, idx) => (
              <div
                key={String(it.id ?? idx)}
                className="h-12 w-9 overflow-hidden rounded-md border-2 border-white bg-primary-100 shadow-sm"
              >
                {it.coverImageSnapshot ? (
                  <img
                    src={it.coverImageSnapshot}
                    alt={it.titleSnapshot}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-700 text-[8px] font-bold text-white">
                    {it.titleSnapshot?.[0] ?? "?"}
                  </div>
                )}
              </div>
            ))}
            {items.length > 3 && (
              <div className="flex h-12 w-9 items-center justify-center rounded-md border-2 border-white bg-secondary-200 text-[10px] font-bold text-secondary-600 shadow-sm">
                +{items.length - 3}
              </div>
            )}
          </div>

          <div>
            <p className="font-mono text-xs font-bold text-primary-700">
              #{String(order.id).slice(-6)}
            </p>
            <p className="text-sm font-bold text-secondary-900">
              {items[0]?.titleSnapshot ?? "Order"}
              {items.length > 1 && (
                <span className="font-medium text-slate-500">
                  {" "}
                  + {items.length - 1} more
                </span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-sm font-black text-secondary-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="mt-5 flex items-center">
        {PIPELINE.map((step, idx) => {
          const done = idx <= currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black transition ${done
                    ? isCurrent
                      ? "bg-primary-600 text-white ring-4 ring-primary-100"
                      : "bg-emerald-500 text-white"
                    : "bg-white text-slate-400 ring-1 ring-secondary-200"
                    }`}
                >
                  {done && !isCurrent ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] font-bold ${done ? "text-secondary-700" : "text-slate-400"
                    }`}
                >
                  {step}
                </span>
              </div>
              {idx < PIPELINE.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded ${idx < currentStep ? "bg-emerald-400" : "bg-secondary-200"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  cta,
}: {
  icon: typeof Package;
  title: string;
  text: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-secondary-200 bg-secondary-50/40 px-6 py-12 text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-black text-secondary-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-5 rounded-full bg-primary-900 px-6 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-primary-800"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
