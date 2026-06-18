import { useMemo } from "react";
import { Link } from "react-router-dom";
import {AlertCircle,ArrowRight,BookOpen,CheckCircle2,ClipboardList,
  Clock3,
  LogIn,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  useBooks,
  useCustomers,
  useDashboardSummary,
  useOrders,
  useSellers,
} from "@/hooks/useAdmin";
import {
  customerToAuthUser,
  sellerToAuthUser,
  useImpersonation,
} from "@/hooks/useImpersonation";
import { formatCurrency, formatDate } from "@/utils/helpers";
import type { Customer, MarketBook, Order, Seller } from "@/types";


export default function AdminOverview() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: sellers = [] } = useSellers();
  const { data: customers = [] } = useCustomers();
  const { data: books = [] } = useBooks();
  const { data: orders = [] } = useOrders();

  const { start: startImpersonation, isImpersonating } = useImpersonation();

  // ── Derived data ──
  const pendingSellers = useMemo(
    () => sellers.filter((s) => s.status === "Pending Approval"),
    [sellers]
  );
  const pendingBooks = useMemo(
    () => books.filter((b) => b.status === "Pending Approval"),
    [books]
  );
  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [orders]
  );
  const recentSellers = useMemo(
    () =>
      [...sellers]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [sellers]
  );
  const recentBooks = useMemo(
    () =>
      [...books]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [books]
  );

  // Approved sellers only — non-approved can't access the seller area anyway.
  const approvedSellers = useMemo(
    () => sellers.filter((s) => s.status === "Approved"),
    [sellers]
  );

  // Order status distribution — used to show pipeline health at a glance.
  const orderBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
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

  // Marketplace revenue — sum of all order totals (no GST as per spec).
  const grossRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    [orders]
  );

  return (
    <div className="space-y-8 mt-[65px]">
      {/* ── Header ── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Admin Portal
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Marketplace Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of sellers, customers, books, and order activity across
            the marketplace.
          </p>
        </div>
      </header>

      {/* ── Stat tiles (the 4 totals from the spec) ── */}
      <section
        aria-label="Marketplace totals"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total Sellers"
          value={summaryLoading ? "…" : summary?.totalSellers ?? 0}
          icon={Store}
          tone="amber"
          hint={
            summary && summary.pendingSellers > 0
              ? `${summary.pendingSellers} pending approval`
              : "All sellers reviewed"
          }
        />
        <StatCard
          label="Total Customers"
          value={summaryLoading ? "…" : summary?.totalCustomers ?? 0}
          icon={Users}
          tone="indigo"
          hint="Registered buyers"
        />
        <StatCard
          label="Total Books"
          value={summaryLoading ? "…" : summary?.totalBooks ?? 0}
          icon={BookOpen}
          tone="emerald"
          hint={
            summary && summary.pendingBooks > 0
              ? `${summary.pendingBooks} pending approval`
              : "Catalog up to date"
          }
        />
        <StatCard
          label="Total Orders"
          value={summaryLoading ? "…" : summary?.totalOrders ?? 0}
          icon={ShoppingBag}
          tone="rose"
          hint={
            grossRevenue > 0
              ? `${formatCurrency(grossRevenue)} gross`
              : "No orders yet"
          }
        />
      </section>

      {/* ── Action items (pending approvals) ── */}
      <section
        aria-label="Pending approvals"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <ActionCard
          title="Seller approvals"
          subtitle={`${pendingSellers.length} pending request${
            pendingSellers.length === 1 ? "" : "s"
          }`}
          icon={Store}
          tone="amber"
          to="/admin/sellers"
          empty={pendingSellers.length === 0}
          emptyLabel="No sellers waiting for review."
        >
          {pendingSellers.slice(0, 3).map((s: Seller) => (
            <li
              key={String(s.id)}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {s.businessName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {s.contactPerson} · {s.email}
                </p>
              </div>
              <span className="hidden text-xs text-slate-400 sm:block">
                {formatDate(s.createdAt)}
              </span>
            </li>
          ))}
        </ActionCard>

        <ActionCard
          title="Book approvals"
          subtitle={`${pendingBooks.length} pending review${
            pendingBooks.length === 1 ? "" : "s"
          }`}
          icon={BookOpen}
          tone="emerald"
          to="/admin/books"
          empty={pendingBooks.length === 0}
          emptyLabel="No books waiting for review."
        >
          {pendingBooks.slice(0, 3).map((b: MarketBook) => (
            <li
              key={String(b.id)}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {b.title}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {b.author} · ISBN {b.isbn}
                </p>
              </div>
              <span className="hidden text-xs text-slate-400 sm:block">
                {formatDate(b.createdAt)}
              </span>
            </li>
          ))}
        </ActionCard>
      </section>

      {/* ── Quick impersonation switcher ── */}
      <ImpersonationPanel
        isImpersonating={isImpersonating}
        approvedSellers={approvedSellers}
        customers={customers}
        onImpersonateSeller={(s) =>
          startImpersonation(sellerToAuthUser(s))
        }
        onImpersonateCustomer={(c) =>
          startImpersonation(customerToAuthUser(c))
        }
      />

      {/* ── Order pipeline ── */}
      <section
        aria-label="Order pipeline"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <ClipboardList className="h-5 w-5 text-amber-700" />
              Order pipeline
            </h2>
            <p className="text-sm text-slate-500">
              Distribution of marketplace orders by status.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="hidden items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-900 sm:inline-flex"
          >
            View all orders <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <PipelineTile
            status="Created"
            count={orderBreakdown.Created}
            icon={Clock3}
          />
          <PipelineTile
            status="Accepted"
            count={orderBreakdown.Accepted}
            icon={CheckCircle2}
          />
          <PipelineTile
            status="Shipped"
            count={orderBreakdown.Shipped}
            icon={TrendingUp}
          />
          <PipelineTile
            status="Delivered"
            count={orderBreakdown.Delivered}
            icon={CheckCircle2}
          />
          <PipelineTile
            status="Cancelled"
            count={orderBreakdown.Cancelled}
            icon={XCircle}
          />
        </div>
      </section>

      {/* ── Recent activity ── */}
      <section
        aria-label="Recent activity"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <RecentList
          title="Recent sellers"
          icon={Store}
          linkTo="/admin/sellers"
          empty="No sellers registered yet."
          items={recentSellers.map((s) => ({
            id: String(s.id),
            primary: s.businessName,
            secondary: `${s.contactPerson} · ${s.email}`,
            meta: formatDate(s.createdAt),
            badge: <StatusBadge status={s.status} />,
          }))}
        />
        <RecentList
          title="Recent books"
          icon={BookOpen}
          linkTo="/admin/books"
          empty="No books in the catalog yet."
          items={recentBooks.map((b) => ({
            id: String(b.id),
            primary: b.title,
            secondary: `${b.author} · ISBN ${b.isbn}`,
            meta: formatDate(b.createdAt),
            badge: <StatusBadge status={b.status} />,
          }))}
        />
      </section>

      {/* ── Recent orders ── */}
      <RecentOrdersList orders={recentOrders} customers={customers} />
    </div>
  );
}

// ── Impersonation panel 

function ImpersonationPanel({
  isImpersonating,
  approvedSellers,
  customers,
  onImpersonateSeller,
  onImpersonateCustomer,
}: {
  isImpersonating: boolean;
  approvedSellers: Seller[];
  customers: Customer[];
  onImpersonateSeller: (s: Seller) => void;
  onImpersonateCustomer: (c: Customer) => void;
}) {
  return (
    <section
      aria-label="Quick impersonation"
      className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-6 shadow-sm"
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
            <LogIn className="h-5 w-5 text-indigo-700" />
            Login as a user
          </h2>
          <p className="text-sm text-slate-600">
            Jump into any approved seller or customer account to debug what
            they see in the marketplace. Use the yellow banner to exit.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
            isImpersonating
              ? "bg-amber-100 text-amber-900"
              : "bg-indigo-100 text-indigo-800"
          )}
        >
          {isImpersonating
            ? "Already impersonating"
            : `${approvedSellers.length + customers.length} users available`}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Approved sellers ({approvedSellers.length})
          </p>
          {approvedSellers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
              No approved sellers yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {approvedSellers.slice(0, 4).map((s) => (
                <li
                  key={String(s.id)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {s.businessName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {s.contactPerson} · {s.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onImpersonateSeller(s)}
                    disabled={isImpersonating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Login as
                  </button>
                </li>
              ))}
            </ul>
          )}
          {approvedSellers.length > 4 && (
            <Link
              to="/admin/sellers"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800"
            >
              View all sellers <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Customers ({customers.length})
          </p>
          {customers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
              No customers yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {customers.slice(0, 4).map((c) => (
                <li
                  key={String(c.id)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {c.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onImpersonateCustomer(c)}
                    disabled={isImpersonating}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Login as
                  </button>
                </li>
              ))}
            </ul>
          )}
          {customers.length > 4 && (
            <Link
              to="/admin/customers"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800"
            >
              View all customers <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {isImpersonating && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
          Exit the current impersonation session from the banner above before
          logging in as someone else.
        </p>
      )}
    </section>
  );
}

// Reusable pieces 

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: typeof Store;
  tone: "amber" | "emerald" | "indigo" | "rose";
  to: string;
  empty: boolean;
  emptyLabel: string;
  children?: React.ReactNode;
}

function ActionCard({
  title,
  subtitle,
  icon: Icon,
  tone,
  to,
  empty,
  emptyLabel,
  children,
}: ActionCardProps) {
  const toneMap = {
    amber: "bg-amber-100 text-amber-800",
    emerald: "bg-emerald-100 text-emerald-800",
    indigo: "bg-indigo-100 text-indigo-800",
    rose: "bg-rose-100 text-rose-800",
  } as const;

  return (
    <section
      className={cn(
        "rounded-2xl border p-6 shadow-sm",
        empty ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50/40"
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                toneMap[tone]
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            {title}
          </h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
        <Link
          to={to}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Review <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {empty ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          <AlertCircle className="h-4 w-4 text-emerald-500" />
          {emptyLabel}
        </div>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </section>
  );
}

function PipelineTile({
  status,
  count,
  icon: Icon,
}: {
  status: string;
  count: number;
  icon: typeof Clock3;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <StatusBadge status={status as never} />
        <p className="mt-1 text-2xl font-extrabold leading-none text-slate-900">
          {count}
        </p>
      </div>
    </div>
  );
}

interface RecentItem {
  id: string;
  primary: string;
  secondary: string;
  meta?: string;
  badge?: React.ReactNode;
}

function RecentList({
  title,
  icon: Icon,
  linkTo,
  items,
  empty,
}: {
  title: string;
  icon: typeof Store;
  linkTo: string;
  items: RecentItem[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Icon className="h-5 w-5 text-amber-700" />
          {title}
        </h2>
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-900"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          {empty}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {it.primary}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {it.secondary}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {it.meta && (
                  <span className="hidden text-xs text-slate-400 sm:block">
                    {it.meta}
                  </span>
                )}
                {it.badge}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RecentOrdersList({
  orders,
  customers,
}: {
  orders: Order[];
  customers: { id?: string | number; firstName: string; lastName: string }[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <ShoppingBag className="h-5 w-5 text-amber-700" />
          Recent orders
        </h2>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1 text-sm font-bold text-amber-800 hover:text-amber-900"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No orders have been placed yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => {
                const customer = customers.find(
                  (c) => String(c.id) === String(o.customerId)
                );
                const customerName = customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : "—";
                return (
                  <tr key={String(o.id)} className="text-slate-700">
                    <td className="py-3 font-bold text-slate-900">
                      #{String(o.id)}
                    </td>
                    <td className="py-3">{customerName}</td>
                    <td className="py-3">{formatCurrency(o.total)}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 text-slate-500">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
