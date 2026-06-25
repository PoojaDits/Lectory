import { useState } from "react";
import { Mail, Phone, Save, User } from "lucide-react";
import type { Customer } from "@/types";

interface CustomerSettingsTabProps {
  customer: Customer;
  onUpdateProfile: (updates: Partial<Customer>) => Promise<void>;
}

export default function CustomerSettingsTab({
  customer,
  onUpdateProfile,
}: CustomerSettingsTabProps) {
  const fallbackPhone =
    customer.phone ||
    customer.addresses?.find((address) => address.isDefault)?.phone ||
    customer.addresses?.[0]?.phone ||
    "";

  const [firstName, setFirstName] = useState(customer.firstName || "");
  const [lastName, setLastName] = useState(customer.lastName || "");
  const [phone, setPhone] = useState(fallbackPhone);
  const [avatar] = useState(customer.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(false);

    try {
      await onUpdateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-primary-700">
          Customer · Settings
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-secondary-600">
          Update your personal details and keep your customer profile current.
        </p>
      </header>

      <div className="rounded-3xl border border-secondary-200 bg-white p-8 shadow-sm sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
              <span>✨ Your profile has been updated successfully.</span>
            </div>
          )}

          <div>
            <h2 className="text-lg font-black text-secondary-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              This information appears throughout your customer account.
            </p>
            <div className="mt-5 grid gap-6 border-t border-secondary-100 pt-6 sm:grid-cols-2">
              <Field
                label="First Name"
                icon={User}
                value={firstName}
                onChange={setFirstName}
                required
              />
              <Field
                label="Last Name"
                icon={User}
                value={lastName}
                onChange={setLastName}
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-secondary-900">
              Contact Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your email is used as your login identifier and cannot be changed
              here.
            </p>
            <div className="mt-5 grid gap-6 border-t border-secondary-100 pt-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={customer.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-secondary-200 bg-secondary-100/80 py-3 pl-10 pr-4 text-sm font-medium text-slate-500"
                  />
                </div>
              </div>

              <Field
                label="Mobile Number"
                icon={Phone}
                value={phone}
                onChange={setPhone}
                placeholder="e.g. +91 98765 43210"
                type="tel"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-secondary-100 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-700 px-8 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  icon: typeof User;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "tel" | "email";
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
        />
      </div>
    </div>
  );
}
