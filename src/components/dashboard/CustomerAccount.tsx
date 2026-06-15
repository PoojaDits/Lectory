import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  LogOut,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatDate } from "@/utils/helpers";

interface CustomerAccountProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

export default function CustomerAccount({
  onNavigateHome,
  onLogin,
}: CustomerAccountProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  // ── Guard ──
  if (!currentUser || currentUser.role !== "customer") {
    return (
      <main className="min-h-screen bg-amber-50 px-4 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-amber-100">
          <UserCircle className="mx-auto h-14 w-14 text-amber-700" />
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Customer login required
          </h1>
          <p className="mt-2 text-slate-500">
            Please log in as a customer to view your account.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 rounded-full bg-amber-900 px-6 py-3 font-bold text-white hover:bg-amber-800"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </button>
          {!isImpersonating && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        {/* Header */}
        <section className="overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-2xl shadow-amber-100">
          <div className="bg-gradient-to-r from-amber-900 to-orange-800 p-8 text-white md:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-100">
              Customer Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Welcome, {currentUser.name}
            </h1>
            <p className="mt-2 max-w-2xl text-white/75">
              Browse the marketplace, manage your cart, and track your orders.
            </p>
          </div>

          {/* Profile cards */}
          <div className="grid gap-5 p-6 md:grid-cols-3 md:p-8">
            <InfoCard
              icon={Mail}
              tone="bg-amber-50 text-amber-700"
              label="Account Email"
              value={currentUser.email}
            />
            <InfoCard
              icon={ShieldCheck}
              tone="bg-emerald-50 text-emerald-700"
              label="Role"
              value="Customer"
            />
            <InfoCard
              icon={UserCircle}
              tone="bg-slate-100 text-slate-700"
              label="Member Since"
              value={formatDate(currentUser.createdAt)}
            />
          </div>
        </section>

        {/* Quick actions */}
        <h2 className="mb-4 mt-10 text-lg font-black text-slate-900">
          Quick Actions
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <ActionTile
            to="/browse"
            icon={BookOpen}
            title="Browse Books"
            desc="Explore the full catalog and compare sellers."
            tone="from-indigo-500 to-blue-600"
          />
          <ActionTile
            to="/cart"
            icon={ShoppingCart}
            title="My Cart"
            desc="Review the items you've added before checkout."
            tone="from-amber-500 to-orange-600"
          />
          <ActionTile
            to="/account/orders"
            icon={Package}
            title="My Orders"
            desc="Track order status and view your history."
            tone="from-emerald-500 to-teal-600"
          />
        </div>

        {/* Empty-state hint */}
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-200 bg-white/60 p-10 text-center">
          <ShoppingBag className="h-10 w-10 text-amber-400" />
          <p className="mt-3 font-bold text-slate-700">
            Ready to find your next great read?
          </p>
          <Link
            to="/browse"
            className="mt-4 rounded-full bg-amber-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-800"
          >
            Start Browsing
          </Link>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof Mail;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-slate-50 p-6">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function ActionTile({
  to,
  icon: Icon,
  title,
  desc,
  tone,
}: {
  to: string;
  icon: typeof BookOpen;
  title: string;
  desc: string;
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-md`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-900 group-hover:text-amber-700">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </Link>
  );
}
