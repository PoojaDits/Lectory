import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useSubmitNewBook } from "@/hooks/useSeller";
import type { EntityId } from "@/types";

interface SellerSubmitBookTabProps {
  sellerId: EntityId;
}

export default function SellerSubmitBookTab({ sellerId }: SellerSubmitBookTabProps) {
  const submitBook = useSubmitNewBook(sellerId);

  const [form, setForm] = useState({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    description: "",
    coverImage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!/^\d{10}(\d{3})?$/.test(form.isbn.trim())) {
      errs.isbn = "ISBN must be 10 or 13 digits.";
    }
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.author.trim()) errs.author = "Author is required.";
    if (form.coverImage.trim() && !/^https?:\/\/.+/.test(form.coverImage.trim())) {
      errs.coverImage = "Cover image must be a valid URL.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitBook.mutate(
      {
        isbn: form.isbn.trim(),
        title: form.title.trim(),
        author: form.author.trim(),
        publisher: form.publisher.trim() || undefined,
        description: form.description.trim() || undefined,
        coverImage: form.coverImage.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setForm({
            isbn: "",
            title: "",
            author: "",
            publisher: "",
            description: "",
            coverImage: "",
          });
          setTimeout(() => setSuccess(false), 5000);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mt-[65px] animate-in fade-in duration-300">
      <div className="mb-6 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Submit New Book
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Propose a new title to the marketplace catalog. Admin will review it
          and, once approved, you can create a listing for it.
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 mb-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
          <div>
            <p className="font-bold">Submission is reviewed by admin</p>
            <p className="text-indigo-800">
              Duplicate ISBNs are not allowed. The book will be created with
              status "Pending Approval" and will only become visible after
              admin approval.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800 border border-emerald-200 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5" />
          <span>Book submitted successfully! It will appear in the catalog once approved.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="ISBN"
            value={form.isbn}
            onChange={(v) => setForm({ ...form, isbn: v })}
            placeholder="9781847941831"
            error={errors.isbn}
          />
          <TextField
            label="Title"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
            placeholder="Atomic Habits"
            error={errors.title}
          />
        </div>

        <TextField
          label="Author"
          value={form.author}
          onChange={(v) => setForm({ ...form, author: v })}
          placeholder="James Clear"
          error={errors.author}
        />

        <TextField
          label="Publisher (optional)"
          value={form.publisher}
          onChange={(v) => setForm({ ...form, publisher: v })}
          placeholder="Random House"
        />

        <TextField
          label="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={(v) => setForm({ ...form, coverImage: v })}
          placeholder="https://example.com/cover.jpg"
          error={errors.coverImage}
        />

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Description (optional)
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Brief description of the book..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitBook.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-3.5 text-sm font-black text-white hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {submitBook.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Submit for Approval
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-700">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
        }`}
      />
      {error && <p className="mt-1 text-xs font-bold text-rose-600">{error}</p>}
    </div>
  );
}
