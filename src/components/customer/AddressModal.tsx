import { useState, useEffect } from "react";
import { X, Check, MapPin, Phone, User, Building, Globe } from "lucide-react";
import type { Address } from "@/types";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  editingAddress?: Address | null;
  existingCount: number;
}

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  editingAddress,
  existingCount,
}: AddressModalProps) {
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("Home");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingAddress) {
      setFullName(editingAddress.fullName || "");
      setStreet(editingAddress.street || "");
      setCity(editingAddress.city || "");
      setState(editingAddress.state || "");
      setPostalCode(editingAddress.postalCode || "");
      setCountry(editingAddress.country || "India");
      setPhone(editingAddress.phone || "");
      setLabel(editingAddress.label || "Home");
      setIsDefault(Boolean(editingAddress.isDefault));
    } else {
      setFullName("");
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("India");
      setPhone("");
      setLabel("Home");
      // Automatically make default if it's the first address
      setIsDefault(existingCount === 0);
    }
    setError("");
  }, [editingAddress, isOpen, existingCount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Please enter a contact name.");
    if (!street.trim()) return setError("Please enter a street address.");
    if (!city.trim()) return setError("Please enter a city.");
    if (!state.trim()) return setError("Please enter a state.");
    if (!postalCode.trim()) return setError("Please enter a postal code.");
    if (!phone.trim()) return setError("Please enter a phone number.");

    const newAddress: Address = {
      id: editingAddress ? editingAddress.id : `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: fullName.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      phone: phone.trim(),
      label: label.trim(),
      isDefault,
    };

    onSave(newAddress);
    onClose();
  };

  const PRESET_LABELS = ["Home", "Work", "Apartment", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-secondary-900/40">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-orange-900 p-6 text-white sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                <MapPin className="h-5 w-5 text-primary-200" />
              </div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                {editingAddress ? "Edit Shipping Address" : "Add New Address"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-2 text-sm text-primary-100/80">
            {editingAddress
              ? "Update your delivery details below."
              : "Enter your delivery details to ensure prompt book shipments."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700 border border-rose-200">
              ⚠️ {error}
            </div>
          )}

          {/* Label selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Address Type
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_LABELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLabel(item)}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold transition border ${
                    label === item
                      ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                      : "bg-secondary-50 text-secondary-600 border-secondary-200 hover:bg-secondary-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Name & Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Contact Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Street Address, Flat, House No.
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <textarea
                rows={2}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 402, Sunshine Towers, M.G. Road, Near Metro Station"
                className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100 resize-none"
              />
            </div>
          </div>

          {/* City & State */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                City / Town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                PIN / Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 400001"
                className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50/50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-primary-700 focus:bg-white focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                disabled={existingCount === 0 && !editingAddress} // First address is always default
                className="sr-only"
              />
              <div className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition ${
                isDefault
                  ? "bg-primary-900 border-primary-900 text-white"
                  : "border-slate-300 bg-white group-hover:border-slate-400"
              }`}>
                {isDefault && <Check className="h-4 w-4 stroke-[3]" />}
              </div>
              <span className="text-sm font-bold text-secondary-800">
                Set as my default shipping address
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-secondary-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary-900 px-8 py-3 text-sm font-black text-white hover:bg-primary-800 shadow-md shadow-primary-900/20 transition hover:-translate-y-0.5"
            >
              {editingAddress ? "Save Changes" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
