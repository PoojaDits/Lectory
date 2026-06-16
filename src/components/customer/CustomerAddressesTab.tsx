import { useState } from "react";
import { Plus, MapPin, Check, Trash2, Edit3, Globe, Phone, Building } from "lucide-react";
import type { Address, Customer } from "@/types";
import AddressModal from "./AddressModal";

interface CustomerAddressesTabProps {
  customer: Customer;
  onUpdateAddresses: (addresses: Address[]) => void;
}

export default function CustomerAddressesTab({
  customer,
  onUpdateAddresses,
}: CustomerAddressesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  const addresses = customer.addresses ?? [];

  const handleOpenAdd = () => {
    setEditingAddr(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddr(addr);
    setModalOpen(true);
  };

  const handleSaveAddress = (newAddr: Address) => {
    let next: Address[];
    const exists = addresses.some((a) => a.id === newAddr.id);

    if (exists) {
      next = addresses.map((a) => (a.id === newAddr.id ? newAddr : a));
    } else {
      next = [...addresses, newAddr];
    }

    // If newAddr is default, un-default all others
    if (newAddr.isDefault) {
      next = next.map((a) => ({
        ...a,
        isDefault: a.id === newAddr.id,
      }));
    } else if (next.length === 1) {
      // If it's the only address, it must be default
      next[0].isDefault = true;
    }

    onUpdateAddresses(next);
  };

  const handleDeleteAddress = (id: string) => {
    if (!confirm("Are you sure you want to delete this shipping address?")) return;
    let next = addresses.filter((a) => a.id !== id);

    // If we deleted the default address, make the first remaining address default
    if (next.length > 0 && !next.some((a) => a.isDefault)) {
      next[0].isDefault = true;
    }

    onUpdateAddresses(next);
  };

  const handleSetDefault = (id: string) => {
    const next = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    onUpdateAddresses(next);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            My Saved Addresses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your delivery addresses for a seamless 1-click checkout experience.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-900 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-amber-900/20 hover:bg-amber-800 transition hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </button>
      </div>

      {/* Content */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-amber-200 bg-amber-50/40 p-12 text-center sm:p-16">
          <div className="rounded-full bg-amber-100 p-6 text-amber-800 mb-4">
            <MapPin className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">No addresses saved yet</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Add your home or work address so you can quickly select it during book purchases.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-6 rounded-full bg-amber-900 px-8 py-3.5 text-sm font-black text-white hover:bg-amber-800 transition shadow-md"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((addr) => {
            const isDef = Boolean(addr.isDefault);
            return (
              <div
                key={addr.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border p-7 sm:p-8 transition-all duration-300 ${
                  isDef
                    ? "border-amber-900/40 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 shadow-xl shadow-amber-950/5 ring-2 ring-amber-900/20"
                    : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Top status */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl font-black text-xs ${
                          isDef
                            ? "bg-amber-900 text-white shadow-md shadow-amber-900/20"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400 block">
                          {addr.label || "Address"}
                        </span>
                        <h3 className="text-lg font-black text-slate-900">{addr.fullName}</h3>
                      </div>
                    </div>

                    {isDef && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-900 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" /> Default
                      </span>
                    )}
                  </div>

                  {/* Address Body */}
                  <div className="space-y-1.5 text-sm text-slate-600 pl-12">
                    <p className="font-medium text-slate-800 leading-relaxed">{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} <span className="font-bold text-slate-800">{addr.postalCode}</span>
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" /> {addr.country}
                    </p>
                    <p className="pt-2 font-bold text-slate-800 inline-flex items-center gap-1.5 block">
                      <Phone className="h-3.5 w-3.5 text-amber-900" /> {addr.phone}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-slate-100">
                  {!isDef ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-amber-900 hover:border-amber-900 hover:text-white transition shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5" /> Set as Default
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic">
                      Your default delivery choice
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(addr)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                      title="Delete Address"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAddress}
        editingAddress={editingAddr}
        existingCount={addresses.length}
      />
    </div>
  );
}
