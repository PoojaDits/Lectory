import { useState, useMemo } from "react";
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
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOrdersTabProps {
  orders: Order[];
}

/** Orders still in-flight — not yet with the customer. */
const ACTIVE_STATUSES: OrderStatus[] = ["Created", "Accepted", "Shipped"];

/**
 * Classic, Amazon-style status line — a single colored sentence,
 * not a flashy banner.
 */
const STATUS_LINE: Record<
  OrderStatus,
  { text: string; className: string }
> = {
  Created: { text: "Order received · awaiting confirmation", className: "text-slate-600" },
  Accepted: { text: "Preparing for shipment", className: "text-amber-600" },
  Shipped: { text: "On the way", className: "text-sky-700" },
  Delivered: { text: "Delivered", className: "text-emerald-700" },
  Cancelled: { text: "Cancelled", className: "text-rose-600" },
};

export default function CustomerOrdersTab({ orders }: CustomerOrdersTabProps) {
  const [search, setSearch] = useState("");

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders]);

  // Text search applied across order id, items, and shipping address.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedOrders;
    return sortedOrders.filter((o) => {
      const haystack = [
        `#${o.id}`,
        o.shippingAddress,
        o.items
          ?.map(
            (it) =>
              `${it.titleSnapshot} ${it.authorSnapshot} ${it.sellerNameSnapshot}`
          )
          .join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sortedOrders, search]);

  // ── Group the (search-filtered) orders into display sections ──
  const yetToReach = filtered.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const delivered = filtered.filter((o) => o.status === "Delivered");
  const cancelled = filtered.filter((o) => o.status === "Cancelled");

  const totalActive = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  ).length;
  const totalDelivered = orders.filter((o) => o.status === "Delivered").length;

  // ── No orders placed yet ──
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/50 p-16 text-center">
        <ShoppingBag className="h-14 w-14 text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900">No orders yet</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          You haven't placed any book orders yet. Explore our catalog to find
          your next favorite read!
        </p>
        <Link
          to="/browse"
          className="mt-6 rounded-full bg-amber-900 px-8 py-3.5 text-sm font-black text-white hover:bg-amber-800 transition shadow-md"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  // ── Search returned nothing ──
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/50 p-16 text-center">
        <Search className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900">No matching orders</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          No orders match “{search}”. Try a different book title, author, or
          order ID.
        </p>
        <button
          type="button"
          onClick={() => setSearch("")}
          className="mt-6 rounded-full bg-slate-900 px-8 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
        >
          Clear Search
        </button>
      </div>
    );
  }

  // Ordered list of sections — Yet to Reach first, then Delivered, then Cancelled.
  const sections = [
    {
      key: "yet-to-reach",
      title: "Yet to Reach",
      subtitle: "Orders being prepared or on their way to you.",
      icon: Truck,
      tint: "bg-indigo-50 text-indigo-700",
      list: yetToReach,
    },
    {
      key: "delivered",
      title: "Delivered",
      subtitle: "Orders you've successfully received.",
      icon: CheckCircle2,
      tint: "bg-emerald-50 text-emerald-700",
      list: delivered,
    },
    {
      key: "cancelled",
      title: "Cancelled",
      subtitle: "Orders that were rejected or cancelled.",
      icon: XCircle,
      tint: "bg-rose-50 text-rose-700",
      list: cancelled,
    },
  ].filter((s) => s.list.length > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Your Orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track shipments and review your delivered and cancelled orders.
          </p>
        </div>

        {/* Stats Summary Pill */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-full text-xs font-bold text-amber-950">
          <Package className="h-4 w-4 text-amber-800" />
          <span>{orders.length} Total</span>
          <span className="text-amber-300">|</span>
          <span className="text-indigo-700">{totalActive} In Transit</span>
          <span className="text-amber-300">|</span>
          <span className="text-emerald-700">{totalDelivered} Delivered</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative w-full sm:min-w-[300px] sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all orders…"
            className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* Grouped sections */}
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <section key={section.key}>
            {/* Section header */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${section.tint}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                  {section.title}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                    {section.list.length}
                  </span>
                </h2>
                <p className="text-sm text-slate-500">{section.subtitle}</p>
              </div>
            </div>

            {/* Order cards */}
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

/* ───────────────────────── Order card (classic Amazon style) ───────────────────────── */

function OrderCard({ order }: { order: Order }) {
  const items = order.items ?? [];
  const statusLine = STATUS_LINE[order.status];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      {/* ── Header bar: ORDER PLACED · TOTAL · ORDER # ── */}
      <div className="flex flex-wrap items-stretch gap-x-8 gap-y-2 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="min-w-[110px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Order Placed
          </p>
          <p className="text-sm text-slate-800">{formatDate(order.createdAt)}</p>
        </div>
        <div className="min-w-[90px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Total
          </p>
          <p className="text-sm font-semibold text-slate-800">
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

      {/* ── Body ── */}
      <div className="px-5 py-5 sm:px-6">
        {/* Clean, single-line colored status (Amazon-style) */}
        <div className="mb-5 flex items-center gap-2">
          <StatusBadge status={order.status} />
          <span className={`text-sm font-semibold ${statusLine.className}`}>
            {statusLine.text}
          </span>
        </div>

        {/* Items — one clean row per book */}
        <ul className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <li
              key={String(item.id || idx)}
              className="flex gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Cover */}
              <Link
                to={`/books/${item.bookId}`}
                className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-slate-200"
              >
                {item.coverImageSnapshot ? (
                  <img
                    src={item.coverImageSnapshot}
                    alt={item.titleSnapshot}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-amber-100 text-amber-800">
                    <BookOpen className="h-4 w-4" />
                  </div>
                )}
              </Link>

              {/* Details */}
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

                {/* Action links */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Link
                    to={`/books/${item.bookId}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-amber-800 hover:underline"
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

              {/* Price */}
              <div className="shrink-0 text-right">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer — ship to + invoice */}
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              <span className="font-semibold text-slate-600">Ship to:</span>{" "}
              {order.shippingAddress}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              alert(`Invoice for Order #${order.id} downloaded.`)
            }
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
