import { useMemo, useState } from "react";
import { Search, ShoppingBag, UserCircle, Users } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useCustomers, useOrders } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";

const PAGE_SIZE = 8;

/**
 * Customer Management screen.
 *
 * Lists registered buyers with their order activity so the admin can
 * spot high-value customers and support them when needed.
 */
export default function CustomerManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: customers = [], isLoading } = useCustomers();
  const { data: orders = [] } = useOrders();

  // Pre-aggregate per-customer order metrics.
  const customerStats = useMemo(() => {
    const map = new Map<
      string,
      { ordersCount: number; totalSpend: number; lastOrderAt?: string }
    >();
    orders.forEach((o) => {
      const key = String(o.customerId);
      const existing = map.get(key) ?? { ordersCount: 0, totalSpend: 0 };
      existing.ordersCount += 1;
      existing.totalSpend += o.total ?? 0;
      if (
        !existing.lastOrderAt ||
        new Date(o.createdAt) > new Date(existing.lastOrderAt)
      ) {
        existing.lastOrderAt = o.createdAt;
      }
      map.set(key, existing);
    });
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
          Admin · Customers
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Customer Management
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          All registered buyers on the marketplace. View order history and
          contact information.
        </p>
      </header>

      {/* ── Search + counter ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-900">
          <Users className="h-4 w-4" />
          {customers.length} registered customer
          {customers.length === 1 ? "" : "s"}
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
            placeholder="Search by name or email…"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2">Orders</div>
          <div className="col-span-2">Total spend</div>
          <div className="col-span-2">Last order</div>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Loading customers…
          </div>
        ) : pageItems.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No customers match your search.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pageItems.map((c) => {
              const stats = customerStats.get(String(c.id));
              return (
                <li
                  key={String(c.id)}
                  className="grid grid-cols-12 items-center gap-4 px-5 py-4 text-sm transition hover:bg-amber-50/40"
                >
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                        <UserCircle className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-900">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-slate-600">
                    {formatDate(c.createdAt)}
                  </div>
                  <div className="col-span-2">
                    {stats ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                        <ShoppingBag className="h-3 w-3" />
                        {stats.ordersCount}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "col-span-2 text-sm font-bold",
                      stats && stats.totalSpend > 0
                        ? "text-emerald-700"
                        : "text-slate-400"
                    )}
                  >
                    {stats ? formatCurrency(stats.totalSpend) : "—"}
                  </div>
                  <div className="col-span-2 text-xs text-slate-500">
                    {stats?.lastOrderAt ? formatDate(stats.lastOrderAt) : "—"}
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
