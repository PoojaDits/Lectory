import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import type { Customer } from "@/types";

interface CustomerSettingsTabProps {
  customer: Customer;
  onUpdateProfile: (updates: Partial<Customer>) => Promise<void>;
}



export default function CustomerSettingsTab({
  customer,
  onUpdateProfile,
}: CustomerSettingsTabProps) {
  const [firstName, setFirstName] = useState(customer.firstName || "");
  const [lastName, setLastName] = useState(customer.lastName || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [avatar] = useState(customer.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Customize your profile identity, contact information, and account preferences.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {successMsg && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800 border border-emerald-200 flex items-center gap-2 animate-in fade-in">
              <span>✨ Your profile preferences have been successfully updated!</span>
            </div>
          )}
          {/* Personal Information */}
          <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Email Address (Login ID)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={customer.email}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 py-3 pl-10 pr-4 text-sm font-medium text-slate-500 cursor-not-allowed select-none"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Your email identifier cannot be changed directly.
              </span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Mobile / Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-900 px-10 py-4 text-base font-black text-white hover:bg-amber-800 shadow-xl shadow-amber-900/20 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isSubmitting ? "Saving Preferences..." : "Save Profile Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
