import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  KeyRound,
  Loader2,
} from "lucide-react";
import { useRegisterCustomer, useRegisterSeller } from "@/hooks/useAuth";
import { notify } from "@/lib/toast";
import type {
  CustomerRegistrationInput,
  SellerRegistrationInput,
} from "@/types";

interface VerifyOtpState {
  role: "customer" | "seller";
  values: CustomerRegistrationInput | SellerRegistrationInput;
}

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as VerifyOtpState | null;

  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  const registerCustomer = useRegisterCustomer();
  const registerSeller = useRegisterSeller();

  if (!state || !state.role || !state.values) {
    return <Navigate to="/register" replace />;
  }

  const { role, values } = state;
  const customerValues = role === "customer" ? (values as CustomerRegistrationInput) : null;
  const sellerValues = role === "seller" ? (values as SellerRegistrationInput) : null;

  const contactTarget =
    role === "customer"
      ? customerValues?.email
      : sellerValues?.email || sellerValues?.mobileNumber;

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== "123456") {
      setOtpError("Invalid verification code. Please enter 123456.");
      return;
    }
    setOtpError("");

    if (role === "customer" && customerValues) {
      registerCustomer.mutate(customerValues, {
        onSuccess: () => {
          notify.success("OTP Verified! Your account has been created successfully.");
          navigate("/login");
        },
      });
    } else if (role === "seller" && sellerValues) {
      registerSeller.mutate(sellerValues, {
        onSuccess: () => {
          notify.success("OTP Verified! Seller account submitted for admin approval.");
          navigate("/login");
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-[1024px] w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[580px] md:h-[700px]">
        
        {/* LEFT BRANDING IMAGE (Matches LoginPage / RegistrationPage) */}
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
              One quick step to secure your {role === "customer" ? "reader" : "bookstore seller"} profile and start exploring our curated catalog.
            </p>
          </div>
        </div>

        {/* RIGHT OTP VERIFICATION FORM */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center h-full overflow-y-auto">
          
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-700 transition w-fit mb-6 sm:mb-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Form
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
                {role === "customer" ? "Reader Verification" : "Seller Verification"}
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

              <div className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-100/60 border border-primary-200/80 px-3.5 py-2 text-xs font-bold text-primary-900 w-full text-center">
                <span>💡 Demo Hint: Enter code <span className="font-mono tracking-wider font-black text-amber-900 bg-primary-200 px-1.5 py-0.5 rounded">123456</span></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                otpInput.length !== 6 ||
                registerCustomer.isPending ||
                registerSeller.isPending
              }
              className="w-full mt-4 py-4 rounded-2xl bg-[#e05c3c] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#e05c3c]/20 hover:bg-[#c44e32] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {registerCustomer.isPending || registerSeller.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying & Creating Profile…</span>
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
              onClick={() => notify.info("Resent fresh verification OTP: 123456")}
              className="font-bold text-[#e05c3c] hover:underline transition cursor-pointer ml-1"
            >
              Resend OTP Code
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
