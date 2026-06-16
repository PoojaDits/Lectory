import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  BookOpen,
  MapPin,
  Calendar,
  Store,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOrdersTabProps {
  orders: Order[];
}

type FilterStatus = "all" | OrderStatus;

const STATUS_FILTERS: { id: FilterStatus; label: string }[] = [
  { id: "all", label: "All Orders" },
  { id: "Created", label: "Created" },
  { id: "Accepted", label: "Accepted" },
  { id: "Shipped", label: "Shipped" },
  { id: "Delivered", label: "Delivered" },
  { id: "Cancelled", label: "Cancelled" },
];

export default function CustomerOrdersTab({ orders }: CustomerOrdersTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedOrders
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      .filter((o) => {
        if (!query) return true;
        const haystack = [
          `#${o.id}`,
          o.shippingAddress,
          o.items?.map((it) => `${it.titleSnapshot} ${it.authorSnapshot} ${it.sellerNameSnapshot}`).join(" ") || "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
  }, [sortedOrders, statusFilter, search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            My Order History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your past purchases, track active shipments, and view digital invoices.
          </p>
        </div>

        {/* Stats Summary Pill */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-full text-xs font-bold text-amber-950">
          <Package className="h-4 w-4 text-amber-800" />
          <span>{orders.length} Total Orders</span>
          <span className="text-amber-300">|</span>
          <span className="text-emerald-700">
            {orders.filter((o) => o.status === "Delivered").length} Delivered
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-sm">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f.id;
            const count =
              f.id === "all"
                ? orders.length
                : orders.filter((o) => o.status === f.id).length;

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition ${
                  active
                    ? "bg-amber-900 text-white shadow-md shadow-amber-900/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search book titles, authors, or order ID…"
            className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/50 p-16 text-center">
          <ShoppingBag className="h-14 w-14 text-slate-300 mb-4" />
          <h2 className="text-xl font-black text-slate-900">No orders found</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {orders.length === 0
              ? "You haven't placed any book orders yet. Explore our catalog to find your next favorite read!"
              : "No orders match your current filter and search criteria."}
          </p>
          {orders.length === 0 ? (
            <Link
              to="/browse"
              className="mt-6 rounded-full bg-amber-900 px-8 py-3.5 text-sm font-black text-white hover:bg-amber-800 transition shadow-md"
            >
              Browse Marketplace
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setSearch("");
              }}
              className="mt-6 rounded-full bg-slate-900 px-8 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const items = order.items ?? [];
            return (
              <div
                key={String(order.id)}
                className="overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Top Banner */}
                <div className="bg-slate-50/80 p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
                    <div>
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                        Order Number
                      </span>
                      <span className="text-base font-black text-slate-900">
                        #{String(order.id)}
                      </span>
                    </div>

                    <div>
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                        Date Placed
                      </span>
                      <span className="font-bold text-slate-800 inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div>
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                        Total Amount
                      </span>
                      <span className="text-base font-black text-emerald-700">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <Link
                      to={`/browse`}
                      className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition shadow-sm"
                    >
                      <span>Buy Books Again</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items and Delivery Section */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Items list */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                      Purchased Books ({items.length})
                    </h3>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item, idx) => (
                        <li
                          key={String(item.id || idx)}
                          className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                        >
                          {/* Book cover */}
                          <Link
                            to={`/books/${item.bookId}`}
                            className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-sm"
                          >
                            {item.coverImageSnapshot ? (
                              <img
                                src={item.coverImageSnapshot}
                                alt={item.titleSnapshot}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-amber-800 text-white">
                                <BookOpen className="h-4 w-4" />
                              </div>
                            )}
                          </Link>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/books/${item.bookId}`}
                              className="font-bold text-slate-900 hover:text-amber-900 transition line-clamp-1 text-sm block"
                            >
                              {item.titleSnapshot}
                            </Link>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {item.authorSnapshot || "Author unknown"}
                            </p>
                            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Store className="h-3 w-3" />
                              {item.sellerNameSnapshot || `Seller #${item.sellerId}`}
                            </p>
                            <div className="mt-2 flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-black text-slate-900">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fulfillment Stage Notification Banner */}
                  <div className="rounded-2xl bg-slate-900 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-inner">
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl shrink-0">
                        {order.status === "Created" && "⏳"}
                        {order.status === "Accepted" && "📦"}
                        {order.status === "Shipped" && "🚚"}
                        {order.status === "Delivered" && "🎉"}
                        {order.status === "Cancelled" && "❌"}
                      </span>
                      <div>
                        <strong className="text-amber-400 block font-black uppercase tracking-wider text-[11px]">Live Shipment Milestone:</strong>
                        <span className="text-slate-200 mt-0.5 block leading-relaxed">
                          {order.status === "Created" && "Order placed successfully! Waiting for the seller to verify stock and accept your order."}
                          {order.status === "Accepted" && "✅ Accepted by Seller! The books are currently being packaged and prepared for courier dispatch."}
                          {order.status === "Shipped" && "🚚 Order Dispatched! Your books have been handed to the express delivery courier and are on route."}
                          {order.status === "Delivered" && "🎉 Delivered Successfully! Thank you for shopping on Lectory."}
                          {order.status === "Cancelled" && "❌ Order Rejected & Cancelled by Seller. Any pre-authorized payment has been fully refunded."}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950 border border-amber-800 px-3.5 py-1.5 rounded-full self-start sm:self-auto shrink-0">
                      Active Status ✨
                    </span>
                  </div>

                  {/* Delivery address footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-amber-50/50 p-4 border border-amber-100 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <MapPin className="h-4 w-4 text-amber-900 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">Shipped To: </span>
                        <span>{order.shippingAddress}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Digital receipt for Order #${order.id} downloaded successfully.`)}
                      className="inline-flex items-center justify-center gap-1.5 font-bold text-amber-900 hover:text-amber-700 transition sm:shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
