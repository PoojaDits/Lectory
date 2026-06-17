import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  ArrowLeft,
  User,
  Building2,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useRegisterCustomer, useRegisterSeller } from "@/hooks/useAuth";
import {
  customerRegistrationSchema,
  sellerRegistrationSchema,
} from "@/lib/validation";
import type {
  CustomerRegistrationInput,
  SellerRegistrationInput,
} from "@/types";

interface RegistrationPageProps {
  onNavigateHome: () => void;
}

export default function RegistrationPage({ onNavigateHome }: RegistrationPageProps) {
  const navigate = useNavigate();
  const [role, setRole] = useState<"customer" | "seller">("customer");

  const registerCustomer = useRegisterCustomer(() => navigate("/login"));
  const registerSeller = useRegisterSeller(() => navigate("/login"));

  const customerInitial: CustomerRegistrationInput = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const sellerInitial: SellerRegistrationInput = {
    businessName: "",
    contactPerson: "",
    email: "",
    mobileNumber: "",
    password: "",
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} /> Back to store
          </button>
          <div className="text-sm text-slate-500">Already have an account? <a href="/login" className="text-amber-700 font-semibold hover:underline">Login</a></div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2 border border-slate-100">
          {/* LEFT PANEL - Custom SVG Illustration */}
          <div className="bg-[#3f2a1e] flex items-center justify-center p-6">
            <img 
              src="/registration-illustration.svg" 
              alt="Registration illustration" 
              className="max-w-full max-h-[620px] w-auto h-auto"
            />
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="p-9 md:p-10">
            {/* Role Tabs */}
            <div className="flex bg-slate-100 rounded-full p-1 mb-8 w-fit">
              <button
                onClick={() => setRole("customer")}
                className={`px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                  role === "customer" 
                    ? "bg-white shadow text-slate-900" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <User size={16} /> Customer
              </button>
              <button
                onClick={() => setRole("seller")}
                className={`px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                  role === "seller" 
                    ? "bg-white shadow text-slate-900" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Building2 size={16} /> Seller
              </button>
            </div>

            {/* FORMS */}
            {role === "customer" && (
              <Formik
                initialValues={customerInitial}
                validationSchema={customerRegistrationSchema}
                onSubmit={(values, helpers) => {
                  registerCustomer.mutate(values, {
                    onSuccess: () => helpers.resetForm(),
                    onSettled: () => helpers.setSubmitting(false),
                  });
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
                      <p className="text-sm text-slate-500 mt-1">Join as a customer to start shopping</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="First Name" name="firstName" placeholder="John" />
                      <FormField label="Last Name" name="lastName" placeholder="Doe" />
                    </div>
                    <FormField label="Email address" name="email" type="email" placeholder="you@example.com" />
                    <FormField label="Password" name="password" type="password" placeholder="Create password" />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-semibold text-sm transition disabled:opacity-70"
                    >
                      {isSubmitting ? "Creating account..." : "Sign up as Customer"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            {role === "seller" && (
              <Formik
                initialValues={sellerInitial}
                validationSchema={sellerRegistrationSchema}
                onSubmit={(values, helpers) => {
                  registerSeller.mutate(values, {
                    onSuccess: () => helpers.resetForm(),
                    onSettled: () => helpers.setSubmitting(false),
                  });
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">Become a Seller</h2>
                      <p className="text-sm text-slate-500 mt-1">List and sell your books on Lectory</p>
                    </div>

                    <FormField label="Business Name" name="businessName" placeholder="Book Haven Ltd" />
                    <FormField label="Contact Person" name="contactPerson" placeholder="Jane Smith" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Business Email" name="email" type="email" placeholder="business@example.com" />
                      <FormField label="Mobile Number" name="mobileNumber" placeholder="0712345678" />
                    </div>
                    <FormField label="Password" name="password" type="password" placeholder="Create password" />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-semibold text-sm transition disabled:opacity-70"
                    >
                      {isSubmitting ? "Submitting..." : "Register as Seller"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
