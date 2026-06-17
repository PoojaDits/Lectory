import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  customerRegistrationSchema,
  sellerRegistrationSchema,
} from "@/lib/validation";
import type {
  CustomerRegistrationInput,
  SellerRegistrationInput,
} from "@/types";
import { BookOpen } from "lucide-react";

interface RegistrationPageProps {
  onNavigateHome: () => void;
}

export default function RegistrationPage({ onNavigateHome }: RegistrationPageProps) {
  const [role, setRole] = useState<"customer" | "seller">("customer");

  const customerInitial: CustomerRegistrationInput = {
    firstName: "", lastName: "", email: "", password: "",
  };

  const sellerInitial: SellerRegistrationInput = {
    businessName: "", contactPerson: "", email: "", mobileNumber: "", password: "",
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden h-[700px]">
        
        {/* LEFT IMAGE */}
        <div className="relative hidden md:block">
          <img src="/booklovers.jpeg" alt="Library" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 p-2 shadow-lg shadow-amber-200 transition-shadow group-hover:shadow-amber-300">
              <BookOpen className="h-6 w-6 text-white" />
              
            </div>
              <span className="font-bold text-2xl tracking-tight">Lectory</span>
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tighter mb-4">
              {role === "customer" ? "START YOUR READING JOURNEY" : "SELL YOUR BOOKS"}
            </h1>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="pt-3 pb-6 px-8 md:px-10 flex flex-col h-full overflow-hidden">
          {/* Role Tabs */}
          <div className="flex bg-slate-100 rounded-full p-1 mb-3 w-fit">
            <button
              onClick={() => setRole("customer")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${role === "customer" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole("seller")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${role === "seller" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
            >
              Seller
            </button>
          </div>

          {/* CUSTOMER FORM */}
          {role === "customer" && (
            <Formik initialValues={customerInitial} validationSchema={customerRegistrationSchema} onSubmit={() => {}}>
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Create Your Account</h2>
                    <p className="text-sm text-slate-500">Join as a customer</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Field name="firstName" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                      <ErrorMessage name="firstName" component="p" className="text-xs text-red-500 mt-0.5" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Field name="lastName" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                      <ErrorMessage name="lastName" component="p" className="text-xs text-red-500 mt-0.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Field name="email" type="email" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Field name="password" type="password" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-3.5 rounded-2xl bg-[#e05c3c] text-white font-semibold text-sm">
                    Register
                  </button>

                  <p className="text-center text-sm text-slate-500 mt-4">
                    Already registered? <a href="/login" className="text-[#e05c3c] font-semibold">Login</a>
                  </p>
                </Form>
              )}
            </Formik>
          )}

          {/* SELLER FORM */}
          {role === "seller" && (
            <Formik initialValues={sellerInitial} validationSchema={sellerRegistrationSchema} onSubmit={() => {}}>
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Become a Seller</h2>
                    <p className="text-sm text-slate-500">List and sell your books</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Business Name</label>
                    <Field name="businessName" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="businessName" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Contact Person</label>
                    <Field name="contactPerson" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="contactPerson" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Field name="email" type="email" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                      <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-0.5" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mobile</label>
                      <Field name="mobileNumber" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                      <ErrorMessage name="mobileNumber" component="p" className="text-xs text-red-500 mt-0.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Field name="password" type="password" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-0.5" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-3.5 rounded-2xl bg-[#e05c3c] text-white font-semibold text-sm">
                    Register as Seller
                  </button>

                  <p className="text-center text-sm text-slate-500 mt-4">
                    Already registered? <a href="/login" className="text-[#e05c3c] font-semibold">Login</a>
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
