import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ArrowLeft, LogIn } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation";
import type { AuthUser, LoginInput } from "@/types";

interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
}

const initialValues: LoginInput = { email: "", password: "" };

export default function LoginPage({
  onNavigateHome,
  onNavigateRegister,
}: LoginPageProps) {
  const navigate = useNavigate();

  const routeForRole = (user: AuthUser) => {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "seller") navigate("/seller");
    else navigate("/account");
  };

  const loginMutation = useLogin(routeForRole);

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
            <p className="mt-3 text-white/75">Sign in to your account.</p>
          </div>

          <div className="p-6 md:p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={(values) => loginMutation.mutate(values)}
            >
              <Form className="space-y-5" noValidate>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Email
                  </span>
                  <Field
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm font-medium text-red-600"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Password / Mobile Number
                  </span>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Your password or mobile number"
                    autoComplete="current-password"
                    className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm font-medium text-red-600"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 px-5 py-3.5 font-bold text-white shadow-lg shadow-amber-200 transition hover:from-amber-800 hover:to-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loginMutation.isPending ? "Signing in..." : "Login"}
                </button>
              </Form>
            </Formik>

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
