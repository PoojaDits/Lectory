import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Eye,
  PackageSearch,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import {
  useBooks,
  useCreateBook,
  useDeleteBook,
  useListings,
  useSellers,
  useUpdateBookStatus,
} from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/helpers";
import type { BookStatus, Listing, MarketBook, Seller } from "@/types";

type StatusFilter = "all" | BookStatus;
const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Approved", label: "Approved" },
  { id: "Pending Approval", label: "Pending" },
  { id: "Rejected", label: "Rejected" },
];

const PAGE_SIZE = 8;

/**
 * Catalog Management screen.
 *
 * Implements the document requirement:
 *   "Admin can: Manage marketplace catalog"
 *
 * Lets the admin curate the master book catalog (approve, reject,
 * delete duplicates, and add new titles directly to the marketplace).
 * Each catalog book is shown together with the seller listings that
 * offer it so the admin can see supply at a glance.
 */
export default function CatalogManagementPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: books = [], isLoading } = useBooks();
  const { data: listings = [] } = useListings();
  const { data: sellers = [] } = useSellers();
  const updateBook = useUpdateBookStatus();
  const deleteBook = useDeleteBook();

  // Detect duplicate ISBNs (Rule 1).
  const duplicateIsbns = useMemo(() => {
    const counts = new Map<string, number>();
    books.forEach((b) => counts.set(b.isbn, (counts.get(b.isbn) ?? 0) + 1));
    return new Set(
      Array.from(counts.entries())
        .filter(([, n]) => n > 1)
        .map(([isbn]) => isbn)
    );
  }, [books]);

  const counts = useMemo(
    () => ({
      all: books.length,
      "Pending Approval": books.filter((b) => b.status === "Pending Approval")
        .length,
      Approved: books.filter((b) => b.status === "Approved").length,
      Rejected: books.filter((b) => b.status === "Rejected").length,
    }),
    [books]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books
      .filter((b) => filter === "all" || b.status === filter)
      .filter(
        (b) =>
          !q ||
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          (b.publisher ?? "").toLowerCase().includes(q)
      );
  }, [books, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const setFilterAndReset = (f: StatusFilter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Admin · Catalog
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Catalog Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Curate the marketplace's master book catalog. Each book is unique
            (by ISBN) and may be offered by multiple sellers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
        >
          <Plus className="h-4 w-4" />
          Add book to catalog
        </button>
      </header>

      {/* Duplicate ISBN warning */}
      {duplicateIsbns.size > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">
              {duplicateIsbns.size} duplicate ISBN
              {duplicateIsbns.size === 1 ? "" : "s"} in the catalog.
            </p>
            <p className="text-amber-800">
              A book should exist only once in the system. Delete the
              duplicates below to keep the catalog clean.
            </p>
          </div>
        </div>
      )}

      {/* ── Filter pills + search ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const count =
              f.id === "all" ? counts.all : counts[f.id as BookStatus];
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterAndReset(f.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition",
                  isActive
                    ? "bg-amber-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative ml-auto flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search the catalog…"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* ── Catalog table ── */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div className="col-span-4">Book</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Listings</div>
          <div className="col-span-1">Updated</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Loading catalog…
          </div>
        ) : pageItems.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            <PackageSearch className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            No books match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pageItems.map((b) => (
              <CatalogRow
                key={String(b.id)}
                book={b}
                listings={listings.filter(
                  (l) => String(l.bookId) === String(b.id)
                )}
                sellers={sellers}
                isDuplicate={duplicateIsbns.has(b.isbn)}
                busy={updateBook.isPending || deleteBook.isPending}
                onApprove={() =>
                  updateBook.mutate({ id: b.id, status: "Approved" })
                }
                onReject={() =>
                  updateBook.mutate({ id: b.id, status: "Rejected" })
                }
                onDelete={() => deleteBook.mutate(b.id)}
              />
            ))}
          </ul>
        )}
      </section>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {showAddForm && <AddBookDialog onClose={() => setShowAddForm(false)} />}
    </div>
  );
}

// ── Catalog row ────────────────────────────────────────────────────────────

function CatalogRow({
  book,
  listings,
  sellers,
  isDuplicate,
  busy,
  onApprove,
  onReject,
  onDelete,
}: {
  book: MarketBook;
  listings: Listing[];
  sellers: Seller[];
  isDuplicate: boolean;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const inStockCount = listings.filter((l) => l.active && l.stock > 0).length;
  const bestPrice = listings
    .filter((l) => l.active && l.stock > 0)
    .reduce<number | null>(
      (min, l) => (min === null || l.price < min ? l.price : min),
      null
    );

  return (
    <li className="px-5 py-4 text-sm transition hover:bg-amber-50/40">
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-4 min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {book.title}
              </p>
              <p className="truncate text-xs text-slate-500">
                {book.author} ·{" "}
                <span
                  className={cn(
                    "font-mono",
                    isDuplicate ? "font-bold text-amber-700" : ""
                  )}
                >
                  ISBN {book.isbn}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <StatusBadge status={book.status} />
          {isDuplicate && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
              <AlertTriangle className="h-3 w-3" /> duplicate
            </p>
          )}
        </div>

        <div className="col-span-3">
          {listings.length === 0 ? (
            <span className="text-xs text-slate-400">
              No seller listings yet
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                {inStockCount} in stock
              </span>
              <span className="text-xs text-slate-500">
                of {listings.length} listing
                {listings.length === 1 ? "" : "s"}
              </span>
              {bestPrice !== null && (
                <span className="text-xs font-bold text-slate-700">
                  · from {formatCurrency(bestPrice)}
                </span>
              )}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                <Eye className="h-3.5 w-3.5" />
                {expanded ? "Hide" : "View"}
              </button>
            </div>
          )}
        </div>

        <div className="col-span-1 text-xs text-slate-500">
          {formatDate(book.reviewedAt ?? book.createdAt)}
        </div>

        <div className="col-span-2 flex flex-wrap justify-end gap-2">
          {book.status !== "Approved" && (
            <button
              type="button"
              onClick={onApprove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {book.status !== "Rejected" && (
            <button
              type="button"
              onClick={onReject}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
            >
              Reject
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            title="Delete from catalog"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {expanded && listings.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Seller listings for this book
          </p>
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-2">Seller</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {listings.map((l) => {
                const seller = sellers.find(
                  (s) => String(s.id) === String(l.sellerId)
                );
                return (
                  <tr key={String(l.id)} className="text-slate-700">
                    <td className="py-2 font-bold text-slate-900">
                      {seller?.businessName ?? `Seller #${l.sellerId}`}
                    </td>
                    <td className="py-2">{formatCurrency(l.price)}</td>
                    <td className="py-2">{l.stock}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                          l.active && l.stock > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-700"
                        )}
                      >
                        {l.active
                          ? l.stock > 0
                            ? "In stock"
                            : "Out of stock"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </li>
  );
}

// ── Add book dialog ────────────────────────────────────────────────────────

function AddBookDialog({ onClose }: { onClose: () => void }) {
  const create = useCreateBook();
  const [form, setForm] = useState({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.isbn.trim()) errs.isbn = "ISBN is required.";
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.author.trim()) errs.author = "Author is required.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    create.mutate(
      {
        isbn: form.isbn.trim(),
        title: form.title.trim(),
        author: form.author.trim(),
        publisher: form.publisher.trim() || undefined,
        description: form.description.trim() || undefined,
      },
      {
        onSuccess: () => onClose(),
      }
    );
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
        <h2 className="text-xl font-extrabold text-slate-900">
          Add book to catalog
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The new book will be marked as <b>Approved</b> and become visible to
          customers immediately. Sellers can then create their own listings for
          it.
        </p>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <FormField
            label="ISBN"
            placeholder="9781847941831"
            value={form.isbn}
            error={errors.isbn}
            onChange={(v) => setForm({ ...form, isbn: v })}
          />
          <FormField
            label="Title"
            placeholder="Atomic Habits"
            value={form.title}
            error={errors.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />
          <FormField
            label="Author"
            placeholder="James Clear"
            value={form.author}
            error={errors.author}
            onChange={(v) => setForm({ ...form, author: v })}
          />
          <FormField
            label="Publisher (optional)"
            placeholder="Random House"
            value={form.publisher}
            onChange={(v) => setForm({ ...form, publisher: v })}
          />
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Description (optional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
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
              disabled={create.isPending}
              className="rounded-full bg-amber-900 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800 disabled:opacity-50"
            >
              {create.isPending ? "Adding…" : "Add to catalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-700">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-4",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-amber-500 focus:ring-amber-100"
        )}
      />
      {error && (
        <p className="mt-1 text-xs font-bold text-rose-600">{error}</p>
      )}
    </div>
  );
}
