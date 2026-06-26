import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { fetchUserByEmail, resetUserPassword } from "@/services/authApi";
import { notify } from "@/lib/toast";

export default function ChangePasswordTab() {
  const currentUser = useAuthStore((s) => s.currentUser);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Pre-fetch stored user record to surface demo password hint
  const { data: userRecord } = useQuery({
    queryKey: ["users", currentUser?.email],
    queryFn: () => fetchUserByEmail(currentUser!.email),
    enabled: Boolean(currentUser?.email),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) {
      setError("Active user session missing.");
      return;
    }

    if (!currentPass || !newPass || !confirmPass) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPass.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPass === newPass) {
      setError("New password must be different from your current password.");
      return;
    }

    setError("");
    setIsPending(true);

    try {
      const uRecord = await fetchUserByEmail(currentUser.email);
      if (!uRecord) {
        setError("User credentials record not found in database.");
        return;
      }

      if (uRecord.password !== currentPass) {
        setError("Incorrect current password. Please try again.");
        return;
      }

      await resetUserPassword(uRecord.id, newPass);
      notify.success("Password changed successfully! Database updated. 🔐");
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setError("Network error occurred. Is the JSON backend server running?");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-secondary-200/80 bg-white p-6 sm:p-10 shadow-sm">
      <div className="mb-6 flex items-center gap-3.5 border-b border-secondary-100 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-800 shadow-xs border border-primary-200 shrink-0">
          <KeyRound className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-secondary-900 leading-tight">
            Change Security Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Updating password for session: <span className="font-bold text-primary-900 bg-primary-100 px-2 py-0.5 rounded-md break-all">{currentUser?.email}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter current stored password"
              autoComplete="current-password"
              value={currentPass}
              onChange={(e) => {
                setCurrentPass(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-2xl border border-secondary-200 py-3.5 pl-4 pr-11 text-sm font-medium outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter new strong password"
              autoComplete="new-password"
              value={newPass}
              onChange={(e) => {
                setNewPass(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-2xl border border-secondary-200 py-3.5 px-4 text-sm font-medium outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
            />
            <p className="text-[11px] text-slate-400 mt-1 pl-1">Must be at least 6 characters long</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Repeat new password"
              autoComplete="new-password"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-2xl border border-secondary-200 py-3.5 px-4 text-sm font-medium outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !currentPass || !newPass || !confirmPass}
          className="w-full mt-6 py-4 rounded-2xl bg-[#e05c3c] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#e05c3c]/20 hover:bg-[#c44e32] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying & Updating Database…</span>
            </>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Save New Password
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
