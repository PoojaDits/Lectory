import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useCart,
  useClearCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/hooks/useCart";
import { formatCurrency } from "@/utils/helpers";

interface CartPageProps {
  onNavigateHome: () => void;
}

export default function CartPage({ onNavigateHome }: CartPageProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { entries, count, subtotal, isLoading } = useCart();
  const updateQty = useUpdateCartQuantity();
  const removeEntry = useRemoveFromCart();
  const clearCart = useClearCart();

  // (ProtectedRoute already guarantees a customer, but keep the guard for the
  // rare impersonation edge cases.)
  if (currentUser && currentUser.role !== "customer") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-900 shadow-sm transition hover:bg-primary-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-7 w-7 text-primary-700" />
            <h1 className="text-3xl font-black tracking-tight text-secondary-900 sm:text-4xl">
              My Cart
            </h1>
          </div>
          <p className="mt-2 text-secondary-600">
            {count > 0
              ? `${count} item${count === 1 ? "" : "s"} in your cart`
              : "Your cart is waiting for great books."}
          </p>
        </header>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span className="ml-3 font-medium">Loading your cart…</span>
          </div>
        ) : entries.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-primary-200 bg-white/70 p-12 text-center">
            <div className="rounded-full bg-primary-50 p-6">
              <ShoppingCart className="h-12 w-12 text-amber-400" />
            </div>
            <h2 className="mt-5 text-xl font-black text-secondary-900">
              Your cart is empty
            </h2>
            <p className="mt-2 max-w-sm text-slate-500">
              Browse the catalog and add the books you love — they'll show up
              here.
            </p>
            <Link
              to="/browse"
              className="mt-6 rounded-full bg-primary-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-800"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          /* Cart contents */
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Items */}
            <div className="space-y-4">
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li
                    key={String(entry.id)}
                    className="flex gap-4 rounded-2xl border border-secondary-100 bg-white p-4 shadow-sm"
                  >
                    {/* Cover */}
                    <Link
                      to={`/books/${entry.bookId}`}
                      className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary-100"
                    >
                      {entry.coverImage ? (
                        <img
                          src={entry.coverImage}
                          alt={entry.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600">
                          <BookOpen className="h-6 w-6 text-white/60" />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 font-bold text-secondary-900">
                            {entry.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {entry.author}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-800">
                            <Store className="h-3 w-3" />
                            {entry.sellerName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEntry.mutate(entry.id)}
                          aria-label={`Remove ${entry.title} from cart`}
                          className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-3">
                        {/* Quantity stepper */}
                        <div className="inline-flex items-center rounded-full border border-secondary-200">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty.mutate({
                                id: entry.id,
                                quantity: entry.quantity - 1,
                              })
                            }
                            disabled={entry.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-600 transition hover:bg-primary-50 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-secondary-900">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty.mutate({
                                id: entry.id,
                                quantity: entry.quantity + 1,
                              })
                            }
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-600 transition hover:bg-primary-50 hover:text-primary-800"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {formatCurrency(entry.price)} each
                          </p>
                          <p className="text-lg font-black text-secondary-900">
                            {formatCurrency(entry.price * entry.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Clear cart */}
              <button
                type="button"
                onClick={() => clearCart.mutate()}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Clear cart
              </button>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-3xl border border-secondary-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-black text-secondary-900">
                Order Summary
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Items</dt>
                  <dd className="font-bold text-secondary-900">{count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-bold text-secondary-900">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Shipping</dt>
                  <dd className="font-bold text-emerald-600">Free</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-secondary-100 pt-4">
                <span className="font-black text-secondary-900">Total</span>
                <span className="text-2xl font-black text-primary-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex items-center justify-center w-full rounded-full bg-primary-900 px-6 py-3.5 font-black text-white shadow-lg shadow-primary-900/20 transition hover:bg-primary-800"
              >
                Proceed to Secure Checkout
              </Link>
              <p className="mt-3 text-center text-xs text-slate-400">
                Allows address selection and order placement.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
