import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBookDetails } from "@/services/marketplaceApi";
import { queryKeys } from "@/lib/queryKeys";
import { useAddListingToCartAction, useCart } from "@/hooks/useCart";
import { notify } from "@/lib/toast";
import { formatCurrency, sameId } from "@/utils/helpers";
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

  const resolvedSelectedId =
    selectedListingId ??
    (defaultListing ? defaultListing.id : book?.listings?.[0]?.id ?? null);

  const selectedListing =
    (book?.listings ?? []).find((l) => sameId(l.id, resolvedSelectedId ?? undefined)) ??
    defaultListing;

  const [qty, setQty] = useState(1);

  const [lastListing, setLastListing] = useState(resolvedSelectedId);
  if (lastListing !== resolvedSelectedId) {
    setLastListing(resolvedSelectedId);
    setQty(1);
  }

  const alreadyInCart =
    selectedListing != null &&
    entries.some((e) => sameId(e.listingId, selectedListing.id));

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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-orange-50/40 px-4 pt-24 pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center py-32 text-slate-400">
          <div className="rounded-full bg-white p-4 shadow-md ring-1 ring-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
          </div>
          <span className="mt-4 text-sm sm:text-base font-bold tracking-wide text-slate-600">Loading book details…</span>
        </div>
      </main>
    );
  }

  if (isError || !book) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-orange-50/40 px-4 pt-24 pb-20">
        <div className="mx-auto max-w-xl rounded-3xl sm:rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-14 text-center shadow-xl shadow-slate-200/50 mt-4">
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h1 className="mt-5 sm:mt-6 text-xl sm:text-3xl font-black tracking-tight text-slate-900">
            Book Not Found
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
            This book may have been removed, sold out, or is currently pending catalog approval.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/browse"
              className="w-full sm:w-auto rounded-full bg-primary-900 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary-900/20 transition hover:bg-primary-800"
            >
              Browse All Books
            </Link>
            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full sm:w-auto rounded-full border border-slate-200 bg-white px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/15 to-orange-50/25 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Bar */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs sm:shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        {/* Mobile-to-Desktop Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Responsive Cover & Trust Badges */}
          <div className="lg:col-span-5 xl:col-span-4 w-full max-w-[260px] xs:max-w-[300px] sm:max-w-sm md:max-w-md mx-auto lg:max-w-none">
            <div className="lg:sticky lg:top-28 space-y-4 sm:space-y-6">
              
              {/* Cover Card */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-[2rem] bg-white p-4 sm:p-8 shadow-xl sm:shadow-2xl shadow-primary-900/10 ring-1 ring-slate-100 flex items-center justify-center group">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-contain drop-shadow-md sm:drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-600 to-amber-800 p-6 sm:p-8 text-center shadow-inner">
                    <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-white/40 mb-3 sm:mb-4" />
                    <p className="text-base sm:text-xl font-black tracking-tight text-white drop-shadow line-clamp-4">
                      {book.title}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-white/80 mt-1.5 sm:mt-2">{book.author}</p>
                  </div>
                )}
                
                {/* Status Pills on Image */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
                  {book.inStock ? (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
                      <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-rose-600/90 backdrop-blur px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
                      Out of Stock
                    </span>
                  )}
                  {book.bestPrice != null && (
                    <span className="inline-flex items-center rounded-full bg-slate-900/90 backdrop-blur px-2.5 py-1 text-[10px] sm:text-xs font-black text-amber-300 shadow-md">
                      Best Price
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Trust Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-100 bg-white/80 p-2 sm:p-3.5 text-center shadow-xs sm:shadow-sm backdrop-blur">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 mb-0.5 sm:mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">Genuine</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 hidden sm:block mt-0.5">Verified Edition</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-100 bg-white/80 p-2 sm:p-3.5 text-center shadow-xs sm:shadow-sm backdrop-blur">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 mb-0.5 sm:mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">Fast Ship</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 hidden sm:block mt-0.5">Secure Delivery</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-slate-100 bg-white/80 p-2 sm:p-3.5 text-center shadow-xs sm:shadow-sm backdrop-blur">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 mb-0.5 sm:mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">Easy Return</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 hidden sm:block mt-0.5">Buyer Protect</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Details & Marketplace Buy Box */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            
            {/* Header & Meta */}
            <div className="space-y-3 sm:space-y-4">
              
              {/* Categories & Language Tags */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {(book.categories ?? []).map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100/80 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-primary-900"
                  >
                    <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {cat}
                  </span>
                ))}
                {book.language && (
                  <span className="inline-flex items-center rounded-full bg-orange-100/80 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold capitalize text-orange-900">
                    🌐 {book.language}
                  </span>
                )}
              </div>

              {/* Title & Author */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-snug sm:leading-[1.15]">
                {book.title}
              </h1>
              <p className="text-base sm:text-xl font-bold text-primary-800">
                by <span className="underline decoration-primary-300 decoration-2 underline-offset-4">{book.author}</span>
              </p>

              {/* Key Specs Card Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                {book.rating != null && (
                  <div className="flex flex-col justify-center rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-amber-100/30 p-3 sm:p-4 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500 shrink-0" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800/80 truncate">Rating</span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-900 truncate">{book.rating.toFixed(1)} <span className="text-xs font-bold text-amber-700/60">/ 5.0</span></p>
                  </div>
                )}
                <div className="flex flex-col justify-center rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 truncate">ISBN</span>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 truncate" title={book.isbn}>{book.isbn}</p>
                </div>
                {book.publisher && (
                  <div className="flex flex-col justify-center rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 truncate">Publisher</span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-slate-800 truncate" title={book.publisher}>{book.publisher}</p>
                  </div>
                )}
                {book.pageCount != null && (
                  <div className="flex flex-col justify-center rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <BookOpen className="h-4 w-4 shrink-0" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 truncate">Length</span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-slate-800 truncate">{book.pageCount} Pages</p>
                  </div>
                )}
              </div>

            </div>

            {/* Synopsis / Description */}
            {book.description && (
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/80 p-5 sm:p-8 shadow-xs sm:shadow-sm backdrop-blur">
                <h2 className="text-xs sm:text-base font-black uppercase tracking-wider text-slate-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" /> Book Overview
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-lg whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            )}

            {/* Marketplace Buy Box / Seller Selection */}
            <div className="rounded-2xl sm:rounded-[2.5rem] border-2 border-primary-100 bg-white p-5 sm:p-10 shadow-xl sm:shadow-2xl shadow-primary-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 sm:pb-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-black text-slate-900">
                    <Store className="h-5 w-5 sm:h-6 sm:w-6 text-primary-700" />
                    Select Bookstore & Order
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Compare offers from {book.listings.length} verified seller{book.listings.length === 1 ? "" : "s"}.
                  </p>
                </div>
                {book.bestPrice != null && (
                  <div className="text-left sm:text-right mt-1 sm:mt-0">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Best Available Offer</span>
                    <p className="text-xl sm:text-3xl font-black text-primary-900">
                      {formatCurrency(book.bestPrice)}
                    </p>
                  </div>
                )}
              </div>

              {/* Seller Listings Offers */}
              <div className="mt-4 sm:mt-6 space-y-3">
                {book.listings.map((l: Listing & { seller?: { businessName: string; location?: string } }) => {
                  const isSelected = sameId(l.id, resolvedSelectedId ?? undefined);
                  const oos = l.stock <= 0;
                  return (
                    <button
                      key={String(l.id)}
                      type="button"
                      onClick={() => !oos && setSelectedListingId(l.id)}
                      disabled={oos}
                      className={`group flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-primary-700 bg-primary-50/70 shadow-md scale-[1.01]"
                          : "border-slate-200/80 bg-white hover:border-primary-300 hover:bg-slate-50/50"
                      } ${oos ? "cursor-not-allowed opacity-50 bg-slate-50" : ""}`}
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                        {/* Radio Selector */}
                        <div
                          className={`mt-0.5 sm:mt-0 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            isSelected
                              ? "border-primary-700 bg-primary-700 text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="font-extrabold text-sm sm:text-lg text-slate-900 truncate">
                              {l.seller?.businessName ?? "Unknown Seller"}
                            </span>
                            {l.seller?.location && (
                              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                                ({l.seller.location})
                              </span>
                            )}
                          </div>
                          <p className="flex items-center gap-1 text-[11px] sm:text-sm font-semibold mt-0.5 sm:mt-1">
                            <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            {oos ? (
                              <span className="text-rose-600 font-bold">Sold Out</span>
                            ) : (
                              <span className="text-emerald-700 font-bold">{l.stock} units in stock</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Price Tag */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 shrink-0 w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-400 sm:hidden">Price:</span>
                        <span className="text-lg sm:text-2xl font-black text-slate-900">
                          {formatCurrency(l.price)}
                        </span>
                        {isSelected && !oos && (
                          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-primary-800 bg-primary-100 px-2 py-0.5 rounded-md mt-1">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Bar: Stepper & Checkout CTA */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex flex-col gap-4 sm:gap-5">
                
                {/* Quantity Stepper Row */}
                <div className="flex items-center justify-between bg-slate-50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200">
                  <span className="text-xs font-extrabold uppercase text-slate-500 ml-2">Quantity:</span>
                  <div className="inline-flex items-center rounded-xl bg-white border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={!selectedListing || selectedListing.stock <= 0}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-primary-50 hover:text-primary-800 disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-black text-slate-900">
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
                      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-primary-50 hover:text-primary-800 disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart CTA on left & Plain Total Price on right */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={
                      isPending ||
                      !selectedListing ||
                      selectedListing.stock <= 0
                    }
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-amber-900 px-6 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-lg font-black text-white shadow-lg sm:shadow-xl shadow-primary-900/25 transition-all hover:shadow-2xl hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                    {isPending ? (
                      <span>Adding…</span>
                    ) : selectedListing && selectedListing.stock <= 0 ? (
                      <span>Sold Out</span>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>

                  <div className="text-right shrink-0">
                    <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Total Price</span>
                    <span className="text-xl sm:text-3xl font-black text-slate-900">
                      {formatCurrency((selectedListing?.price ?? 0) * qty)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Already in cart notice */}
              {alreadyInCart && (
                <div className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl bg-primary-50 border border-primary-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-primary-900 flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 hidden xs:inline" />
                    You already have an item from this bookstore in your cart.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="w-full sm:w-auto shrink-0 rounded-full bg-primary-900 px-5 py-2 text-xs font-extrabold text-white transition hover:bg-primary-800 shadow-xs"
                  >
                    View Cart →
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
