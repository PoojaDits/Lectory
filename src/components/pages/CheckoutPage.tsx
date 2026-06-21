import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Plus,
  Loader2,
  Lock,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useCustomerProfile,
  useCreateMarketplaceOrders,
  useUpdateCustomerProfile,
} from "@/hooks/useCustomer";
import { useCart, useClearCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/helpers";
import type { Address } from "@/types";
import AddressModal from "@/components/customer/AddressModal";



export default function CheckoutPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const navigate = useNavigate();

  // Fresh queries
  const { data: customer, isLoading: isCustomerLoading } = useCustomerProfile(
    currentUser?.id
  );
  const updateProfile = useUpdateCustomerProfile();
  const { entries, count, subtotal, isLoading: isCartLoading } = useCart();
  const clearCart = useClearCart();
  const createOrders = useCreateMarketplaceOrders();

  // Navigation steps
  const [step, setStep] = useState<"address" | "review" | "success">("address");
  const [selectedAddrId, setSelectedAddrId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [placedOrderIds, setPlacedOrderIds] = useState<string[]>([]);

  // Automatically pre-select default address when profile loads
  useEffect(() => {
    if (customer?.addresses && customer.addresses.length > 0 && !selectedAddrId) {
      const defaultAddr =
        customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
      if (defaultAddr) setSelectedAddrId(defaultAddr.id);
    }
  }, [customer, selectedAddrId]);

  // Guard against non-customers
  if (!currentUser || currentUser.role !== "customer") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-28 text-center">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-black text-slate-900">Customer Access Required</h1>
          <p className="mt-2 text-slate-500">Please log in to complete your checkout.</p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-full bg-amber-900 px-8 py-3 text-sm font-black text-white hover:bg-amber-800"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const addresses = customer?.addresses ?? [];
  const chosenAddress = addresses.find((a) => a.id === selectedAddrId) || addresses[0];

  const handleSaveNewAddress = (newAddr: Address) => {
    const nextAddresses = [...addresses, newAddr];
    // If it's set as default or the first address, update defaults
    if (newAddr.isDefault || nextAddresses.length === 1) {
      nextAddresses.forEach((a) => (a.isDefault = a.id === newAddr.id));
    }

    updateProfile.mutate({
      id: customer!.id!,
      updates: { addresses: nextAddresses },
    });

    setSelectedAddrId(newAddr.id);
  };

  const handleCompleteOrder = async () => {
    if (!chosenAddress) return alert("Please select a delivery address.");
    if (entries.length === 0) return alert("Your cart is empty.");

    const formattedAddress = [
      chosenAddress.fullName,
      chosenAddress.street,
      `${chosenAddress.city}, ${chosenAddress.state} ${chosenAddress.postalCode}`,
      chosenAddress.country,
      `(${chosenAddress.phone})`,
    ].join(", ");

    try {
      const newOrders = await createOrders.mutateAsync({
        customerId: customer!.id!,
        entries,
        shippingAddress: formattedAddress,
      });

      setPlacedOrderIds(newOrders.map((o) => String(o.id)));
      clearCart.mutate();
      setStep("success");
    } catch (e) {
      console.error(e);
    }
  };

  if (isCustomerLoading || isCartLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-32 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-amber-900" />
        <p className="mt-4 text-sm font-bold text-slate-600">Loading checkout session…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/60 via-white to-orange-50/50 px-4 pb-24 pt-24">
      <div className="mx-auto max-w-4xl">
        {/* Top Header Step Indicator */}
        {step !== "success" && (
          <div className="mb-8">
            <button
              type="button"
              onClick={() => (step === "review" ? setStep("address") : navigate("/cart"))}
              className="inline-flex items-center gap-2 text-xs font-black text-amber-900 hover:text-amber-700 transition mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === "review" ? "Back to Address Selection" : "Return to Cart"}
            </button>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-emerald-700" />
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  Secure Marketplace Checkout
                </h1>
              </div>

              {/* Step Badges */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span
                  className={`px-3 py-1 rounded-full ${
                    step === "address"
                      ? "bg-amber-900 text-white shadow-sm"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  1. Shipping Address
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
                <span
                  className={`px-3 py-1 rounded-full ${
                    step === "review"
                      ? "bg-amber-900 text-white shadow-sm"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  2. Review & Place Order
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: ADDRESS SELECTION */}
        {step === "address" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Where should we send your books?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an existing delivery address or add a new one below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-900 px-5 py-2.5 text-xs font-black text-white hover:bg-amber-800 transition shadow-md shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Address
              </button>
            </div>

            {/* Addresses list */}
            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-amber-200 bg-amber-50/40 p-12 text-center">
                <MapPin className="h-12 w-12 text-amber-700 mb-3" />
                <h3 className="text-base font-black text-slate-900">No Delivery Addresses Found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Please add your delivery address so we can calculate delivery options and complete your order.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-5 rounded-full bg-amber-900 px-6 py-3 text-xs font-black text-white hover:bg-amber-800 transition"
                >
                  Add New Delivery Address
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddrId;
                  const isDef = Boolean(addr.isDefault);

                  return (
                    <label
                      key={addr.id}
                      onClick={() => setSelectedAddrId(addr.id)}
                      className={`relative flex flex-col justify-between rounded-3xl border p-6 cursor-pointer transition-all ${
                        isSelected
                          ? "border-amber-900 bg-amber-50/30 ring-2 ring-amber-900 shadow-md scale-[1.01]"
                          : "border-slate-200/80 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                              {addr.label || "Shipping"}
                            </span>
                            {isDef && (
                              <span className="rounded-full bg-amber-900/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-900">
                                Default
                              </span>
                            )}
                          </div>

                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                              isSelected
                                ? "bg-amber-900 border-amber-900 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <h3 className="text-base font-black text-slate-900">{addr.fullName}</h3>
                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <p className="font-medium text-slate-800">{addr.street}</p>
                          <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p>{addr.country}</p>
                          <p className="pt-1 font-bold text-slate-800">📞 {addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Bottom Proceed bar */}
            {addresses.length > 0 && (
              <div className="flex items-center justify-end pt-6 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedAddrId) return alert("Please select an address.");
                    setStep("review");
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-10 py-4 text-sm font-black text-white hover:bg-amber-800 transition shadow-xl shadow-amber-900/20"
                >
                  <span>Proceed to Order Review</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* STEP 2: ORDER REVIEW & PLACE */}
        {step === "review" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Address Review snippet */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-900 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">
                    Deliver To
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {chosenAddress?.fullName} <span className="font-medium text-slate-500">({chosenAddress?.label})</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {chosenAddress?.street}, {chosenAddress?.city}, {chosenAddress?.state} {chosenAddress?.postalCode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("address")}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-amber-900 hover:bg-amber-50 transition shrink-0"
              >
                Change Address
              </button>
            </div>

            {/* Items Summary */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4">
                Purchased Books ({count} Line Items)
              </h2>

              <ul className="divide-y divide-slate-100 space-y-4">
                {entries.map((entry) => (
                  <li key={String(entry.id)} className="pt-4 first:pt-0 flex items-center gap-4">
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {entry.coverImage && (
                        <img src={entry.coverImage} alt={entry.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{entry.title}</h3>
                      <p className="text-xs text-slate-500">{entry.author}</p>
                      <span className="inline-block bg-amber-50 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded mt-1">
                        Seller: {entry.sellerName}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{entry.quantity} x {formatCurrency(entry.price)}</p>
                      <p className="text-sm font-black text-slate-900">{formatCurrency(entry.price * entry.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Options Simulator */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-indigo-700" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">Payment Simulation</h3>
                  <p className="text-xs text-slate-500">Instant One-Click Approval / Verified Simulated Escrow</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                ✅ Pre-Approved
              </span>
            </div>

            {/* Price Total & Final Place Order */}
            <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber-200">
                  Total Payable Amount
                </p>
                <p className="text-3xl font-black mt-1 sm:text-4xl">
                  {formatCurrency(subtotal)}
                </p>
                <p className="text-xs text-amber-100/80 mt-1">
                  🎉 Free Priority Express Shipping Included
                </p>
              </div>

              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={createOrders.isPending}
                className="rounded-full bg-white px-10 py-4 text-base font-black text-amber-950 hover:bg-amber-100 transition shadow-lg hover:scale-105 disabled:opacity-50 shrink-0 inline-flex items-center justify-center gap-2"
              >
                {createOrders.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Placing Order…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-amber-700" /> Place Order Now
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: SUCCESS CELEBRATION */}
        {step === "success" && (
          <section className="animate-in zoom-in-95 duration-500 py-8">
            <div className="overflow-hidden rounded-[3rem] bg-white p-8 sm:p-14 border border-slate-200 shadow-2xl text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500" />

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-6 sm:h-24 sm:w-24">
                <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 stroke-[2.5]" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 text-xs font-black uppercase tracking-widest text-emerald-800 mb-3">
                Order Placed Successfully
              </span>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Thank you for your order!
              </h1>

              <p className="mt-3 max-w-xl mx-auto text-slate-600 sm:text-base leading-relaxed">
                Your order has been confirmed and submitted to our marketplace sellers for stock verification and fulfillment approval. Your shopping cart is now empty.
              </p>

              {/* Placed Order IDs pill */}
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700 font-bold">
                <ShoppingBag className="h-4 w-4 text-amber-900" />
                <span>Marketplace Reference ID(s):</span>
                {placedOrderIds.map((id) => (
                  <span key={id} className="bg-white border border-slate-200 px-2.5 py-1 rounded-md font-black text-slate-900">
                    #{id}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/account/orders"
                  className="rounded-full bg-amber-900 px-8 py-4 text-sm font-black text-white hover:bg-amber-800 transition shadow-lg shadow-amber-900/20"
                >
                  View My Order History
                </Link>

                <Link
                  to="/browse"
                  className="rounded-full bg-slate-100 border border-slate-200 px-8 py-4 text-sm font-black text-slate-800 hover:bg-slate-200 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Address modal */}
      <AddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNewAddress}
        existingCount={addresses.length}
      />
    </main>
  );
}
