import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { useBookDetail, useBooks, useUpdateBookStatus } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helpers";
import type { BookStatus, MarketBook } from "@/types";

type StatusFilter = "all" | BookStatus;
const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Pending Approval", label: "Pending" },
  { id: "Approved", label: "Approved" },
  { id: "Rejected", label: "Rejected" },
];

const PAGE_SIZE = 8;

type BookApprovalPageProps = {
  onNavigateHome?: () => void;
};

export default function BookApprovalPage(_props: BookApprovalPageProps = {}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedBookId, setSelectedBookId] = useState<string | number | null>(null);

  const { data: books = [], isLoading } = useBooks();
  const updateBook = useUpdateBookStatus();

  // Detect duplicate ISBNs — Rule 1 enforcement helper.
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

  if (selectedBookId) {
    return (
      <BookReviewDetailPage
        bookId={selectedBookId}
        onBack={() => setSelectedBookId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 mt-[65px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-700">
            Admin · Books
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
            Book Approval
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary-600">
            Approve or reject books submitted by sellers. Only{" "}
            <b>Approved</b> books are visible to customers in the marketplace.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900">
          <ShieldCheck className="h-4 w-4" />
          {counts["Pending Approval"]} pending review
          {counts["Pending Approval"] === 1 ? "" : "s"}
        </div>
      </header>

      {/* Duplicate ISBN warning */}
      {duplicateIsbns.size > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
          <div>
            <p className="font-bold">
              {duplicateIsbns.size} duplicate ISBN
              {duplicateIsbns.size === 1 ? "" : "s"} detected in the catalog.
            </p>
            <p className="text-primary-800">
              Rule 1: A book should exist only once in the system. Review and
              merge or reject the duplicates below.
            </p>
          </div>
        </div>
      )}

      {/* ── Filter pills + search ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
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
                    ? "bg-primary-900 text-white shadow-sm"
                    : "border border-secondary-200 bg-white text-secondary-700 hover:bg-secondary-50"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-secondary-100 text-secondary-600"
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
            placeholder="Search by title, author, ISBN, or publisher…"
            className="w-full rounded-full border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* ── Results grid ── */}
      <section>
        {isLoading ? (
          <SkeletonGrid />
        ) : pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-secondary-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
            No books match the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((b) => (
              <BookCard
                key={String(b.id)}
                book={b}
                isDuplicate={duplicateIsbns.has(b.isbn)}
                busy={updateBook.isPending}
                onOpen={() => setSelectedBookId(b.id)}
                onApprove={() =>
                  updateBook.mutate({ id: b.id, status: "Approved" })
                }
                onReject={() =>
                  updateBook.mutate({ id: b.id, status: "Rejected" })
                }
              />
            ))}
          </div>
        )}
      </section>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

// ── Single book card ──────────────────────────────────────────────────────

function BookCard({
  book,
  isDuplicate,
  busy,
  onOpen,
  onApprove,
  onReject,
}: {
  book: MarketBook;
  isDuplicate: boolean;
  busy: boolean;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPending = book.status === "Pending Approval";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
      className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <header className="flex items-start gap-3">
        <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-secondary-900">
            {book.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            by {book.author}
          </p>
        </div>
        <StatusBadge status={book.status} />
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-secondary-600">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ISBN
          </dt>
          <dd
            className={cn(
              "font-mono font-bold",
              isDuplicate ? "text-primary-700" : "text-secondary-800"
            )}
          >
            {book.isbn}
            {isDuplicate && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-extrabold text-primary-800">
                <AlertTriangle className="h-3 w-3" /> duplicate
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Publisher
          </dt>
          <dd className="font-bold text-secondary-800">
            {book.publisher ?? "—"}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Submitted
          </dt>
          <dd className="text-secondary-800">{formatDate(book.createdAt)}</dd>
        </div>
      </dl>

      {book.description && (
        <p className="line-clamp-3 text-xs text-secondary-600">{book.description}</p>
      )}

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-secondary-100 pt-3">
        <div className="text-[11px] text-slate-500">
          {book.reviewedAt && (
            <span>
              {book.status !== "Pending Approval"
                ? `${book.status} on ${formatDate(book.reviewedAt)}`
                : `Submitted ${formatDate(book.createdAt)}`}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {isPending ? (
            <>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); onApprove(); }}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); onReject(); }}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </>
          ) : (
            <>
              {book.status !== "Approved" && (
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); onApprove(); }}
                  disabled={busy}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
                >
                  Approve
                </button>
              )}
              {book.status !== "Rejected" && (
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); onReject(); }}
                  disabled={busy}
                  className="text-xs font-bold text-rose-700 hover:text-rose-800 disabled:opacity-50"
                >
                  Reject
                </button>
              )}
            </>
          )}
        </div>
      </footer>
    </article>
  );
}


function BookReviewDetailPage({
  bookId,
  onBack,
}: {
  bookId: string | number;
  onBack: () => void;
}) {
  const { data: book, isLoading } = useBookDetail(bookId);
  const updateBook = useUpdateBookStatus();

  const approve = () => {
    updateBook.mutate(
      { id: bookId, status: "Approved" },
      { onSuccess: onBack }
    );
  };

  const reject = () => {
    updateBook.mutate(
      { id: bookId, status: "Rejected" },
      { onSuccess: onBack }
    );
  };

  return (
    <div className="space-y-6 mt-[65px]">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to submitted books
      </button>

      {isLoading || !book ? (
        <div className="rounded-2xl border border-secondary-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
          Loading book details…
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-secondary-200 bg-white p-5 shadow-sm">
            <div className="flex h-[440px] items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-100 p-4">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="max-h-full max-w-full rounded-xl object-contain shadow-md" />
              ) : (
                <BookOpen className="h-24 w-24 text-slate-300" />
              )}
            </div>
          </aside>

          <main className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-secondary-100 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-700">Seller Submitted Book</p>
                <h1 className="mt-2 text-3xl font-extrabold text-secondary-900">{book.title}</h1>
                <p className="mt-1 text-lg font-semibold text-secondary-600">by {book.author}</p>
              </div>
              <StatusBadge status={book.status} />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info label="ISBN" value={book.isbn} />
              <Info label="Publisher" value={book.publisher ?? "—"} />
              <Info label="Language" value={book.language ?? "—"} />
              <Info label="Pages" value={book.pageCount ? String(book.pageCount) : "—"} />
              <Info label="Published Date" value={book.publishedDate ?? "—"} />
              <Info label="Submitted" value={formatDate(book.createdAt)} />
            </dl>

            {book.description && (
              <div className="mt-6 rounded-2xl bg-secondary-50 p-4">
                <h2 className="text-sm font-extrabold text-secondary-900">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-secondary-700">{book.description}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-secondary-100 pt-5">
              <button
                type="button"
                onClick={reject}
                disabled={updateBook.isPending || book.status === "Rejected"}
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button
                type="button"
                onClick={approve}
                disabled={updateBook.isPending || book.status === "Approved"}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
            </div>
          </main>
        </section>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary-50 p-4">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-secondary-900">{value}</dd>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm"
          aria-hidden="true"
        >
          <div className="flex items-start gap-3">
            <div className="h-14 w-11 animate-pulse rounded-lg bg-secondary-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-secondary-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-secondary-200" />
            </div>
            <div className="h-5 w-20 animate-pulse rounded-full bg-secondary-200" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-secondary-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-secondary-200" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <div className="h-7 w-20 animate-pulse rounded-full bg-secondary-200" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-secondary-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
