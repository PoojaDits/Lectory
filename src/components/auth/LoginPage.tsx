import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation";
import type { AuthUser, LoginInput } from "@/types";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginPageProps {
  onNavigateRegister: () => void;
}

const initialValues: LoginInput = { email: "", password: "" };

export default function LoginPage({ onNavigateRegister }: LoginPageProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const routeForRole = (user: AuthUser) => {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "seller") navigate("/seller");
    else navigate("/account");
  };

  const loginMutation = useLogin(routeForRole);

  const handleSubmit = (values: LoginInput) => {
    setLoginError("");
    loginMutation.mutate(values, {
      onError: (error) => {
        const msg = error.message || "Login failed. Please check your credentials.";
        if (msg.includes("pending approval")) {
          setLoginError("Your seller account is still pending admin approval. Please wait for confirmation before logging in.");
        } else if (msg.includes("rejected")) {
          setLoginError("Your seller account has been rejected. Please contact support for more information.");
        } else if (msg.includes("No account found")) {
          setLoginError("No account found with this email. Please check your email or register a new account.");
        } else if (msg.includes("Incorrect password")) {
          setLoginError("Incorrect password. Please try again or reset your password.");
        } else {
          setLoginError(msg);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-[1024px] w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden h-auto md:h-[700px]">
        
        {/* LEFT IMAGE */}
        <div className="relative hidden md:block">
          <img src="/booklovers.jpeg" alt="Library" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 p-2 shadow-lg shadow-amber-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Lectory</span>
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tighter mb-4">
              FIND YOUR NEXT<br />GREAT READ
            </h1>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-10 flex flex-col justify-center h-full overflow-y-auto">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Welcome Back!</h2>
            <p className="text-slate-500 mb-8">Sign in to your account</p>

            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                        errors.email && touched.email
                          ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 bg-white focus:border-amber-500 focus:ring-amber-100"
                      }`}
                    />
                    <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <div className="relative mt-1">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        className={`w-full rounded-2xl border pr-11 pl-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.password && touched.password
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 bg-white focus:border-amber-500 focus:ring-amber-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

                  {/* Login Error Message */}
                  {loginError && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                      {loginError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || loginMutation.isPending}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#e05c3c] text-white font-semibold text-sm hover:bg-[#c44e32] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting || loginMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-[#e05c3c] font-semibold hover:underline"
              >
                Register
              </button>
            </p>

        
          </div>
        </div>
      </div>
    </div>
  );
}
