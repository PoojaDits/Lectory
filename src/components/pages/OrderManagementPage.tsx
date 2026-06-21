import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import {
  useCustomers,
  useOrders,
  useSellers,
  useUpdateOrderStatus,
} from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_STYLES,
} from "@/lib/constants";
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

/**
 * Order Management screen.
 *
 * Marketplace-level oversight of orders. Sellers still process their
 * own orders, but the admin can override the status to mediate disputes
 * or unblock stuck orders (e.g. cancel a shipment that never arrived).
 */
export default function OrderManagementPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const { data: orders = [], isLoading } = useOrders();
  const { data: customers = [] } = useCustomers();
  const { data: sellers = [] } = useSellers();
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
        const customer = customers.find(
          (c) => String(c.id) === String(o.customerId)
        );
        const seller = sellers.find(
          (s) => String(s.id) === String(o.sellerId)
        );
        const haystack = [
          `#${o.id}`,
          customer ? `${customer.firstName} ${customer.lastName}` : "",
          customer?.email ?? "",
          seller?.businessName ?? "",
          o.shippingAddress,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
  }, [orders, filter, search, customers, sellers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const setFilterAndReset = (f: StatusFilter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Admin · Orders
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Order Management Oversight
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Marketplace-wide view of every customer order. Instantly synchronizes whenever a Seller accepts, dispatches, or cancels an order.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 text-amber-950 px-4 py-2.5 rounded-2xl text-xs font-bold self-start shrink-0 flex items-center gap-2 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-Time Sync with Seller Fulfillments</span>
        </div>
      </header>

      {/* ── Pipeline summary ── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-6">
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
          tone="blue"
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
          tone="indigo"
        />
        <PipelineTile
          label="Delivered"
          value={counts.Delivered ?? 0}
          icon={CheckCircle2}
          tone="emerald"
        />
        <PipelineTile
          label="Cancelled"
          value={counts.Cancelled ?? 0}
          icon={XCircle}
          tone="rose"
        />
      </section>

      {/* ── Filter pills + search ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                    ? "bg-amber-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
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
            placeholder="Search by ID, customer, seller, or address…"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* ── Orders table ── */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div className="col-span-2">#</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Seller</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Placed</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Loading orders…
          </div>
        ) : pageItems.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            No orders match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pageItems.map((o) => {
              const customer = customers.find(
                (c) => String(c.id) === String(o.customerId)
              );
              const seller = sellers.find(
                (s) => String(s.id) === String(o.sellerId)
              );
              return (
                <li
                  key={String(o.id)}
                  className="grid grid-cols-12 items-center gap-2 px-5 py-4 text-sm transition hover:bg-amber-50/40"
                >
                  <div className="col-span-2 min-w-0">
                    <p
                      className="truncate text-xs font-extrabold text-slate-700 font-mono"
                      title={`#${String(o.id)}`}
                    >
                      #{String(o.id).slice(0, 8)}&hellip;
                    </p>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {customer
                        ? `${customer.firstName} ${customer.lastName}`
                        : "—"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {customer?.email}
                    </p>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {seller?.businessName ?? `Seller #${o.sellerId}`}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {o.shippingAddress}
                    </p>
                  </div>
                  <div className="col-span-1 text-sm font-bold text-emerald-700">
                    {formatCurrency(o.total)}
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="col-span-1 text-xs text-slate-500">
                    {formatDate(o.createdAt)}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <StatusChanger
                      current={o.status}
                      disabled={updateOrder.isPending}
                      onChange={(status) =>
                        updateOrder.mutate({ id: o.id, status })
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

// ── Status changer (admin override) ───────────────────────────────────────

function StatusChanger({
  current,
  disabled,
  onChange,
}: {
  current: OrderStatus;
  disabled?: boolean;
  onChange: (next: OrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  const allowed = (ORDER_STATUS_FLOW[current] ?? []) as OrderStatus[];
  const all: OrderStatus[] = [
    "Created",
    "Accepted",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50",
          open && "ring-2 ring-amber-200"
        )}
      >
        Change status
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          {all.map((s) => {
            const isCurrent = s === current;
            const isSellerFlow = allowed.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                disabled={isCurrent}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs font-bold transition",
                  isCurrent
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "text-slate-700 hover:bg-amber-50"
                )}
              >
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                    ORDER_STATUS_STYLES[s]
                  )}
                >
                  {s}
                </span>
                {!isSellerFlow && !isCurrent && (
                  <span className="text-[10px] font-bold text-amber-700">
                    override
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
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
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    indigo: "bg-indigo-100 text-indigo-800",
    emerald: "bg-emerald-100 text-emerald-800",
    rose: "bg-rose-100 text-rose-800",
  } as const;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
        <p className="text-2xl font-extrabold leading-none text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}
