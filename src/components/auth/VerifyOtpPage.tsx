import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { useResendOtp, useVerifyOtp } from "@/hooks/useAuth";
import { resetPassword } from "@/services/authApi";
import { notify } from "@/lib/toast";
import type {
  CustomerRegistrationInput,
  SellerRegistrationInput,
} from "@/types";

interface VerifyOtpState {
  mode?: "register" | "reset";
  role?: "customer" | "seller";
  values?: CustomerRegistrationInput | SellerRegistrationInput;
  email?: string;
}

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as VerifyOtpState | null;

  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // Password reset step state (only used when mode === "reset")
  const [resetStep, setResetStep] = useState<"otp" | "password">("otp");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  if (!state) {
    return <Navigate to="/login" replace />;
  }

  const mode = state.mode ?? "register";
  const role = state.role ?? "customer";
  const values = state.values;

  const customerValues = role === "customer" && values ? (values as CustomerRegistrationInput) : null;
  const sellerValues = role === "seller" && values ? (values as SellerRegistrationInput) : null;

  const contactTarget =
    state.email ??
    (mode === "reset"
      ? undefined
      : role === "customer"
        ? customerValues?.email
        : sellerValues?.email);

  // Handler 1: Verify OTP against backend /auth/verify-otp
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = state.email ?? contactTarget;

    if (!email) {
      setOtpError("Email is missing. Please go back and register again.");
      return;
    }

    setOtpError("");

    if (mode === "reset") {
      // Password reset OTP is verified together with the new password in /auth/reset-password.
      notify.success("OTP captured. Please create your new password.");
      setResetStep("password");
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ email, otp: otpInput });
      if (role === "seller") {
        notify.info("Your seller account is verified and pending admin approval.");
      }
      navigate("/login");
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "Invalid or expired OTP.");
    }
  };

  // Handler 2: Save New Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPassError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("Passwords do not match.");
      return;
    }

    setPassError("");
    setIsUpdating(true);

    try {
      if (!state.email) {
        setPassError("Email is missing. Please restart password recovery.");
        return;
      }
      await resetPassword(state.email, otpInput, newPassword);
      notify.success("Password updated successfully! You can now log in. 🎉");
      navigate("/login");
    } catch (err) {
      setPassError(err instanceof Error ? err.message : "Failed to update password. Is the API server running?");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── VIEW 2: Set New Password (Reset Mode Only) ──
  if (mode === "reset" && resetStep === "password") {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-[1024px] w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[580px] md:h-[700px]">
          
          {/* LEFT BRANDING IMAGE */}
          <div className="relative hidden md:block">
            <img src="/booklovers.jpeg" alt="Library Book Lovers" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />
            <div className="absolute bottom-0 left-0 p-10 text-white flex flex-col justify-end h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-2.5 shadow-lg shadow-primary-950/50">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight">Lectory</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-none tracking-tighter mb-4 uppercase">
                SET NEW<br />PASSWORD
              </h1>
              <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                Your identity is confirmed. Set your new security credentials below to immediately overwrite your old stored record.
              </p>
            </div>
          </div>

          {/* RIGHT NEW PASSWORD FORM */}
          <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center h-full overflow-y-auto">
            
            <div className="mb-6 flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shrink-0 shadow-xs border border-emerald-200">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  Create Password
                </h2>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Step 2: Update Credentials
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Enter your new security password below. Once saved, your old database credentials will be permanently overwritten.
            </p>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passError) setPassError("");
                    }}
                    className="w-full rounded-2xl border border-secondary-200 py-3.5 pl-4 pr-11 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
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

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Confirm New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passError) setPassError("");
                    }}
                    className="w-full rounded-2xl border border-secondary-200 py-3.5 pl-4 pr-11 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
                  />
                </div>
              </div>

              {passError && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating || !newPassword || !confirmPassword}
                className="w-full mt-6 py-4 rounded-2xl bg-[#e05c3c] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#e05c3c]/20 hover:bg-[#c44e32] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Database…</span>
                  </>
                ) : (
                  <span>Save New Password & Login →</span>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  // ── VIEW 1: Verify OTP Code ──
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-[1024px] w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[580px] md:h-[700px]">
        
        {/* LEFT BRANDING IMAGE */}
        <div className="relative hidden md:block">
          <img
            src="/booklovers.jpeg"
            alt="Library Book Lovers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />
          <div className="absolute bottom-0 left-0 p-10 text-white flex flex-col justify-end h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-2.5 shadow-lg shadow-primary-950/50">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Lectory</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black leading-none tracking-tighter mb-4 uppercase">
              VERIFY YOUR<br />IDENTITY
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              One quick step to secure your {mode === "reset" ? "account recovery" : role === "customer" ? "reader" : "bookstore seller"} profile.
            </p>
          </div>
        </div>

        {/* RIGHT OTP VERIFICATION FORM */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center h-full overflow-y-auto">
          
          <button
            type="button"
            onClick={() => navigate(mode === "reset" ? "/forgot-password" : "/register")}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-700 transition w-fit mb-6 sm:mb-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="mb-6 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-800 shrink-0 shadow-xs border border-primary-200">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                Enter OTP Code
              </h2>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#e05c3c]">
                {mode === "reset" ? "Password Recovery" : role === "customer" ? "Reader Verification" : "Seller Verification"}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            We've sent a 6-digit confirmation security code to{" "}
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md break-all">{contactTarget}</span>.
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value.replace(/\D/g, ""));
                  if (otpError) setOtpError("");
                }}
                className={`w-full rounded-2xl border py-4 px-4 text-center font-mono text-2xl sm:text-3xl font-black tracking-[0.3em] sm:tracking-[0.45em] outline-none transition-all shadow-inner ${
                  otpError
                    ? "border-rose-400 bg-rose-50/60 text-rose-600 focus:ring-4 focus:ring-rose-100"
                    : "border-secondary-200 bg-slate-50/50 text-slate-900 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-primary-100"
                }`}
              />

              {otpError && (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* <div className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-100/60 border border-primary-200/80 px-3.5 py-2 text-xs font-bold text-primary-900 w-full text-center">
                <span>💡 Demo Hint: Enter code <span className="font-mono tracking-wider font-black text-amber-900 bg-primary-200 px-1.5 py-0.5 rounded">123456</span></span>
              </div> */}
            </div>

            <button
              type="submit"
              disabled={
                otpInput.length !== 6 ||
                verifyOtpMutation.isPending
              }
              className="w-full mt-4 py-4 rounded-2xl bg-[#e05c3c] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#e05c3c]/20 hover:bg-[#c44e32] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying Code…</span>
                </>
              ) : (
                <span>Verify Identity & Proceed →</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
            Didn't receive the verification email?{" "}
            <button
              type="button"
              disabled={resendOtpMutation.isPending || !contactTarget}
              onClick={() => contactTarget && resendOtpMutation.mutate(contactTarget)}
              className="font-bold text-[#e05c3c] hover:underline transition cursor-pointer ml-1 disabled:opacity-50"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend OTP Code"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
