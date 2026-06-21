import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Package,
  Search,
  ShieldCheck,
  Store,
  UserCircle,
  Users,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useBooks,
  useCustomers,
  useDashboardSummary,
  useSellers,
  useUpdateBookStatus,
  useUpdateSellerStatus,
} from "@/hooks/useAdmin";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { notify } from "@/lib/toast";
import { formatDate, sameId } from "@/utils/helpers";
import type { AuthUser, Customer, MarketBook, Seller } from "@/types";

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

type Tab = "overview" | "sellers" | "books" | "customers";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sellers", label: "Sellers", icon: Store },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "customers", label: "Customers", icon: Users },
];

// Map a profile row into an AuthUser for impersonation.
const sellerToAuthUser = (s: Seller): AuthUser => ({
  id: s.id,
  email: s.email,
  role: "seller",
  name: s.contactPerson,
  businessName: s.businessName,
  contactPerson: s.contactPerson,
  mobileNumber: s.mobileNumber,
  status: s.status,
  createdAt: s.createdAt,
  reviewedAt: s.reviewedAt,
});

const customerToAuthUser = (c: Customer): AuthUser => ({
  id: c.id,
  email: c.email,
  role: "customer",
  name: `${c.firstName} ${c.lastName}`.trim(),
  createdAt: c.createdAt,
});

export default function AdminDashboard({
  onNavigateHome,
  onLogin,
}: AdminDashboardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const impersonate = useAuthStore((s) => s.impersonate);
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");

  const { data: summary } = useDashboardSummary();
  const { data: sellers = [], isLoading: sellersLoading } = useSellers();
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();

  const updateSeller = useUpdateSellerStatus();
  const updateBook = useUpdateBookStatus();

  const q = search.trim().toLowerCase();

  const filteredSellers = useMemo(
    () =>
      sellers.filter(
        (s) =>
          s.businessName.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      ),
    [sellers, q]
  );

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn ?? "").toLowerCase().includes(q)
      ),
    [books, q]
  );

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      ),
    [customers, q]
  );

  const handleImpersonate = (user: AuthUser) => {
    // Flush URL change + role change in a single render so ProtectedRoute
    // never evaluates the still-admin URL with the new seller/customer
    // role. See useImpersonation for the full explanation.
    flushSync(() => {
      navigate(user.role === "seller" ? "/seller" : "/account");
      impersonate(user);
    });
    notify.success(`Now viewing as ${user.name ?? user.email}.`);
  };

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  // ── Guard ──
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-amber-50 px-4 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-amber-100">
          <ShieldCheck className="mx-auto h-14 w-14 text-amber-700" />
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Admin access required
          </h1>
          <p className="mt-2 text-slate-500">
            Please log in with an admin account to manage the marketplace.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-900 px-6 py-3 font-bold text-white hover:bg-amber-800"
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        {/* Header */}
        <header className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl md:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Welcome, {currentUser.name ?? "Admin"}
          </h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Approve sellers and books, monitor marketplace statistics, and
            impersonate any user to troubleshoot their experience.
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === id
                  ? "bg-amber-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Total Sellers"
              value={summary?.totalSellers ?? "—"}
              icon={Store}
              tone="amber"
              hint={`${summary?.pendingSellers ?? 0} pending approval`}
            />
            <StatCard
              label="Total Customers"
              value={summary?.totalCustomers ?? "—"}
              icon={Users}
              tone="emerald"
            />
            <StatCard
              label="Total Books"
              value={summary?.totalBooks ?? "—"}
              icon={BookOpen}
              tone="indigo"
              hint={`${summary?.pendingBooks ?? 0} pending approval`}
            />
            <StatCard
              label="Total Orders"
              value={summary?.totalOrders ?? "—"}
              icon={Package}
              tone="blue"
            />
            <StatCard
              label="Pending Sellers"
              value={summary?.pendingSellers ?? "—"}
              icon={ListChecks}
              tone="rose"
            />
            <StatCard
              label="Pending Books"
              value={summary?.pendingBooks ?? "—"}
              icon={ListChecks}
              tone="slate"
            />
          </section>
        )}

        {/* Search bar for list tabs */}
        {tab !== "overview" && (
          <div className="relative mb-4 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>
        )}

        {/* ── Sellers ── */}
        {tab === "sellers" && (
          <TableCard
            empty={!sellersLoading && filteredSellers.length === 0}
            loading={sellersLoading}
            headers={["Business", "Contact", "Status", "Joined", "Actions"]}
          >
            {filteredSellers.map((s) => (
              <tr key={String(s.id)} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-900">{s.businessName}</p>
                  <p className="text-xs text-slate-500">{s.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{s.contactPerson}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {formatDate(s.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {s.status !== "Approved" && (
                      <ActionBtn
                        tone="emerald"
                        icon={CheckCircle2}
                        label="Approve"
                        onClick={() =>
                          updateSeller.mutate({ id: s.id!, status: "Approved" })
                        }
                      />
                    )}
                    {s.status !== "Rejected" && (
                      <ActionBtn
                        tone="rose"
                        icon={XCircle}
                        label="Reject"
                        onClick={() =>
                          updateSeller.mutate({ id: s.id!, status: "Rejected" })
                        }
                      />
                    )}
                    <ActionBtn
                      tone="slate"
                      icon={UserCircle}
                      label="View as"
                      onClick={() => handleImpersonate(sellerToAuthUser(s))}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </TableCard>
        )}

        {/* ── Books ── */}
        {tab === "books" && (
          <TableCard
            empty={!booksLoading && filteredBooks.length === 0}
            loading={booksLoading}
            headers={["Title", "Author", "ISBN", "Status", "Actions"]}
          >
            {filteredBooks.map((b: MarketBook) => (
              <tr key={String(b.id)} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold text-slate-900">{b.title}</td>
                <td className="px-4 py-3 text-slate-700">{b.author}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{b.isbn}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {b.status !== "Approved" && (
                      <ActionBtn
                        tone="emerald"
                        icon={CheckCircle2}
                        label="Approve"
                        onClick={() =>
                          updateBook.mutate({ id: b.id, status: "Approved" })
                        }
                      />
                    )}
                    {b.status !== "Rejected" && (
                      <ActionBtn
                        tone="rose"
                        icon={XCircle}
                        label="Reject"
                        onClick={() =>
                          updateBook.mutate({ id: b.id, status: "Rejected" })
                        }
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </TableCard>
        )}

        {/* ── Customers ── */}
        {tab === "customers" && (
          <TableCard
            empty={!customersLoading && filteredCustomers.length === 0}
            loading={customersLoading}
            headers={["Name", "Email", "Joined", "Actions"]}
          >
            {filteredCustomers.map((c) => (
              <tr key={String(c.id)} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold text-slate-900">
                  {c.firstName} {c.lastName}
                </td>
                <td className="px-4 py-3 text-slate-700">{c.email}</td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {formatDate(c.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <ActionBtn
                    tone="slate"
                    icon={UserCircle}
                    label="View as"
                    onClick={() => handleImpersonate(customerToAuthUser(c))}
                    disabled={sameId(c.id, currentUser.id)}
                  />
                </td>
              </tr>
            ))}
          </TableCard>
        )}
      </div>
    </main>
  );
}

// ── Small presentational helpers ──
function TableCard({
  headers,
  children,
  loading,
  empty,
}: {
  headers: string[];
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-slate-400">
                Loading...
              </td>
            </tr>
          ) : empty ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-slate-400">
                No records found.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  tone,
  disabled,
}: {
  icon: typeof CheckCircle2;
  label: string;
  onClick: () => void;
  tone: "emerald" | "rose" | "slate";
  disabled?: boolean;
}) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    slate: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
