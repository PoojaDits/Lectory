import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { registerCustomer, registerSeller } from "@/services/authApi";
import type {
  CustomerRegistrationInput,
  SellerRegistrationInput,
} from "@/types";

interface RegistrationPageProps {
  onNavigateHome: () => void;
}

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}

interface StatusMessage {
  type: "success" | "error";
  text: string;
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

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

function TextInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  onChange,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
      />
    </label>
  );
}

function FormMessage({ message }: { message: StatusMessage | null }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
        message.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </div>
  );
}

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

export default function RegistrationPage({ onNavigateHome }: RegistrationPageProps) {
  const [customerForm, setCustomerForm] =
    useState<CustomerRegistrationInput>(customerInitial);
  const [sellerForm, setSellerForm] =
    useState<SellerRegistrationInput>(sellerInitial);
  const [customerMessage, setCustomerMessage] = useState<StatusMessage | null>(null);
  const [sellerMessage, setSellerMessage] = useState<StatusMessage | null>(null);
  const [isCustomerSubmitting, setIsCustomerSubmitting] = useState(false);
  const [isSellerSubmitting, setIsSellerSubmitting] = useState(false);

  const handleCustomerRegistration = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsCustomerSubmitting(true);
    setCustomerMessage(null);

    try {
      await registerCustomer(customerForm);
      setCustomerForm(customerInitial);
      setCustomerMessage({
        type: "success",
        text: "Customer registration completed. Customer data has been saved in JSON Server.",
      });
    } catch (error) {
      setCustomerMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setIsCustomerSubmitting(false);
    }
  };

  const handleSellerRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSellerSubmitting(true);
    setSellerMessage(null);

    try {
      await registerSeller(sellerForm);
      setSellerForm(sellerInitial);
      setSellerMessage({
        type: "success",
        text: "Seller registration submitted. Seller data has been saved with Pending Approval status.",
      });
    } catch (error) {
      setSellerMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setIsSellerSubmitting(false);
    }
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
                Registration Only
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Separate Registration Forms
              </h1>
              <p className="mt-4 max-w-3xl text-white/75">
                Customer and seller registrations are separate. No login form is shown
                here. After registration, records are saved in JSON Server.
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
          <form
            onSubmit={handleCustomerRegistration}
            className="rounded-[2rem] border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100 md:p-8"
          >
            <div className="mb-6">
              <div className="mb-4 inline-flex rounded-2xl bg-amber-100 p-3 text-amber-800">
                <UserPlus className="h-7 w-7" />
              </div>
              <p className="section-header-badge text-amber-700">
                Step 1 - Registration
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Customer Registration
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Required fields: first name, last name, unique email, and a
                non-empty password.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={customerForm.firstName}
                  placeholder="Pooja"
                  autoComplete="given-name"
                  onChange={(value) =>
                    setCustomerForm((previous) => ({ ...previous, firstName: value }))
                  }
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={customerForm.lastName}
                  placeholder="Sharma"
                  autoComplete="family-name"
                  onChange={(value) =>
                    setCustomerForm((previous) => ({ ...previous, lastName: value }))
                  }
                />
              </div>

              <TextInput
                label="Email"
                name="customerEmail"
                type="email"
                value={customerForm.email}
                placeholder="customer@example.com"
                autoComplete="email"
                onChange={(value) =>
                  setCustomerForm((previous) => ({ ...previous, email: value }))
                }
              />

              <TextInput
                label="Password"
                name="customerPassword"
                type="password"
                value={customerForm.password}
                placeholder="Create a password"
                autoComplete="new-password"
                onChange={(value) =>
                  setCustomerForm((previous) => ({ ...previous, password: value }))
                }
              />

              <FormMessage message={customerMessage} />
              <SubmitButton isSubmitting={isCustomerSubmitting}>
                Register Customer
              </SubmitButton>
            </div>
          </form>

          <form
            onSubmit={handleSellerRegistration}
            className="rounded-[2rem] border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100 md:p-8"
          >
            <div className="mb-6">
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800">
                <Building2 className="h-7 w-7" />
              </div>
              <p className="section-header-badge text-emerald-700">
                Step 1 - Seller Registration
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Seller Registration
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Required fields: business name, contact person, email, and mobile
                number. Seller status is saved as Pending Approval.
              </p>
            </div>

            <div className="space-y-5">
              <TextInput
                label="Business Name"
                name="businessName"
                value={sellerForm.businessName}
                placeholder="Lectory Book Distributors"
                autoComplete="organization"
                onChange={(value) =>
                  setSellerForm((previous) => ({ ...previous, businessName: value }))
                }
              />

              <TextInput
                label="Contact Person"
                name="contactPerson"
                value={sellerForm.contactPerson}
                placeholder="Anita Verma"
                autoComplete="name"
                onChange={(value) =>
                  setSellerForm((previous) => ({ ...previous, contactPerson: value }))
                }
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextInput
                  label="Email"
                  name="sellerEmail"
                  type="email"
                  value={sellerForm.email}
                  placeholder="seller@example.com"
                  autoComplete="email"
                  onChange={(value) =>
                    setSellerForm((previous) => ({ ...previous, email: value }))
                  }
                />
                <TextInput
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  value={sellerForm.mobileNumber}
                  placeholder="9876543210"
                  autoComplete="tel"
                  onChange={(value) =>
                    setSellerForm((previous) => ({ ...previous, mobileNumber: value }))
                  }
                />
              </div>

              <FormMessage message={sellerMessage} />
              <SubmitButton isSubmitting={isSellerSubmitting}>
                Register Seller
              </SubmitButton>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
