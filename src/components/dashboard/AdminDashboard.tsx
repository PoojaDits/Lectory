import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LogOut,
  ShieldCheck,
  Store,
  XCircle,
} from "lucide-react";
import { fetchSellers, updateSellerStatus } from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";
import type { EntityId, Seller, SellerStatus } from "@/types";

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

interface DashboardMessage {
  type: "success" | "error";
  text: string;
}

const statusClasses: Record<SellerStatus, string> = {
  "Pending Approval": "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

const formatDate = (value?: string) => {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function AdminDashboard({
  onNavigateHome,
  onLogin,
}: AdminDashboardProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<EntityId | null>(null);
  const [message, setMessage] = useState<DashboardMessage | null>(null);

  const sellerCounts = useMemo(
    () => ({
      pending: sellers.filter((seller) => seller.status === "Pending Approval").length,
      approved: sellers.filter((seller) => seller.status === "Approved").length,
      rejected: sellers.filter((seller) => seller.status === "Rejected").length,
    }),
    [sellers]
  );

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      return;
    }

    let isMounted = true;

    const loadSellers = async () => {
      setIsLoading(true);
      setMessage(null);

      try {
        const data = await fetchSellers();
        if (isMounted) {
          setSellers(data);
        }
      } catch (error) {
        if (isMounted) {
          setMessage({ type: "error", text: getErrorMessage(error) });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSellers();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  const handleStatusChange = async (seller: Seller, status: SellerStatus) => {
    if (seller.id === undefined || seller.id === null) {
      setMessage({ type: "error", text: "Seller id is missing." });
      return;
    }

    setActionId(seller.id);
    setMessage(null);

    try {
      const updatedSeller = await updateSellerStatus(seller.id, status);
      setSellers((previous) =>
        previous.map((item) =>
          String(item.id) === String(updatedSeller.id) ? updatedSeller : item
        )
      );
      setMessage({
        type: "success",
        text: `${updatedSeller.businessName} marked as ${status}.`,
      });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setActionId(null);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-amber-50 px-4 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-amber-100">
          <ShieldCheck className="mx-auto h-14 w-14 text-amber-700" />
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Admin login required
          </h1>
          <p className="mt-2 text-slate-500">
            Please login with the predefined JSON Server admin account to review sellers.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 rounded-full bg-amber-900 px-6 py-3 font-bold text-white hover:bg-amber-800"
          >
            Go to Admin Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-2xl shadow-amber-100">
          <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-amber-800 p-8 text-white md:p-10">
            <p className="section-header-badge text-amber-100">Admin Approval</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Seller Review Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-white/75">
              Review registered sellers and choose Approved or Rejected. Only approved
              sellers can login to the seller dashboard.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-3 md:p-8">
            <div className="rounded-3xl bg-amber-50 p-6">
              <Clock3 className="h-8 w-8 text-amber-700" />
              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-amber-700">
                Pending Approval
              </p>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {sellerCounts.pending}
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-6">
              <CheckCircle2 className="h-8 w-8 text-emerald-700" />
              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-emerald-700">
                Approved
              </p>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {sellerCounts.approved}
              </p>
            </div>
            <div className="rounded-3xl bg-red-50 p-6">
              <XCircle className="h-8 w-8 text-red-700" />
              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-red-700">
                Rejected
              </p>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {sellerCounts.rejected}
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`mx-6 mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold md:mx-8 ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="px-6 pb-8 md:px-8">
            {isLoading ? (
              <div className="rounded-3xl bg-amber-50 p-8 text-center font-bold text-amber-900">
                Loading sellers...
              </div>
            ) : sellers.length === 0 ? (
              <div className="rounded-3xl bg-amber-50 p-8 text-center">
                <Store className="mx-auto h-10 w-10 text-amber-700" />
                <p className="mt-3 font-bold text-slate-900">No sellers registered yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-amber-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-amber-100 text-left text-sm">
                    <thead className="bg-amber-50 text-xs uppercase tracking-wide text-amber-900">
                      <tr>
                        <th className="px-5 py-4 font-black">Business</th>
                        <th className="px-5 py-4 font-black">Contact</th>
                        <th className="px-5 py-4 font-black">Email</th>
                        <th className="px-5 py-4 font-black">Mobile</th>
                        <th className="px-5 py-4 font-black">Status</th>
                        <th className="px-5 py-4 font-black">Registered</th>
                        <th className="px-5 py-4 font-black">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 bg-white">
                      {sellers.map((seller) => (
                        <tr key={seller.id ?? seller.email} className="hover:bg-amber-50/40">
                          <td className="px-5 py-4 font-bold text-slate-900">
                            {seller.businessName}
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {seller.contactPerson}
                          </td>
                          <td className="px-5 py-4 text-slate-600">{seller.email}</td>
                          <td className="px-5 py-4 text-slate-600">
                            {seller.mobileNumber}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses[seller.status]}`}
                            >
                              {seller.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {formatDate(seller.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={
                                  seller.status === "Approved" ||
                                  actionId === seller.id ||
                                  seller.id === undefined
                                }
                                onClick={() => handleStatusChange(seller, "Approved")}
                                className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={
                                  seller.status === "Rejected" ||
                                  actionId === seller.id ||
                                  seller.id === undefined
                                }
                                onClick={() => handleStatusChange(seller, "Rejected")}
                                className="rounded-full bg-red-600 px-3 py-2 text-xs font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
