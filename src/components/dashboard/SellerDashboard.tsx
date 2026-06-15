import {
  ArrowLeft,
  Boxes,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  Package,
  Store,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/utils/helpers";

interface SellerDashboardProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

export default function SellerDashboard({
  onNavigateHome,
  onLogin,
}: SellerDashboardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  // ── Guard ──
  if (!currentUser || currentUser.role !== "seller") {
    return (
      <main className="min-h-screen bg-emerald-50 px-4 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <Store className="mx-auto h-14 w-14 text-emerald-700" />
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Seller access required
          </h1>
          <p className="mt-2 text-slate-500">
            Please log in with an approved seller account.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
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
        <header className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white shadow-xl md:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Seller Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            {currentUser.businessName ?? currentUser.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-white/80">
            <span>Contact: {currentUser.contactPerson ?? currentUser.name}</span>
            {currentUser.status && <StatusBadge status={currentUser.status} />}
          </div>
        </header>

        {/* Profile + placeholder modules */}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <Store className="h-8 w-8 text-emerald-700" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
              Email
            </p>
            <p className="mt-1 break-all font-black text-slate-900">
              {currentUser.email}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Mobile
            </p>
            <p className="mt-1 font-black text-slate-900">
              {currentUser.mobileNumber ?? "—"}
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Joined
            </p>
            <p className="mt-1 font-black text-slate-900">
              {formatDate(currentUser.createdAt)}
            </p>
          </div>

          <ModuleCard
            icon={LayoutDashboard}
            title="Listings"
            desc="Create and manage your book listings. (Coming in the Seller module.)"
          />
          <ModuleCard
            icon={Boxes}
            title="Inventory"
            desc="Update price and stock for each listing. (Coming soon.)"
          />
          <ModuleCard
            icon={Package}
            title="Orders"
            desc="View orders and advance their status. (Coming soon.)"
          />
          <ModuleCard
            icon={ListChecks}
            title="Add New Book"
            desc="Submit a new book for admin approval. (Coming soon.)"
          />
        </section>
      </div>
    </main>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Store;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
