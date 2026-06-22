import { useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Send,
  ShieldAlert,
  X,
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!/^\d{10}(\d{3})?$/.test(form.isbn.trim())) {
      errs.isbn = "ISBN must be 10 or 13 digits.";
    }
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.author.trim()) errs.author = "Author is required.";
    // No URL validation needed — coverImage is now a data URL from file upload
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, coverImage: "Image must be under 5 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          setImagePreview(dataUrl);
          setForm((prev) => ({ ...prev, coverImage: dataUrl }));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setTimeout(() => setSuccess(false), 5000);
        },
      }
    );
  };

  return (
    <div className="max-w-none mt-[65px] animate-in fade-in duration-300">
      <div className="mb-6 border-b border-secondary-100 pb-6">
        <h2 className="text-2xl font-black text-secondary-900 sm:text-3xl">
          Submit New Book
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Propose a new title to the marketplace catalog. Admin will review it
          and, once approved, you can create a listing for it.
        </p>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900 mb-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
          <div>
            <p className="font-bold">Submission is reviewed by admin</p>
            <p className="text-primary-800">
              Duplicate ISBNs are not allowed. The book will be created with
              status "Pending Approval" and will only become visible after
              admin approval.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-primary-50 p-4 text-sm font-black text-primary-800 border border-primary-200 animate-in fade-in">
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

        {/* ── Cover Image Upload ── */}
        <div>
          <label className="mb-1 block text-xs font-bold text-secondary-700">
            Cover Image (optional)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                handleImageFile(file);
              }
            }}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white px-4 py-8 transition hover:border-amber-400 hover:bg-primary-50/30 ${imagePreview
                ? "border-amber-300"
                : "border-secondary-200"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
              }}
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="h-40 w-auto rounded-lg object-contain shadow-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setForm({ ...form, coverImage: "" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition hover:bg-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="mt-3 text-xs font-semibold text-primary-700">
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <>
                <ImagePlus className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm font-semibold text-secondary-600">
                  Click to upload or drag &amp; drop
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  PNG, JPG, WEBP up to 5 MB
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-secondary-700">
            Description (optional)
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Brief description of the book..."
            className="w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitBook.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-8 py-3.5 text-sm font-black text-white hover:bg-primary-800 transition shadow-lg shadow-primary-900/20 disabled:opacity-50"
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
      <label className="mb-1 block text-xs font-bold text-secondary-700">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 ${error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-secondary-200 focus:border-amber-500 focus:ring-primary-100"
          }`}
      />
      {error && <p className="mt-1 text-xs font-bold text-rose-600">{error}</p>}
    </div>
  );
}
