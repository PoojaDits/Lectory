import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOrdersTabProps {
  orders: Order[];
}

const ACTIVE_STATUSES: OrderStatus[] = ["Created", "Accepted", "Shipped"];

const STATUS_LINE: Record<OrderStatus, { text: string; className: string }> = {
  Created: {
    text: "Order received · awaiting confirmation",
    className: "text-secondary-600",
  },
  Accepted: { text: "Preparing for shipment", className: "text-primary-600" },
  Shipped: { text: "On the way", className: "text-sky-700" },
  Delivered: { text: "Delivered", className: "text-emerald-700" },
  Cancelled: { text: "Cancelled", className: "text-rose-600" },
};

export default function CustomerOrdersTab({ orders }: CustomerOrdersTabProps) {
  const [search, setSearch] = useState("");

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedOrders;

    return sortedOrders.filter((order) => {
      const haystack = [
        `#${order.id}`,
        order.shippingAddress,
        order.items
          ?.map(
            (item) =>
              `${item.titleSnapshot} ${item.authorSnapshot} ${item.sellerNameSnapshot}`
          )
          .join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [search, sortedOrders]);

  const totalActive = orders.filter((order) =>
    ACTIVE_STATUSES.includes(order.status)
  ).length;
  const totalDelivered = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const totalCancelled = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const yetToReach = filtered.filter((order) =>
    ACTIVE_STATUSES.includes(order.status)
  );
  const delivered = filtered.filter((order) => order.status === "Delivered");
  const cancelled = filtered.filter((order) => order.status === "Cancelled");

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-secondary-200 bg-white/70 p-16 text-center">
        <ShoppingBag className="mb-4 h-14 w-14 text-slate-300" />
        <h2 className="text-xl font-black text-secondary-900">No orders yet</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          You haven't placed any book orders yet. Explore the marketplace to
          find your next favorite read.
        </p>
        <Link
          to="/browse"
          className="mt-6 rounded-full bg-primary-700 px-8 py-3.5 text-sm font-black text-white transition hover:bg-primary-800"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-secondary-200 bg-white/70 p-16 text-center">
        <Search className="mb-4 h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-black text-secondary-900">
          No matching orders
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          No orders match “{search}”. Try a different book title, author, or
          order ID.
        </p>
        <button
          type="button"
          onClick={() => setSearch("")}
          className="mt-6 rounded-full bg-secondary-900 px-8 py-3 text-xs font-bold text-white transition hover:bg-secondary-800"
        >
          Clear Search
        </button>
      </div>
    );
  }

  const sections = [
    {
      key: "yet-to-reach",
      title: "Yet to Reach",
      subtitle: "Orders being prepared or on their way to you.",
      icon: Truck,
      list: yetToReach,
      accent: "bg-indigo-100 text-indigo-700",
    },
    {
      key: "delivered",
      title: "Delivered",
      subtitle: "Orders you've successfully received.",
      icon: CheckCircle2,
      list: delivered,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      key: "cancelled",
      title: "Cancelled",
      subtitle: "Orders that were rejected or cancelled.",
      icon: XCircle,
      list: cancelled,
      accent: "bg-rose-100 text-rose-700",
    },
  ].filter((section) => section.list.length > 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-primary-700">
          Customer · Orders
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
          Order History
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-secondary-600">
          Review every purchase, track active shipments, and revisit your
          completed orders.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={Package}
          tone="amber"
          hint="Across all statuses"
        />
        <StatCard
          label="In Transit"
          value={totalActive}
          icon={Truck}
          tone="indigo"
          hint="Created, accepted, or shipped"
        />
        <StatCard
          label="Delivered"
          value={totalDelivered}
          icon={CheckCircle2}
          tone="emerald"
          hint="Successfully received"
        />
        <StatCard
          label="Cancelled"
          value={totalCancelled}
          icon={XCircle}
          tone="rose"
          hint="Rejected or cancelled"
        />
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order ID, book title, author, or address…"
            className="w-full rounded-full border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
        <div className="rounded-full bg-primary-50 px-4 py-2 text-xs font-bold text-primary-800">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <section
            key={section.key}
            className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${section.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-lg font-black text-secondary-900">
                  {section.title}
                  <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                    {section.list.length}
                  </span>
                </h2>
                <p className="text-sm text-slate-500">{section.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.list.map((order) => (
                <OrderCard key={String(order.id)} order={order} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const items = order.items ?? [];
  const statusLine = STATUS_LINE[order.status];

  return (
    <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-wrap items-stretch gap-x-8 gap-y-2 border-b border-secondary-200 bg-secondary-50 px-5 py-4 sm:px-6">
        <div className="min-w-[110px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Order Placed
          </p>
          <p className="text-sm text-secondary-800">{formatDate(order.createdAt)}</p>
        </div>
        <div className="min-w-[90px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Total
          </p>
          <p className="text-sm font-semibold text-secondary-800">
            {formatCurrency(order.total)}
          </p>
        </div>

        <div className="ml-auto flex flex-col items-end gap-1.5 text-right">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Order #{String(order.id).slice(-8)}
          </p>
          <Link
            to="/browse"
            className="text-xs font-medium text-sky-700 hover:text-sky-800 hover:underline"
          >
            View order details
          </Link>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="mb-5 flex items-center gap-2">
          <StatusBadge status={order.status} />
          <span className={`text-sm font-semibold ${statusLine.className}`}>
            {statusLine.text}
          </span>
        </div>

        <ul className="divide-y divide-secondary-100">
          {items.map((item, idx) => (
            <li
              key={String(item.id || idx)}
              className="flex gap-4 py-4 first:pt-0 last:pb-0"
            >
              <Link
                to={`/books/${item.bookId}`}
                className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-secondary-200"
              >
                {item.coverImageSnapshot ? (
                  <img
                    src={item.coverImageSnapshot}
                    alt={item.titleSnapshot}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-800">
                    <BookOpen className="h-4 w-4" />
                  </div>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to={`/books/${item.bookId}`}
                  className="line-clamp-2 text-sm font-semibold text-sky-800 hover:text-sky-900 hover:underline"
                >
                  {item.titleSnapshot}
                </Link>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                  {item.authorSnapshot || "Author unknown"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Sold by {item.sellerNameSnapshot || `Seller #${item.sellerId}`}{" "}
                  · Qty {item.quantity}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Link
                    to={`/books/${item.bookId}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-secondary-600 hover:text-primary-800 hover:underline"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Buy it again
                  </Link>
                  <Link
                    to={`/books/${item.bookId}`}
                    className="text-xs font-medium text-sky-700 hover:text-sky-800 hover:underline"
                  >
                    View your item
                  </Link>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-sm font-bold text-secondary-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-3 border-t border-secondary-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              <span className="font-semibold text-secondary-600">Ship to:</span>{" "}
              {order.shippingAddress}
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert(`Invoice for Order #${order.id} downloaded.`)}
            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-sky-700 hover:text-sky-800 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
