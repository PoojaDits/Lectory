import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  DollarSign,
  Edit3,
  Layers,
  Loader2,
  Package,
  Plus,
  Search,
  Store,
  Trash2,
  X,
} from "lucide-react";
import {
  useApprovedBooks,
  useCreateListing,
  useDeleteListing,
  useSellerListings,
  useUpdateListing,
} from "@/hooks/useSeller";
import { formatCurrency } from "@/utils/helpers";
import { fetchApprovedBooks, fetchSellerListings } from "@/services/sellerApi";
import type { EntityId, ListingInput } from "@/types";

type SellerListing = Awaited<ReturnType<typeof fetchSellerListings>>[number];

interface SellerListingsTabProps {
  sellerId: EntityId;
}

export default function SellerListingsTab({ sellerId }: SellerListingsTabProps) {
  const { data: listings = [], isLoading } = useSellerListings(sellerId);
  const { data: approvedBooks = [] } = useApprovedBooks();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing(sellerId);
  const deleteListing = useDeleteListing(sellerId);

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<EntityId | null>(null);

  const filtered = listings.filter(
    (l) =>
      l.book?.title.toLowerCase().includes(search.toLowerCase()) ||
      l.book?.author.toLowerCase().includes(search.toLowerCase()) ||
      l.book?.isbn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 mt-[65px] animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            My Listings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage prices, stock, and visibility for the books you sell. Only
            approved books can be listed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-5 py-2.5 text-sm font-black text-white shadow-md hover:bg-amber-800 transition"
        >
          <Plus className="h-4 w-4" /> Create Listing
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your listings by title, author, or ISBN…"
          className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        />
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="py-24 text-center text-sm font-bold text-slate-400">
          <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin" />
          Loading your marketplace listings…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/70 p-16 text-center">
          <Store className="h-14 w-14 text-slate-300 mb-3" />
          <h3 className="text-lg font-black text-slate-900">No listings yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Create your first listing to start selling books on Lectory.
          </p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-5 rounded-full bg-amber-700 px-6 py-3 text-sm font-black text-white hover:bg-amber-800 transition"
          >
            Create a Listing
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              onDelete={() => {
                if (confirm("Delete this listing? It will no longer be visible to customers.")) {
                  deleteListing.mutate(l.id!);
                }
              }}
              isBusy={updateListing.isPending || deleteListing.isPending}
            />
          ))}
        </div>
      )}

      {/* Create listing dialog */}
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

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {book?.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-amber-800 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-900 text-sm line-clamp-2">
            {book?.title ?? "Untitled book"}
          </h3>
          <p className="text-xs text-slate-500">{book?.author ?? "Unknown author"}</p>
          <p className="mt-1 font-mono text-[11px] text-slate-400">ISBN {book?.isbn ?? "—"}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Price (₹)
              </label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-2 text-sm font-bold outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Stock
              </label>
              <div className="relative mt-1">
                <Package className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-2 text-sm font-bold outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            Listing active
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSave({ price, stock, active })}
              disabled={isBusy}
              className="flex-1 rounded-full bg-amber-700 py-2 text-xs font-black text-white hover:bg-amber-800 transition disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isBusy}
              className="flex-1 rounded-full border border-slate-200 bg-white py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Price</span>
            <span className="font-black text-slate-900">{formatCurrency(listing.price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Stock</span>
            <span className={`font-black ${listing.stock > 0 ? "text-amber-700" : "text-rose-600"}`}>
              {listing.stock > 0 ? `${listing.stock} available` : "Out of stock"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${listing.active && listing.stock > 0
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-200 text-slate-700"
                }`}
            >
              {listing.active && listing.stock > 0 ? "Live" : "Inactive"}
            </span>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 bg-white py-2 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {book?.id && (
        <Link
          to={`/books/${book.id}`}
          className="mt-4 text-center text-xs font-bold text-amber-700 hover:text-amber-800"
        >
          View storefront page →
        </Link>
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
  books: Awaited<ReturnType<typeof fetchApprovedBooks>>;
  onClose: () => void;
  onCreate: (input: ListingInput) => void;
  isPending: boolean;
}) {
  type ApprovedBook = Awaited<ReturnType<typeof fetchApprovedBooks>>[number];
  const [bookId, setBookId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!bookId) return setError("Please select a book.");
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!price || priceNum <= 0) return setError("Price must be greater than zero.");
    if (stock === "" || stockNum < 0) return setError("Stock cannot be negative.");

    onCreate({
      bookId,
      sellerId,
      price: priceNum,
      stock: stockNum,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-700" />
            <h2 className="text-xl font-extrabold text-slate-900">Create Listing</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Choose an approved book from the catalog and set your price and stock.
        </p>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-black text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Book
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            >
              <option value="">Select an approved book…</option>
              {books.map((b: ApprovedBook) => (
                <option key={String(b.id)} value={String(b.id)}>
                  {b.title} — {b.author} (ISBN {b.isbn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Price (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="399"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Stock
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-5 py-2 text-sm font-bold text-white hover:bg-amber-800 transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Create Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
