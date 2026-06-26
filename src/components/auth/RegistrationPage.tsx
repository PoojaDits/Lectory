import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  customerRegistrationSchema,
  sellerRegistrationSchema,
} from "@/lib/validation";
import type {
  CustomerRegistrationInput,
  SellerRegistrationInput,
} from "@/types";
import {
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { notify } from "@/lib/toast";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [showPassword, setShowPassword] = useState(false);

  const customerInitial: CustomerRegistrationInput = {
    firstName: "", lastName: "", email: "", password: "",
  };

  const sellerInitial: SellerRegistrationInput = {
    businessName: "", contactPerson: "", email: "", mobileNumber: "", password: "",
  };

  const handleCustomerSubmit = (values: CustomerRegistrationInput) => {
    notify.info("Verification OTP sent: 123456");
    navigate("/verify-otp", { state: { role: "customer", values } });
  };

  const handleSellerSubmit = (values: SellerRegistrationInput) => {
    notify.info("Verification OTP sent: 123456");
    navigate("/verify-otp", { state: { role: "seller", values } });
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-6">
      <div className="max-w-[1024px] w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden h-auto md:h-[720px]">
        
        {/* LEFT IMAGE */}
        <div className="relative hidden md:block">
          <img src="/booklovers.jpeg" alt="Library" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-2 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Lectory</span>
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tighter mb-4">
              {role === "customer" ? "START YOUR READING JOURNEY" : "SELL YOUR BOOKS"}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              {role === "customer"
                ? "Join thousands of readers and discover your next favorite book."
                : "List your books and reach a wide audience of book lovers."}
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="pt-3 pb-6 px-8 md:px-10 flex flex-col h-full overflow-y-auto">
          {/* Role Tabs */}
          <div className="flex bg-secondary-100 rounded-full p-1 mb-4 w-fit">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                role === "customer" ? "bg-white shadow text-secondary-900" : "text-slate-500 hover:text-secondary-700"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                role === "seller" ? "bg-white shadow text-secondary-900" : "text-slate-500 hover:text-secondary-700"
              }`}
            >
              Seller
            </button>
          </div>

          {/* CUSTOMER FORM */}
          {role === "customer" && (
            <Formik
              initialValues={customerInitial}
              validationSchema={customerRegistrationSchema}
              onSubmit={handleCustomerSubmit}
            >
              {({ isValid, dirty, errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Create Your Account</h2>
                    <p className="text-sm text-slate-500">Join as a customer and start reading</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">First Name</label>
                      <Field
                        name="firstName"
                        className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.firstName && touched.firstName
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                        }`}
                      />
                      <ErrorMessage name="firstName" component="p" className="text-xs text-red-500 mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Last Name</label>
                      <Field
                        name="lastName"
                        className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.lastName && touched.lastName
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                        }`}
                      />
                      <ErrorMessage name="lastName" component="p" className="text-xs text-red-500 mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-700">Email</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                        errors.email && touched.email
                          ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                          : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                      }`}
                    />
                    <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-700">Password</label>
                    <div className="relative mt-1">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full rounded-2xl border pr-11 pl-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.password && touched.password
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary-600 transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                    <p className="text-[10px] text-slate-400 mt-1">At least 6 characters</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || !dirty}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#e05c3c] text-white font-semibold text-sm hover:bg-[#c44e32] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to OTP Verification →
                  </button>

                  <p className="text-center text-sm text-slate-500 mt-4">
                    Already registered?{" "}
                    <a href="/login" className="text-[#e05c3c] font-semibold hover:underline">
                      Login
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          )}

          {/* SELLER FORM */}
          {role === "seller" && (
            <Formik
              initialValues={sellerInitial}
              validationSchema={sellerRegistrationSchema}
              onSubmit={handleSellerSubmit}
            >
              {({ isValid, dirty, errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Become a Seller</h2>
                    <p className="text-sm text-slate-500">List and sell your books on our marketplace</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-700">Business Name</label>
                    <Field
                      name="businessName"
                      className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                        errors.businessName && touched.businessName
                          ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                          : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                      }`}
                    />
                    <ErrorMessage name="businessName" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-700">Contact Person</label>
                    <Field
                      name="contactPerson"
                      className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                        errors.contactPerson && touched.contactPerson
                          ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                          : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                      }`}
                    />
                    <ErrorMessage name="contactPerson" component="p" className="text-xs text-red-500 mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Email</label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="business@example.com"
                        className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.email && touched.email
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                        }`}
                      />
                      <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Mobile Number</label>
                      <Field
                        name="mobileNumber"
                        placeholder="10 digit number"
                        className={`mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.mobileNumber && touched.mobileNumber
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                        }`}
                      />
                      <ErrorMessage name="mobileNumber" component="p" className="text-xs text-red-500 mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-700">Password</label>
                    <div className="relative mt-1">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full rounded-2xl border pr-11 pl-4 py-3 text-sm outline-none transition focus:ring-4 ${
                          errors.password && touched.password
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary-600 transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                    <p className="text-[10px] text-slate-400 mt-1">At least 6 characters</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || !dirty}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-[#e05c3c] text-white font-semibold text-sm hover:bg-[#c44e32] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to OTP Verification →
                  </button>

                  <p className="text-center text-sm text-slate-500 mt-4">
                    Already registered?{" "}
                    <a href="/login" className="text-[#e05c3c] font-semibold hover:underline">
                      Login
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
