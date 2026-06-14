import { useState, type FormEvent } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { login } from "@/services/authApi";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserRole } from "@/types";

interface LoginPageProps {
    onNavigateHome: () => void;
    onLoginSuccess: (role: UserRole) => void;
    onNavigateRegister: () => void;
}

interface StatusMessage {
    type: "success" | "error";
    text: string;
}

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Something went wrong. Please try again.";

export default function LoginPage({
    onNavigateHome,
    onLoginSuccess,
    onNavigateRegister,
}: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<StatusMessage | null>(null);

    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const user = await login({ email, password });
            setUser(user);
            setMessage({ type: "success", text: `Welcome back, ${user.name ?? user.email}.` });
            onLoginSuccess(user.role);
        } catch (error) {
            setMessage({ type: "error", text: getErrorMessage(error) });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pb-16 pt-24">
            <div className="mx-auto max-w-xl">
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to store
                </button>

                <section className="overflow-hidden rounded-[2rem] border border-amber-100 bg-white shadow-2xl shadow-amber-100">
                    <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-orange-900 p-8 text-white md:p-10">
                        <div className="mb-5 inline-flex rounded-2xl bg-white/10 p-3 ring-1 ring-white/20">
                            <LogIn className="h-8 w-8" />
                        </div>
                        <p className="section-header-badge text-amber-100">Sign in</p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                            Welcome to Lectory
                        </h1>
                        <p className="mt-3 text-white/75">
                            Sign in to your account.
                        </p>
                    </div>

                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Password / Mobile Number</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    placeholder="Your password or mobile number"
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                                />
                            </label>

                            {message && (
                                <div
                                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${message.type === "success"
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                            : "border-red-200 bg-red-50 text-red-700"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 px-5 py-3.5 font-bold text-white shadow-lg shadow-amber-200 transition hover:from-amber-800 hover:to-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Signing in..." : "Login"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600">
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={onNavigateRegister}
                                className="font-bold text-amber-800 underline-offset-2 hover:underline"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
