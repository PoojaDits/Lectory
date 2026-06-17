import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation";
import type { AuthUser, LoginInput } from "@/types";

interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
}

const initialValues: LoginInput = { email: "", password: "" };

export default function LoginPage({ onNavigateHome, onNavigateRegister }: LoginPageProps) {
  const navigate = useNavigate();
  const routeForRole = (user: AuthUser) => {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "seller") navigate("/seller");
    else navigate("/account");
  };
  const loginMutation = useLogin(routeForRole);

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden h-[700px]">
        
        {/* LEFT IMAGE */}
        <div className="relative hidden md:block">
          <img src="/booklovers.jpeg" alt="Library" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center"><span className="text-xl">📚</span></div>
              <span className="font-bold text-2xl tracking-tight">Lectory</span>
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tighter mb-4">FIND YOUR NEXT<br />GREAT READ</h1>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-10 flex flex-col justify-center h-full">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Welcome Back!</h2>
            <p className="text-slate-500 mb-8">Sign in to your account</p>

            <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={(v) => loginMutation.mutate(v)}>
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Field name="email" type="email" placeholder="you@example.com" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Field name="password" type="password" placeholder="Your password" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-3.5 rounded-2xl bg-[#e05c3c] text-white font-semibold text-sm">
                    {isSubmitting ? "Signing in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account? <button onClick={onNavigateRegister} className="text-[#e05c3c] font-semibold">Register</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
