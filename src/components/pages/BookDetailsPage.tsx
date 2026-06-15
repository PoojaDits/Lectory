import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBookDetails } from "@/services/marketplaceApi";
import { queryKeys } from "@/lib/queryKeys";
import { useAddListingToCartAction } from "@/hooks/useCart";
import { useCart } from "@/hooks/useCart";
import { notify } from "@/lib/toast";
import { formatCurrency } from "@/utils/helpers";
import { sameId } from "@/utils/helpers";
import type { Listing } from "@/types";

interface BookDetailsPageProps {
  onNavigateHome: () => void;
}

export default function BookDetailsPage({ onNavigateHome }: BookDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleAddToListing, isPending } = useAddListingToCartAction();
  const { entries } = useCart();

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.books.detail(id!),
    queryFn: () => fetchBookDetails(id!),
    enabled: !!id,
  });

  // ── Seller selection ──
  // Default to the cheapest in-stock listing; let the user switch.
  const inStockListings = useMemo(
    () => (book?.listings ?? []).filter((l) => l.stock > 0),
    [book]
  );

  const defaultListing = useMemo(() => {
    if (!inStockListings.length) return undefined;
    return [...inStockListings].sort((a, b) => a.price - b.price)[0];
  }, [inStockListings]);

  const [selectedListingId, setSelectedListingId] = useState<string | number | null>(
    null
  );

  // Once data arrives, sync the default selection (render-time adjust).
  const resolvedSelectedId =
    selectedListingId ??
    (defaultListing ? defaultListing.id : book?.listings?.[0]?.id ?? null);

  const selectedListing =
    (book?.listings ?? []).find((l) => sameId(l.id, resolvedSelectedId ?? undefined)) ??
    defaultListing;

  const [qty, setQty] = useState(1);

  // Reset quantity when the selected listing changes (render-time adjust).
  const [lastListing, setLastListing] = useState(resolvedSelectedId);
  if (lastListing !== resolvedSelectedId) {
    setLastListing(resolvedSelectedId);
    setQty(1);
  }

  // Has this listing already been added to the cart? (UX hint)
  const alreadyInCart =
    selectedListing != null &&
    entries.some((e) => sameId(e.listingId, selectedListing.id));

  // ── Handlers ──
  const handleAddToCart = () => {
    if (!selectedListing) {
      notify.warning("Please select an available seller.");
      return;
    }
    if (selectedListing.stock <= 0) {
      notify.error("This seller is out of stock.");
      return;
    }
    if (qty > selectedListing.stock) {
      notify.warning(
        `Only ${selectedListing.stock} in stock from ${selectedListing.seller?.businessName}.`
      );
      return;
    }
    if (!book) return;

    handleAddToListing(
      {
        listingId: selectedListing.id,
        bookId: book.id,
        sellerId: selectedListing.sellerId,
        price: selectedListing.price,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        sellerName: selectedListing.seller?.businessName ?? "Unknown seller",
        quantity: qty,
      },
      selectedListing.stock
    );
  };

  // ── Render ──
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-24">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin" />
          <span className="ml-3 font-medium">Loading book…</span>
        </div>
      </main>
    );
  }

  if (isError || !book) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Book not found
          </h1>
          <p className="mt-2 text-slate-500">
            This book may have been removed or is not yet approved.
          </p>
          <Link
            to="/browse"
            className="mt-6 inline-block rounded-full bg-amber-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-800"
          >
            Browse all books
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Cover */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-center">
                  <p className="text-lg font-bold text-white drop-shadow">
                    {book.title}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-lg text-slate-600">by {book.author}</p>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {book.rating != null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-800">
                  ⭐ {book.rating.toFixed(1)}
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                ISBN: {book.isbn}
              </span>
              {book.publisher && (
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  {book.publisher}
                </span>
              )}
              {book.publishedDate && (
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  {book.publishedDate}
                </span>
              )}
              {book.pageCount != null && (
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  {book.pageCount} pages
                </span>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <p className="mt-6 leading-relaxed text-slate-700">
                {book.description}
              </p>
            )}

            {/* Seller listings */}
            <div className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <Store className="h-5 w-5 text-amber-700" />
                Choose a seller
                <span className="text-sm font-medium text-slate-400">
                  ({book.listings.length} available)
                </span>
              </h2>

              <div className="mt-4 space-y-3">
                {book.listings.map((l: Listing & { seller?: { businessName: string } }) => {
                  const isSelected = sameId(l.id, resolvedSelectedId ?? undefined);
                  const oos = l.stock <= 0;
                  return (
                    <button
                      key={String(l.id)}
                      type="button"
                      onClick={() => !oos && setSelectedListingId(l.id)}
                      disabled={oos}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition ${
                        isSelected
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-100 bg-white hover:border-amber-200"
                      } ${oos ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-amber-500 bg-amber-500"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {l.seller?.businessName ?? "Unknown seller"}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-slate-500">
                            <Package className="h-3 w-3" />
                            {oos
                              ? "Out of stock"
                              : `${l.stock} in stock`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-black text-slate-900">
                        {formatCurrency(l.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Quantity stepper */}
              <div className="inline-flex items-center rounded-full border-2 border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={!selectedListing}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-amber-50 hover:text-amber-800 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-base font-bold text-slate-900">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((q) =>
                      Math.min(
                        q + 1,
                        selectedListing?.stock && selectedListing.stock > 0
                          ? selectedListing.stock
                          : q
                      )
                    )
                  }
                  disabled={
                    !selectedListing ||
                    (selectedListing.stock > 0 && qty >= selectedListing.stock)
                  }
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-amber-50 hover:text-amber-800 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  isPending ||
                  !selectedListing ||
                  selectedListing.stock <= 0
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-900 px-8 py-3 font-bold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                {isPending
                  ? "Adding…"
                  : selectedListing && selectedListing.stock <= 0
                    ? "Out of stock"
                    : `Add to Cart · ${formatCurrency(
                        (selectedListing?.price ?? 0) * qty
                      )}`}
              </button>
            </div>

            {alreadyInCart && (
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="mt-4 text-sm font-bold text-amber-700 underline-offset-4 hover:underline"
              >
                This item is in your cart — view cart →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
