import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  DollarSign,
  Edit3,
  Eye,
  Layers,
  Loader2,
  Package,
  PauseCircle,
  Plus,
  Search,
  Sparkles,
  Store,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import {
  useApprovedBooks,
  useCreateListing,
  useDeleteListing,
  useSellerListings,
  useUpdateListing,
} from "@/hooks/useSeller";
import { formatCurrency } from "@/utils/helpers";
import { fetchSellerListings } from "@/services/sellerApi";
import type { EntityId, ListingInput } from "@/types";

type SellerListing = Awaited<ReturnType<typeof fetchSellerListings>>[number];

interface SellerListingsTabProps {
  sellerId: EntityId;
}

type StatusFilter = "all" | "live" | "inactive" | "out";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "inactive", label: "Inactive" },
  { id: "out", label: "Out of stock" },
];

export default function SellerListingsTab({ sellerId }: SellerListingsTabProps) {
  const { data: listings = [], isLoading } = useSellerListings(sellerId);
  const { data: approvedBooks = [] } = useApprovedBooks();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing(sellerId);
  const deleteListing = useDeleteListing(sellerId);

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<EntityId | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  // ── Modal-based delete confirmation (replaces browser confirm()) ──
  const [pendingDeleteId, setPendingDeleteId] = useState<EntityId | null>(null);

  // ── Stats (computed once per listings change) ──
  const stats = useMemo(() => {
    let live = 0;
    let inactive = 0;
    let out = 0;
    let totalUnits = 0;
    for (const l of listings) {
      totalUnits += l.stock;
      if (!l.active) {
        inactive += 1;
      } else if (l.stock <= 0) {
        out += 1;
      } else {
        live += 1;
      }
    }
    return { live, inactive, out, totalUnits };
  }, [listings]);

  // ── Filter (search + status) ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      const isLive = l.active && l.stock > 0;
      const isOut = l.active && l.stock <= 0;
      if (statusFilter === "live" && !isLive) return false;
      if (statusFilter === "inactive" && l.active) return false;
      if (statusFilter === "out" && !isOut) return false;

      if (!q) return true;
      return (
        l.book?.title.toLowerCase().includes(q) ||
        l.book?.author.toLowerCase().includes(q) ||
        l.book?.isbn.toLowerCase().includes(q)
      );
    });
  }, [listings, search, statusFilter]);

  return (
    <div className="space-y-6 mt-[65px] animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 border-b border-secondary-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary-700">
            <Sparkles className="h-3 w-3" /> Seller · Listings
          </p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-secondary-900 sm:text-4xl">
            My Listings
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage prices, stock, and visibility for the books you sell. Only
            approved books can be listed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-primary-900/20 transition hover:-translate-y-0.5 hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" /> Create Listing
        </button>
      </div>

      {/* ── Stats strip ── */}
      {!isLoading && listings.length > 0 && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Total listings"
            value={listings.length}
            icon={Layers}
            tone="slate"
          />
          <StatTile
            label="Live now"
            value={stats.live}
            icon={CheckCircle2}
            tone="emerald"
          />
          <StatTile
            label="Out of stock"
            value={stats.out}
            icon={XCircle}
            tone="rose"
          />
          <StatTile
            label="Total units"
            value={stats.totalUnits}
            icon={TrendingUp}
            tone="amber"
          />
        </section>
      )}

      {/* ── Search + status filter pills ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? listings.length
                : f.id === "live"
                  ? stats.live
                  : f.id === "inactive"
                    ? stats.inactive
                    : stats.out;
            const isActive = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition",
                  isActive
                    ? "bg-primary-900 text-white shadow-sm"
                    : "border border-secondary-200 bg-white text-secondary-700 hover:bg-secondary-50",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-secondary-100 text-secondary-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative md:ml-auto md:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or ISBN…"
            className="w-full rounded-2xl border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* ── Listings grid ── */}
      {isLoading ? (
        <ListingsSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          hasAny={listings.length > 0}
          onCreate={() => setShowCreate(true)}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {filtered.map((l) => (
            <ListingCard
              key={String(l.id)}
              listing={l}
              isEditing={editingId === l.id}
              onEdit={() => setEditingId(l.id)}
              onCancelEdit={() => setEditingId(null)}
              onSave={(updates) => {
                updateListing.mutate({ id: l.id!, updates });
                setEditingId(null);
              }}
              // Was: if (confirm("Delete this listing? …")) { deleteListing.mutate(...) }
              // Now: opens a styled confirmation modal that matches the rest of the UI.
              onDelete={() => setPendingDeleteId(l.id)}
              isBusy={updateListing.isPending || deleteListing.isPending}
            />
          ))}
        </div>
      )}

      {/* ── Create listing dialog ── */}
      {showCreate && (
        <CreateListingDialog
          sellerId={sellerId}
          books={approvedBooks}
          onClose={() => setShowCreate(false)}
          onCreate={(input) => {
            createListing.mutate(input, {
              onSuccess: () => setShowCreate(false),
            });
          }}
          isPending={createListing.isPending}
        />
      )}

      {/* ── Delete-listing confirmation modal (replaces window.confirm) ── */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId === null) return;
          deleteListing.mutate(pendingDeleteId);
          setPendingDeleteId(null);
        }}
        title="Delete this listing?"
        description={
          <>
            It will no longer be visible to customers on the marketplace. You
            can recreate it later from the same book if you change your mind.
          </>
        }
        confirmLabel="Delete listing"
        cancelLabel="Keep listing"
        tone="danger"
        isPending={deleteListing.isPending}
      />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Layers;
  tone: "slate" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    slate: "bg-secondary-100 text-secondary-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-primary-100 text-primary-800",
    rose: "bg-rose-100 text-rose-700",
  } as const;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          tones[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-black leading-none text-secondary-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function ListingCard({
  listing,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  isBusy,
}: {
  listing: SellerListing;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updates: { price?: number; stock?: number; active?: boolean }) => void;
  onDelete: () => void;
  isBusy: boolean;
}) {
  const [price, setPrice] = useState(listing.price);
  const [stock, setStock] = useState(listing.stock);
  const [active, setActive] = useState(listing.active);
  const book = listing.book;

  const isLive = listing.active && listing.stock > 0;
  const isOut = listing.active && listing.stock <= 0;
  // Cap the bar at 50 units so even large stock feels meaningful
  const stockPct = Math.min(100, Math.max(0, (listing.stock / 50) * 100));
  const stockTone =
    isOut
      ? "bg-rose-500"
      : listing.stock < 10
        ? "bg-amber-500"
        : "bg-emerald-500";
  const stockChipTone = isOut
    ? "bg-rose-500/95 text-white"
    : "bg-emerald-500/95 text-white";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-secondary-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary-900/10">
      {/* ── Cover image ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-secondary-100">
        {book?.coverImage ? (
          <img
            src={book.coverImage}
            alt={book?.title ?? "Book cover"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-slate-300" />
          </div>
        )}

        {/* Top-left: stock chip */}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-sm backdrop-blur",
              stockChipTone,
            )}
          >
            {isOut ? (
              <>
                <XCircle className="h-2 w-2" /> Out
              </>
            ) : (
              <>
                <Package className="h-2 w-2" /> {listing.stock}
              </>
            )}
          </span>
        </div>

        {/* Top-right: live/inactive chip */}
        <div className="absolute right-2 top-2">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-sm backdrop-blur",
              isLive
                ? "bg-primary-700/95 text-white"
                : "bg-secondary-900/85 text-white",
            )}
          >
            {isLive ? (
              <>
                <span className="relative flex h-1 w-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-white" />
                </span>
                Live
              </>
            ) : (
              <>
                <PauseCircle className="h-2 w-2" /> Off
              </>
            )}
          </span>
        </div>

        {/* Bottom: price floating on the cover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary-900/85 via-secondary-900/40 to-transparent px-2 pb-1.5 pt-2">
          <p className="text-[8px] font-bold uppercase tracking-wider text-amber-200">
            Price
          </p>
          <p className="text-sm font-black leading-tight text-white">
            {formatCurrency(listing.price)}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-xs font-bold text-secondary-900">
            {book?.title ?? "Untitled book"}
          </h3>
          <p className="line-clamp-1 text-[10px] text-slate-500">
            {book?.author ?? "Unknown author"}
          </p>
          <p className="mt-0.5 font-mono text-[9px] text-slate-400">
            ISBN {book?.isbn ?? "—"}
          </p>
        </div>

        {isEditing ? (
          <EditForm
            price={price}
            stock={stock}
            active={active}
            isBusy={isBusy}
            onPriceChange={setPrice}
            onStockChange={setStock}
            onActiveChange={setActive}
            onSave={() => onSave({ price, stock, active })}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            {/* Stock progress bar */}
            <div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-secondary-100">
                <div
                  className={cn("h-full rounded-full transition-all", stockTone)}
                  style={{ width: `${stockPct}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex items-center gap-1 pt-1">
              <button
                type="button"
                onClick={onEdit}
                disabled={isBusy}
                aria-label={`Edit ${book?.title ?? "listing"}`}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-primary-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-primary-800 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isBusy}
                aria-label={`Delete ${book?.title ?? "listing"}`}
                className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EditForm({
  price,
  stock,
  active,
  isBusy,
  onPriceChange,
  onStockChange,
  onActiveChange,
  onSave,
  onCancel,
}: {
  price: number;
  stock: number;
  active: boolean;
  isBusy: boolean;
  onPriceChange: (n: number) => void;
  onStockChange: (n: number) => void;
  onActiveChange: (b: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-3 rounded-xl bg-secondary-50 p-2">
      <div>
        <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
          Price (₹)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full rounded-xl border border-secondary-200 bg-white py-2 pl-8 pr-2 text-sm font-bold outline-none focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
          Stock
        </label>
        <div className="relative">
          <Package className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => onStockChange(Number(e.target.value))}
            className="w-full rounded-xl border border-secondary-200 bg-white py-2 pl-8 pr-2 text-sm font-bold outline-none focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs font-bold text-secondary-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => onActiveChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-amber-500"
        />
        Listing active
      </label>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={isBusy}
          className="flex-1 rounded-full bg-primary-700 py-2 text-xs font-black text-white transition hover:bg-primary-800 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-secondary-200 bg-white py-2 text-xs font-black text-secondary-700 transition hover:bg-secondary-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ListingsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="flex flex-col overflow-hidden rounded-xl border border-secondary-100 bg-white shadow-sm"
        >
          <div className="aspect-[4/5] animate-pulse bg-secondary-100" />
          <div className="space-y-1.5 p-2">
            <div className="h-2.5 w-3/4 animate-pulse rounded bg-secondary-100" />
            <div className="h-2 w-1/2 animate-pulse rounded bg-secondary-100" />
            <div className="h-1 w-full animate-pulse rounded-full bg-secondary-100" />
            <div className="flex gap-1 pt-1">
              <div className="h-5 flex-1 animate-pulse rounded-full bg-secondary-100" />
              <div className="h-5 w-7 animate-pulse rounded-full bg-secondary-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasAny,
  onCreate,
}: {
  hasAny: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-primary-200 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-16 text-center">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-100 text-primary-700 shadow-inner">
        <Store className="h-10 w-10" />
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-primary-200">
          <Sparkles className="h-3.5 w-3.5 text-primary-600" />
        </span>
      </div>
      {hasAny ? (
        <>
          <h3 className="text-lg font-black text-secondary-900">
            No listings match this filter
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Try a different status filter, or clear your search to see all
            your listings.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-black text-secondary-900">
            Your storefront is empty
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Create your first listing to start selling books on Lectory.
            Pick from any book that's already approved in the catalog.
          </p>
          <button
            type="button"
            onClick={onCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-black text-white shadow-md shadow-primary-900/20 transition hover:-translate-y-0.5 hover:bg-primary-800"
          >
            <Plus className="h-4 w-4" /> Create your first listing
          </button>
        </>
      )}
    </div>
  );
}

function CreateListingDialog({
  sellerId,
  books,
  onClose,
  onCreate,
  isPending,
}: {
  sellerId: EntityId;
  books: Awaited<ReturnType<typeof useApprovedBooks>["data"]>;
  onClose: () => void;
  onCreate: (input: ListingInput) => void;
  isPending: boolean;
}) {
  type ApprovedBook = NonNullable<typeof books>[number];
  const [bookId, setBookId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!bookId) return setError("Please select a book.");
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!price || priceNum <= 0)
      return setError("Price must be greater than zero.");
    if (stock === "" || stockNum < 0)
      return setError("Stock cannot be negative.");

    onCreate({
      bookId,
      sellerId,
      price: priceNum,
      stock: stockNum,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary-700">
              <Sparkles className="h-3 w-3" /> New listing
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-secondary-900">
              Create Listing
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose an approved book from the catalog and set your price and
              stock.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1 text-secondary-400 transition hover:bg-secondary-100 hover:text-secondary-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-secondary-700">
              Book
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full rounded-xl border border-secondary-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
            >
              <option value="">Select an approved book…</option>
              {books?.map((b: ApprovedBook) => (
                <option key={String(b.id)} value={String(b.id)}>
                  {b.title} — {b.author} (ISBN {b.isbn})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-secondary-700">
              Price (₹)
            </label>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="399"
                className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-secondary-700">
              Stock
            </label>
            <div className="relative">
              <Package className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-secondary-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-secondary-200 bg-white px-4 py-2 text-sm font-bold text-secondary-700 transition hover:bg-secondary-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-primary-800 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
