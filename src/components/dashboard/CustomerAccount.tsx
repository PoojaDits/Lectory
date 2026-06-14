import { ArrowLeft, LogOut, ShoppingBag, UserCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface CustomerAccountProps {
    onNavigateHome: () => void;
    onLogin: () => void;
}

export default function CustomerAccount({
    onNavigateHome,
    onLogin,
}: CustomerAccountProps) {
    const currentUser = useAuthStore((state) => state.currentUser);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        onNavigateHome();
    };

    if (!currentUser || currentUser.role !== "customer") {
        return (
            <main className="min-h-screen bg-amber-50 px-4 pt-28">
                <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-amber-100">
                    <UserCircle className="mx-auto h-14 w-14 text-amber-700" />
                    <h1 className="mt-4 text-3xl font-black text-slate-900">
                        Customer login required
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Please login as a customer to view your account.
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
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pb-16 pt-28">
            <div className="mx-auto max-w-5xl">
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
                    <div className="bg-gradient-to-r from-amber-900 to-orange-800 p-8 text-white md:p-10">
                        <p className="section-header-badge text-amber-100">Customer Dashboard</p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                            Welcome, {currentUser.name}
                        </h1>
                        <p className="mt-3 max-w-2xl text-white/75">
                            You are logged in as a customer. Your customer registration and login data
                            is managed through JSON Server.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-3 md:p-8">
                        <div className="rounded-3xl bg-amber-50 p-6">
                            <UserCircle className="h-8 w-8 text-amber-700" />
                            <p className="mt-4 text-sm font-bold uppercase tracking-wide text-amber-700">
                                Account Email
                            </p>
                            <p className="mt-1 break-all text-lg font-black text-slate-900">
                                {currentUser.email}
                            </p>
                        </div>
                        <div className="rounded-3xl bg-emerald-50 p-6">
                            <ShoppingBag className="h-8 w-8 text-emerald-700" />
                            <p className="mt-4 text-sm font-bold uppercase tracking-wide text-emerald-700">
                                Shopping Access
                            </p>
                            <p className="mt-1 text-lg font-black text-slate-900">Enabled</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-6">
                            <UserCircle className="h-8 w-8 text-slate-700" />
                            <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-700">
                                Role
                            </p>
                            <p className="mt-1 text-lg font-black capitalize text-slate-900">
                                {currentUser.role}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
