
import { useAuthStore } from "@/stores/useAuthStore";
import { Building2, Mail, Phone, User } from "lucide-react";
import { formatDate } from "@/utils/helpers";

export default function SellerSettingsPage() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <div className="max-w-none mt-[65px] space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-primary-700">
          Seller · Settings
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
          Store Settings
        </h1>
        <p className="mt-1 text-sm text-secondary-600">
          Manage your seller profile and store information.
        </p>
      </div>

      {/* ── Store Profile Card ── */}
      <div className="rounded-3xl border border-secondary-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-black text-secondary-900 mb-6">
          Store Profile
        </h2>
        <div className="space-y-5">
          <SettingField
            icon={Building2}
            label="Business Name"
            value={currentUser?.businessName ?? "—"}
          />
          <SettingField
            icon={User}
            label="Contact Person"
            value={currentUser?.contactPerson ?? "—"}
          />
          <SettingField
            icon={Mail}
            label="Business Email"
            value={currentUser?.email ?? "—"}
          />
          <SettingField
            icon={Phone}
            label="Mobile Number"
            value={currentUser?.mobileNumber ?? "—"}
          />
          <div className="flex items-center gap-4 pt-4 border-t border-secondary-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Member Since
            </span>
            <span className="text-sm font-bold text-secondary-900">
              {formatDate(currentUser?.createdAt ?? "")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Status Card ── */}
      <div className="rounded-3xl border border-secondary-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-black text-secondary-900 mb-6">
          Account Status
        </h2>
        <div className="flex items-center justify-between rounded-2xl bg-primary-50 border border-primary-200 p-5">
          <div>
            <p className="text-sm font-bold text-primary-900">
              Seller Status
            </p>
            <p className="text-xs text-primary-700 mt-0.5">
              {currentUser?.status === "Approved"
                ? "Your seller account is active and approved."
                : currentUser?.status === "Pending Approval"
                  ? "Your account is under review by admin."
                  : "Your account has been rejected. Please contact support."}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${currentUser?.status === "Approved"
                ? "bg-primary-200 text-primary-900"
                : currentUser?.status === "Pending Approval"
                  ? "bg-primary-200 text-primary-900"
                  : "bg-rose-200 text-rose-900"
              }`}
          >
            {currentUser?.status ?? "—"}
          </span>
        </div>
      </div>

      {/* ── Info Card ── */}
      <div className="rounded-3xl border border-secondary-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-black text-secondary-900 mb-4">
          Need Help?
        </h2>
        <p className="text-sm text-secondary-600 leading-relaxed">
          For questions about your seller account, listings, or order processing,
          please reach out to the Lectory support team. You can also contact
          your assigned admin through the marketplace help center.
        </p>
      </div>
    </div>
  );
}

function SettingField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-bold text-secondary-700">{label}</span>
      </div>
      <span className="text-sm text-secondary-900 font-medium truncate max-w-xs">
        {value}
      </span>
    </div>
  );
}
