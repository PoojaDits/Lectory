import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  KeyRound,
  Loader2,
} from "lucide-react";
import { forgotPassword } from "@/services/authApi";
import { notify } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setError("");
    setIsPending(true);

    try {
      await forgotPassword(cleanEmail);
      notify.info("Password reset OTP sent to your email.");
      navigate("/verify-otp", {
        state: { mode: "reset", email: cleanEmail },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-[1024px] w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[580px] md:h-[680px]">
        
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
              RECOVER YOUR<br />PASSWORD
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Forgot your credentials? We'll help you verify your identity and set a secure new password in seconds.
            </p>
          </div>
        </div>

        {/* RIGHT RECOVERY FORM */}
        <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center h-full overflow-y-auto">
          
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-700 transition w-fit mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>

          <div className="mb-6 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shrink-0 shadow-xs border border-amber-200">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                Forgot Password
              </h2>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#e05c3c]">
                Account Recovery
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Enter the email associated with your Lectory profile and we'll dispatch a 6-digit confirmation code.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary-700">Registered Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                  error
                    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                    : "border-secondary-200 bg-white focus:border-amber-500 focus:ring-primary-100"
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !email.trim()}
              className="w-full mt-4 py-4 rounded-2xl bg-[#e05c3c] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#e05c3c]/20 hover:bg-[#c44e32] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Reset OTP…</span>
                </>
              ) : (
                <span>Send Reset OTP Code →</span>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
