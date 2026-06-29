import { useState } from "react";
import {
  Building,
  Check,
  Edit3,
  Globe,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import type { Address, Customer } from "@/types";
import AddressModal from "./AddressModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
  // UI-04: styled confirmation instead of native confirm().
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const addresses = customer.addresses ?? [];

  const handleOpenAdd = () => {
    setEditingAddr(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingAddr(address);
    setModalOpen(true);
  };

  const handleSaveAddress = (newAddress: Address) => {
    let next: Address[];
    const exists = addresses.some((address) => address.id === newAddress.id);

    if (exists) {
      next = addresses.map((address) =>
        address.id === newAddress.id ? newAddress : address
      );
    } else {
      next = [...addresses, newAddress];
    }

    if (newAddress.isDefault) {
      next = next.map((address) => ({
        ...address,
        isDefault: address.id === newAddress.id,
      }));
    } else if (next.length === 1) {
      next[0].isDefault = true;
    }

    onUpdateAddresses(next);
  };

  // UI-04: open the styled confirmation dialog instead of native confirm().
  const handleDeleteAddress = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteAddress = () => {
    if (pendingDeleteId === null) return;

    const next = addresses.filter((address) => address.id !== pendingDeleteId);

    if (next.length > 0 && !next.some((address) => address.isDefault)) {
      next[0].isDefault = true;
    }

    onUpdateAddresses(next);
    setPendingDeleteId(null);
  };

  const handleSetDefault = (id: string) => {
    onUpdateAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary-700">
            Customer · Addresses
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
            Saved Addresses
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary-600">
            Manage your delivery addresses and choose the default location used
            during checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary-700 px-7 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-primary-800"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </button>
      </header>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-secondary-200 bg-white/70 p-16 text-center">
          <div className="mb-4 rounded-full bg-primary-100 p-5 text-primary-700">
            <MapPin className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-secondary-900">
            No addresses saved yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-secondary-600">
            Add your home, office, or any preferred delivery location so you
            can check out faster.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-6 rounded-full bg-primary-700 px-8 py-3.5 text-sm font-black text-white transition hover:bg-primary-800"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => {
            const isDefault = Boolean(address.isDefault);

            return (
              <div
                key={address.id}
                className={`relative overflow-hidden rounded-3xl border p-7 shadow-sm transition ${
                  isDefault
                    ? "border-primary-200 bg-gradient-to-br from-primary-50/70 via-white to-orange-50/40 ring-1 ring-primary-100"
                    : "border-secondary-200 bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        isDefault
                          ? "bg-primary-700 text-white"
                          : "bg-secondary-100 text-secondary-700"
                      }`}
                    >
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        {address.label || "Address"}
                      </p>
                      <h2 className="text-lg font-black text-secondary-900">
                        {address.fullName}
                      </h2>
                    </div>
                  </div>

                  {isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-700 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
                      <Check className="h-3 w-3" />
                      Default
                    </span>
                  )}
                </div>

                <div className="mt-6 space-y-2 pl-14 text-sm text-secondary-600">
                  <p className="font-medium leading-relaxed text-secondary-800">
                    {address.street}
                  </p>
                  <p>
                    {address.city}, {address.state}{" "}
                    <span className="font-bold text-secondary-800">
                      {address.postalCode}
                    </span>
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    {address.country}
                  </p>
                  <p className="inline-flex items-center gap-1.5 pt-1 font-bold text-secondary-800">
                    <Phone className="h-3.5 w-3.5 text-primary-700" />
                    {address.phone}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-secondary-100 pt-5">
                  {!isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-4 py-2 text-xs font-black text-secondary-700 transition hover:border-primary-700 hover:bg-primary-700 hover:text-white"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-xs font-bold italic text-slate-400">
                      Used as your default checkout address
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(address)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-4 py-2 text-xs font-bold text-secondary-700 transition hover:bg-secondary-200"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAddress}
        editingAddress={editingAddr}
        existingCount={addresses.length}
      />

      {/* UI-04: styled delete confirmation (replaces window.confirm) */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDeleteAddress}
        title="Delete this address?"
        description="This shipping address will be permanently removed from your account. This action cannot be undone."
        confirmLabel="Delete address"
        cancelLabel="Keep address"
        tone="danger"
      />
    </div>
  );
}
