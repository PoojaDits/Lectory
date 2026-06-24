import { useMemo, useState } from "react";
import { Search, ShoppingBag, UserCircle, Users } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useCustomers, useOrders } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";

const PAGE_SIZE = 8;

export default function CustomerManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: customers = [], isLoading } = useCustomers();
  const { data: orders = [] } = useOrders();

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
        `${c.firstName}${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="space-y-6 mt-[65px]">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary-700">
          Admin · Customers
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
          Customer Management
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-secondary-600">
          All registered buyers on the marketplace. View order history and
          contact information.
        </p>
      </header>

      {/* ── Search + counter ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
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
            className="w-full rounded-full border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>

      {/*
        ── Table (Bug UI-048 fix) ──
        Semantic <table> with <colgroup> matching the original 12-col grid
        proportions (4/2/2/2/2).
      */}
      <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Customers list. Columns: Customer, Joined, Orders, Total spend, Last order.
          </caption>
          <colgroup>
            <col className="w-[33.3333%]" /> {/* Customer     — col-span-4 */}
            <col className="w-[16.6667%]" /> {/* Joined       — col-span-2 */}
            <col className="w-[16.6667%]" /> {/* Orders       — col-span-2 */}
            <col className="w-[16.6667%]" /> {/* Total spend  — col-span-2 */}
            <col className="w-[16.6667%]" /> {/* Last order   — col-span-2 */}
          </colgroup>
          <thead className="bg-secondary-50">
            <tr className="border-b border-secondary-200">
              <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Joined
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Orders
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Total spend
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Last order
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                  Loading customers…
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                  No customers match your search.
                </td>
              </tr>
            ) : (
              pageItems.map((c) => {
                const stats = customerStats.get(String(c.id));
                return (
                  <tr key={String(c.id)} className="transition hover:bg-primary-50/40">
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                          <UserCircle className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-secondary-900">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {c.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4 text-xs text-secondary-600">
                      {formatDate(c.createdAt)}
                    </td>
                    {/* Orders */}
                    <td className="px-5 py-4">
                      {stats ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-800">
                          <ShoppingBag className="h-3 w-3" />
                          {stats.ordersCount}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    {/* Total spend */}
                    <td
                      className={cn(
                        "px-5 py-4 text-sm font-bold",
                        stats && stats.totalSpend > 0
                          ? "text-emerald-700"
                          : "text-slate-400",
                      )}
                    >
                      {stats ? formatCurrency(stats.totalSpend) : "—"}
                    </td>
                    {/* Last order */}
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {stats?.lastOrderAt ? formatDate(stats.lastOrderAt) : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
