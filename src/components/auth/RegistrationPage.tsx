import { useNavigate } from "react-router-dom";
import { Formik, Form, type FormikHelpers } from "formik";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
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
};

function SubmitButton({
  children,
  isSubmitting,
}: {
  children: string;
  isSubmitting: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="fancy-btn w-full rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 px-5 py-3.5 font-bold text-white shadow-lg shadow-amber-200 transition hover:from-amber-800 hover:to-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "Saving..." : children}
    </button>
  );
}

export default function RegistrationPage({
  onNavigateHome,
}: RegistrationPageProps) {
  const navigate = useNavigate();

  const registerCustomer = useRegisterCustomer(() => navigate("/login"));
  const registerSeller = useRegisterSeller(() => navigate("/login"));

  const handleCustomer = (
    values: CustomerRegistrationInput,
    helpers: FormikHelpers<CustomerRegistrationInput>
  ) => {
    registerCustomer.mutate(values, {
      onSuccess: () => helpers.resetForm(),
      onSettled: () => helpers.setSubmitting(false),
    });
  };

  const handleSeller = (
    values: SellerRegistrationInput,
    helpers: FormikHelpers<SellerRegistrationInput>
  ) => {
    registerSeller.mutate(values, {
      onSuccess: () => helpers.resetForm(),
      onSettled: () => helpers.setSubmitting(false),
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </button>

        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-950 via-amber-900 to-orange-900 p-8 text-white shadow-2xl shadow-amber-100 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-5 inline-flex rounded-2xl bg-white/10 p-3 ring-1 ring-white/20">
                <BookOpen className="h-8 w-8" />
              </div>
              <p className="section-header-badge text-amber-100">
                Registration
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Join the Lectory Marketplace
              </h1>
              <p className="mt-4 max-w-3xl text-white/75">
                Customer and seller registrations are separate. After
                registration, records are saved in JSON Server.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-white/80 sm:min-w-80">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <CheckCircle2 className="h-5 w-5 text-amber-200" />
                Customer email must be unique
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <ShieldCheck className="h-5 w-5 text-amber-200" />
                Seller status becomes Pending Approval
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          {/* Customer Registration */}
          <Formik
            initialValues={customerInitial}
            validationSchema={customerRegistrationSchema}
            onSubmit={handleCustomer}
          >
            {({ isSubmitting }) => (
              <Form className="rounded-[2rem] border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100 md:p-8">
                <div className="mb-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-amber-100 p-3 text-amber-800">
                    <UserPlus className="h-7 w-7" />
                  </div>
                  <p className="section-header-badge text-amber-700">
                    Customer
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Customer Registration
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Required: first name, last name, unique email, and password.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      label="First Name"
                      name="firstName"
                      placeholder="Aarav"
                      autoComplete="given-name"
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      placeholder="Sharma"
                      autoComplete="family-name"
                    />
                  </div>

                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="customer@example.com"
                    autoComplete="email"
                  />

                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <SubmitButton isSubmitting={isSubmitting}>
                    Register Customer
                  </SubmitButton>
                </div>
              </Form>
            )}
          </Formik>

          {/* Seller Registration */}
          <Formik
            initialValues={sellerInitial}
            validationSchema={sellerRegistrationSchema}
            onSubmit={handleSeller}
          >
            {({ isSubmitting }) => (
              <Form className="rounded-[2rem] border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100 md:p-8">
                <div className="mb-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <p className="section-header-badge text-emerald-700">
                    Seller — Step 1
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Seller Registration
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Required: business name, contact person, email, and 10-digit
                    mobile number. Status is saved as Pending Approval.
                  </p>
                </div>

                <div className="space-y-5">
                  <FormField
                    label="Business Name"
                    name="businessName"
                    placeholder="Lectory Book Distributors"
                    autoComplete="organization"
                  />

                  <FormField
                    label="Contact Person"
                    name="contactPerson"
                    placeholder="Anita Verma"
                    autoComplete="name"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="seller@example.com"
                      autoComplete="email"
                    />
                    <FormField
                      label="Mobile Number"
                      name="mobileNumber"
                      type="tel"
                      placeholder="9876543210"
                      autoComplete="tel"
                    />
                  </div>

                  <SubmitButton isSubmitting={isSubmitting}>
                    Register Seller
                  </SubmitButton>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </main>
  );
}
