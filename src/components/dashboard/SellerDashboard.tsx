import { useState } from "react";
import {
  ArrowLeft,
  Boxes,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  Store,
  MapPin,
  Calendar,
  ShoppingBag,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useSellerOrders } from "@/hooks/useCustomer";
import { useUpdateOrderStatus } from "@/hooks/useAdmin";

interface SellerDashboardProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

export default function SellerDashboard({
  onNavigateHome,
  onLogin,
}: SellerDashboardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);

  const { data: sellerOrders = [], isLoading: isOrdersLoading } = useSellerOrders(
    currentUser?.id
  );
  const updateOrder = useUpdateOrderStatus();
  const [activeTab, setActiveTab] = useState<"orders" | "overview">("orders");

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  // ── Guard ──
  if (!currentUser || currentUser.role !== "seller") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <Store className="mx-auto h-14 w-14 text-emerald-700" />
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Seller access required
          </h1>
          <p className="mt-2 text-slate-500">
            Please log in with an approved seller account.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </button>
          {!isImpersonating && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 shadow-md"
            >
              <LogOut className="h-4 w-4 text-emerald-400" />
              Logout
            </button>
          )}
        </div>

        {/* Header Portal Card */}
        <header className="mb-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white shadow-xl md:p-12 relative">
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-200">
                Seller Command Center
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-5xl tracking-tight">
                {currentUser.businessName ?? currentUser.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-white/90 text-sm">
                <span>Representative: <strong className="text-white">{currentUser.contactPerson ?? currentUser.name}</strong></span>
                <span>·</span>
                <span>Contact Phone: <strong className="text-white">{currentUser.mobileNumber ?? "—"}</strong></span>
                <span>·</span>
                {currentUser.status && <StatusBadge status={currentUser.status} />}
              </div>
            </div>

            {/* Navigation pills */}
            <div className="flex bg-emerald-950/40 p-1.5 rounded-full border border-white/10 backdrop-blur-md self-start shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`rounded-full px-5 py-2 text-xs font-black transition ${
                  activeTab === "orders" ? "bg-white text-emerald-950 shadow" : "text-white hover:text-emerald-200"
                }`}
              >
                Received Orders ({sellerOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`rounded-full px-5 py-2 text-xs font-black transition ${
                  activeTab === "overview" ? "bg-white text-emerald-950 shadow" : "text-white hover:text-emerald-200"
                }`}
              >
                Store Overview
              </button>
            </div>
          </div>
        </header>

        {/* TAB 1: LIVE ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Customer Book Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Process orders received for your active listings and update shipping milestones.
                </p>
              </div>

              <div className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100">
                🚀 Faster Fulfillment Increases Seller Rating
              </div>
            </div>

            {isOrdersLoading ? (
              <div className="py-24 text-center text-sm font-bold text-slate-400">
                Loading marketplace orders…
              </div>
            ) : sellerOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/70 p-16 text-center shadow-sm">
                <ShoppingBag className="h-14 w-14 text-slate-300 mb-3" />
                <h3 className="text-lg font-black text-slate-900">No Orders Received Yet</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  When customers place orders for books listed by your business, they will appear here instantly for shipment processing.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sellerOrders.map((order) => {
                  const items = order.items ?? [];
                  return (
                    <div
                      key={String(order.id)}
                      className="overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition"
                    >
                      {/* Top Bar */}
                      <div className="bg-slate-50/80 p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
                          <div>
                            <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                              Order #
                            </span>
                            <span className="text-base font-black text-slate-900">
                              #{String(order.id)}
                            </span>
                          </div>

                          <div>
                            <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                              Date Received
                            </span>
                            <span className="font-bold text-slate-800 inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <div>
                            <span className="font-extrabold uppercase tracking-wider text-slate-400 block">
                              Payable Revenue
                            </span>
                            <span className="text-base font-black text-emerald-700">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge status={order.status} />

                          {/* Action Milestone Buttons */}
                          {order.status === "Created" && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateOrder.mutate({ id: order.id, status: "Accepted" })}
                                disabled={updateOrder.isPending}
                                className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2.5 text-xs font-black text-white hover:bg-amber-700 transition shadow-md shadow-amber-900/20"
                              >
                                <span>✅ Accept Order</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Reject and cancel this customer order?")) {
                                    updateOrder.mutate({ id: order.id, status: "Cancelled" });
                                  }
                                }}
                                disabled={updateOrder.isPending}
                                className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-black text-rose-700 hover:bg-rose-100 transition"
                              >
                                <span>❌ Reject</span>
                              </button>
                            </div>
                          )}

                          {order.status === "Accepted" && (
                            <button
                              type="button"
                              onClick={() => updateOrder.mutate({ id: order.id, status: "Shipped" })}
                              disabled={updateOrder.isPending}
                              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-6 py-2.5 text-xs font-black text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-900/20 animate-pulse"
                            >
                              <span>🚀 Dispatch Order (Mark as Shipped)</span>
                            </button>
                          )}

                          {order.status === "Shipped" && (
                            <button
                              type="button"
                              onClick={() => updateOrder.mutate({ id: order.id, status: "Delivered" })}
                              disabled={updateOrder.isPending}
                              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-6 py-2.5 text-xs font-black text-white hover:bg-emerald-800 transition shadow-md"
                            >
                              <span>🎉 Confirm Final Delivery</span>
                            </button>
                          )}

                          {order.status === "Delivered" && (
                            <span className="text-xs font-bold text-slate-400 italic">🎉 Order Complete</span>
                          )}

                          {order.status === "Cancelled" && (
                            <span className="text-xs font-bold text-rose-500 italic">❌ Cancelled</span>
                          )}
                        </div>
                      </div>

                      {/* Items & Shipping Address Body */}
                      <div className="p-6 sm:p-8 space-y-6">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                            Items to Fulfill ({items.length})
                          </h3>
                          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((it, idx) => (
                              <li
                                key={String(it.id || idx)}
                                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                              >
                                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                                  {it.coverImageSnapshot ? (
                                    <img
                                      src={it.coverImageSnapshot}
                                      alt={it.titleSnapshot}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-emerald-800 text-white">
                                      <BookOpen className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900 text-sm truncate">
                                    {it.titleSnapshot}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate mt-0.5">
                                    {it.authorSnapshot || "Author"}
                                  </p>
                                  <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="font-extrabold text-slate-700">
                                      Qty: {it.quantity}
                                    </span>
                                    <span className="font-black text-emerald-700">
                                      {formatCurrency(it.price * it.quantity)}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Customer Delivery Details */}
                        <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100/80 flex items-start gap-3 text-xs">
                          <MapPin className="h-5 w-5 text-emerald-800 shrink-0 mt-0.5" />
                          <div className="text-slate-700">
                            <span className="font-black text-slate-900 block mb-0.5">Customer Delivery Address:</span>
                            <span className="font-medium leading-relaxed">{order.shippingAddress}</span>
                          </div>
                        </div>

                        {/* Status Stage Explanation Banner */}
                        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium shadow-inner">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl shrink-0">
                              {order.status === "Created" && "⏳"}
                              {order.status === "Accepted" && "📦"}
                              {order.status === "Shipped" && "🚚"}
                              {order.status === "Delivered" && "🎉"}
                              {order.status === "Cancelled" && "❌"}
                            </span>
                            <div>
                              <strong className="text-emerald-400 block font-black uppercase tracking-wider text-[11px]">Fulfillment Stage Guidance:</strong>
                              <span className="text-slate-200 mt-0.5 block leading-relaxed">
                                {order.status === "Created" && "New order placed by customer. You must accept this order to authorize packaging."}
                                {order.status === "Accepted" && "Order accepted! Please prepare and package the books, then click Dispatch Order when handed to courier."}
                                {order.status === "Shipped" && "Order Dispatched (Shipped)! Customer is actively tracking package. Click Confirm Final Delivery once handed to customer."}
                                {order.status === "Delivered" && "Delivered Successfully to the customer. Transaction verified."}
                                {order.status === "Cancelled" && "Rejected and Cancelled. No further action required."}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950 border border-emerald-800 px-3.5 py-1.5 rounded-full self-start sm:self-auto shrink-0">
                            Live Sync ✨
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: OVERVIEW MODULES */}
        {activeTab === "overview" && (
          <section className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-300">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <Store className="h-10 w-10 text-emerald-700 mb-4" />
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Business Email</p>
              <p className="mt-1 break-all font-black text-slate-900 text-lg">{currentUser.email}</p>
              
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Mobile Hotlines</p>
              <p className="mt-1 font-black text-slate-900 text-lg">{currentUser.mobileNumber ?? "—"}</p>
              
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Joined Network</p>
              <p className="mt-1 font-black text-slate-900 text-base">{formatDate(currentUser.createdAt)}</p>
            </div>

            <ModuleCard
              icon={LayoutDashboard}
              title="Active Book Listings"
              desc="Manage your book offers and set competitive market pricing. (Catalog module integration.)"
            />
            <ModuleCard
              icon={Boxes}
              title="Stock & Inventory"
              desc="Automated stock reduction when customer checkouts occur."
            />
            <ModuleCard
              icon={ListChecks}
              title="Submit New Title"
              desc="Propose new ISBN records for marketplace catalog verification."
            />
          </section>
        )}
      </div>
    </main>
  );
}

// Helper: Component Module summary card
function ModuleCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Store;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 mb-4">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
      <span className="text-[11px] font-bold text-emerald-700 mt-6 block inline-flex items-center gap-1">
        Module Active ✨
      </span>
    </div>
  );
}
