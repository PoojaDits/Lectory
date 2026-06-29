import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
  BookOpen,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { useSellerOrders } from "@/hooks/useCustomer";
import { useUpdateOrderStatus } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useAuthStore } from "@/stores/useAuthStore";
import type { OrderStatus } from "@/types";

type StatusFilter = "all" | OrderStatus;

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Created", label: "Created" },
  { id: "Accepted", label: "Accepted" },
  { id: "Shipped", label: "Shipped" },
  { id: "Delivered", label: "Delivered" },
  { id: "Cancelled", label: "Cancelled" },
];

const PAGE_SIZE = 8;

export default function SellerOrdersPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  // ── Modal-based cancel confirmation (replaces browser confirm()) ──
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useSellerOrders(currentUser?.id);
  const updateOrder = useUpdateOrderStatus();

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      out[o.status] = (out[o.status] ?? 0) + 1;
    });
    return out;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => filter === "all" || o.status === filter)
      .filter((o) => {
        if (!q) return true;
        const haystack = [
          `#${o.id}`,
          o.shippingAddress,
          ...(o.items ?? []).map(
            (it) => `${it.titleSnapshot} ${it.authorSnapshot}`,
          ),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
  }, [orders, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const setFilterAndReset = (f: StatusFilter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-primary-700">
          Seller · Orders
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
          Order Management
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-secondary-600">
          Process your customer orders. Accept, ship, deliver, or cancel orders
          using the status workflow below.
        </p>
      </header>

      {/* ── Pipeline summary ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <PipelineTile
          label="Total"
          value={counts.all ?? 0}
          icon={ShoppingBag}
          tone="slate"
        />
        <PipelineTile
          label="Created"
          value={counts.Created ?? 0}
          icon={AlertCircle}
          tone="amber"
        />
        <PipelineTile
          label="Accepted"
          value={counts.Accepted ?? 0}
          icon={CheckCircle2}
          tone="amber"
        />
        <PipelineTile
          label="Shipped"
          value={counts.Shipped ?? 0}
          icon={Truck}
          tone="amber"
        />
        <PipelineTile
          label="Delivered"
          value={counts.Delivered ?? 0}
          icon={CheckCircle2}
          tone="amber"
        />
        <PipelineTile
          label="Cancelled"
          value={counts.Cancelled ?? 0}
          icon={XCircle}
          tone="rose"
        />
      </section>

      {/* ── Filter pills + search ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const count = counts[f.id] ?? 0;
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterAndReset(f.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition",
                  isActive
                    ? "bg-primary-700 text-white shadow-sm"
                    : "border border-secondary-200 bg-white text-secondary-700 hover:bg-secondary-50",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-secondary-100 text-secondary-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative ml-auto flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order ID or address…"
            className="w-full rounded-full border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* ── Orders list ── */}
      {isLoading ? (
        <div className="py-24 text-center text-sm font-bold text-slate-400">
          <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin" />
          Loading orders…
        </div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-secondary-200 bg-white/70 p-16 text-center">
          <ShoppingBag className="h-14 w-14 text-slate-300 mb-3" />
          <h3 className="text-lg font-black text-secondary-900">No orders found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            When customers place orders for your listings, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pageItems.map((order) => {
            const items = order.items ?? [];
            const isExpanded = expandedOrderId === String(order.id);
            return (
              <div
                key={String(order.id)}
                className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm"
              >
                {/* ── Order header row ── */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedOrderId(isExpanded ? null : String(order.id))
                  }
                  className="flex w-full flex-col items-start justify-between gap-3 px-5 py-4 text-left transition hover:bg-primary-50/40 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-secondary-900">
                        Order #{String(order.id)}
                      </p>
                      <p className="text-xs text-slate-500">
                        <Calendar className="inline h-3 w-3" />{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-base font-black text-emerald-700">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </button>

                {/* ── Action Buttons (Seller Status Management) ── */}
                <div className="flex flex-wrap items-center gap-2 border-t border-secondary-100 bg-secondary-50 px-5 py-3">
                  {order.status === "Created" && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrder.mutate({
                            id: order.id,
                            status: "Accepted",
                          });
                        }}
                        disabled={updateOrder.isPending}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-4 py-2 text-xs font-black text-white hover:bg-primary-800 transition shadow-md shadow-primary-900/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Was: if (confirm("Reject and cancel this customer order?")) { … }
                          // Now: open a styled confirmation modal.
                          setPendingCancelId(String(order.id));
                        }}
                        disabled={updateOrder.isPending}
                        className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-black text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </>
                  )}
                  {order.status === "Accepted" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrder.mutate({
                          id: order.id,
                          status: "Shipped",
                        });
                      }}
                      disabled={updateOrder.isPending}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-xs font-black text-white hover:bg-primary-700 transition shadow-md shadow-primary-900/20 disabled:opacity-50"
                    >
                      <Truck className="h-3.5 w-3.5" /> Mark as Shipped
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrder.mutate({
                          id: order.id,
                          status: "Delivered",
                        });
                      }}
                      disabled={updateOrder.isPending}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-4 py-2 text-xs font-black text-white hover:bg-primary-800 transition shadow-md disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Delivery
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Order Complete
                    </span>
                  )}
                  {order.status === "Cancelled" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-4 py-2 text-xs font-black text-secondary-700">
                      <XCircle className="h-3.5 w-3.5" /> Cancelled
                    </span>
                  )}
                </div>

                {/* ── Expanded details ── */}
                {isExpanded && (
                  <div className="border-t border-secondary-100 bg-white p-5">
                    {/* Items */}
                    <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">
                      Items to Fulfill ({items.length})
                    </h4>
                    <ul className="space-y-3">
                      {items.map((it, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 rounded-xl bg-secondary-50 p-3"
                        >
                          {it.coverImageSnapshot ? (
                            <img
                              src={it.coverImageSnapshot}
                              alt={it.titleSnapshot}
                              className="h-14 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-10 items-center justify-center rounded-md bg-secondary-200">
                              <BookOpen className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-secondary-900">
                              {it.titleSnapshot}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {it.authorSnapshot || "Author"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-secondary-700">
                              Qty: {it.quantity}
                            </p>
                            <p className="text-sm font-black text-emerald-700">
                              {formatCurrency(it.price * it.quantity)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Shipping Address */}
                    <div className="mt-5 rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                      <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Customer Delivery Address:
                      </p>
                      <p className="flex items-start gap-2 text-sm text-secondary-700">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        {order.shippingAddress}
                      </p>
                    </div>

                    {/* Status Guidance */}
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900">
                      <span aria-hidden="true" className="text-lg leading-none">
                        {order.status === "Created" && "⏳"}
                        {order.status === "Accepted" && "📦"}
                        {order.status === "Shipped" && "🚚"}
                        {order.status === "Delivered" && "🎉"}
                        {order.status === "Cancelled" && "❌"}
                      </span>
                      <div>
                        <p className="font-bold">Fulfillment Stage:</p>
                        <p>
                          {order.status === "Created" &&
                            "New order placed by customer. Accept this order to begin packaging."}
                          {order.status === "Accepted" &&
                            "Order accepted! Package the books and mark as Shipped when handed to courier."}
                          {order.status === "Shipped" &&
                            "Order dispatched! Confirm Delivery once handed to the customer."}
                          {order.status === "Delivered" &&
                            "Delivered successfully. Transaction verified."}
                          {order.status === "Cancelled" &&
                            "Order cancelled. No further action required."}
                        </p>
                      </div>
                      <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950 border border-primary-800 px-3.5 py-1.5 rounded-full self-start sm:self-auto shrink-0">
                        Live Sync ✨
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* ── Cancel-order confirmation modal (replaces window.confirm) ── */}
      <ConfirmDialog
        open={pendingCancelId !== null}
        onClose={() => setPendingCancelId(null)}
        onConfirm={() => {
          if (pendingCancelId === null) return;
          updateOrder.mutate({
            id: pendingCancelId,
            status: "Cancelled",
          });
          setPendingCancelId(null);
        }}
        title="Cancel this order?"
        description={
          <>
            The customer will be notified and the order will be marked as{" "}
            <b>Cancelled</b>. This action cannot be undone from the seller
            dashboard.
          </>
        }
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        tone="danger"
        isPending={updateOrder.isPending}
      />
    </div>
  );
}

// ── Pipeline tile ──────────────────────────────────────────────────────────
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
    <div className="flex items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm min-w-0  bg-gradient-to-br from-primary-50 via-white to-orange-50 overflow-hidden">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          tones[tone],
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
