import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  LogIn,
  Search,
  ShieldAlert,
  ShieldCheck,
  Store,
  UserCircle,
  XCircle,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { useSellers, useUpdateSellerStatus } from "@/hooks/useAdmin";
import {
  sellerToAuthUser,
  useImpersonation,
} from "@/hooks/useImpersonation";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helpers";
import type { Seller, SellerStatus } from "@/types";

type StatusFilter = "all" | SellerStatus;
const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Pending Approval", label: "Pending" },
  { id: "Approved", label: "Approved" },
  { id: "Rejected", label: "Rejected" },
];

const PAGE_SIZE = 8;


export default function SellerApprovalPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | number | null>(null);

  const { data: sellers = [], isLoading } = useSellers();
  const updateSeller = useUpdateSellerStatus();
  const { start: startImpersonation, isImpersonating } = useImpersonation();

  const counts = useMemo(
    () => ({
      all: sellers.length,
      "Pending Approval": sellers.filter(
        (s) => s.status === "Pending Approval"
      ).length,
      Approved: sellers.filter((s) => s.status === "Approved").length,
      Rejected: sellers.filter((s) => s.status === "Rejected").length,
    }),
    [sellers]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sellers
      .filter((s) => filter === "all" || s.status === filter)
      .filter(
        (s) =>
          !q ||
          s.businessName.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.mobileNumber.toLowerCase().includes(q)
      );
  }, [sellers, filter, search]);

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

  const handleImpersonate = (s: Seller) => {
    if (s.status !== "Approved") {
      // Non-approved sellers cannot access the seller dashboard, so
      // impersonating them would just bounce them off.
      return;
    }
    startImpersonation(sellerToAuthUser(s));
  };

  return (
    <div className="space-y-6 mt-[65px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-700">
            Admin · Sellers
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900">
            Seller Approval
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary-600">
            Review seller registrations. Only <b>Approved</b> sellers can create
            listings and appear in the marketplace. Use{" "}
            <b>Login as</b> on approved sellers to debug their experience.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-bold text-primary-900">
          <ShieldCheck className="h-4 w-4" />
          {counts["Pending Approval"]} pending review
          {counts["Pending Approval"] === 1 ? "" : "s"}
        </div>
      </header>

      {isImpersonating && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-primary-50 px-4 py-3 text-sm text-primary-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
          <p className="font-semibold">
            You are currently impersonating another user. Finish that session
            (use the yellow banner above) before starting a new one.
          </p>
        </div>
      )}

      {/* ── Filter pills + search ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const count =
              f.id === "all" ? counts.all : counts[f.id as SellerStatus];
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
            placeholder="Search by business, contact, email, or mobile…"
            className="w-full rounded-full border border-secondary-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* ── Results table ── */}
      <section className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 gap-4 border-b border-secondary-200 bg-secondary-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          <div className="col-span-4">Business</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Joined</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <SkeletonRows />
        ) : pageItems.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No sellers match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-secondary-100">
            {pageItems.map((s) => (
              <SellerRow
                key={String(s.id)}
                seller={s}
                busy={updateSeller.isPending}
                impersonateDisabled={isImpersonating}
                onApprove={() =>
                  updateSeller.mutate({ id: s.id!, status: "Approved" })
                }
                onReject={() =>
                  updateSeller.mutate({ id: s.id!, status: "Rejected" })
                }
                onImpersonate={() => {
                  setConfirmId(s.id ?? null);
                }}
                confirming={confirmId === s.id}
                onConfirmImpersonate={() => {
                  handleImpersonate(s);
                  setConfirmId(null);
                }}
                onCancelConfirm={() => setConfirmId(null)}
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
    </div>
  );
}

// ── Single row ─────────────────────────────────────────────────────────────

function SellerRow({
  seller,
  busy,
  impersonateDisabled,
  onApprove,
  onReject,
  onImpersonate,
  confirming,
  onConfirmImpersonate,
  onCancelConfirm,
}: {
  seller: Seller;
  busy: boolean;
  impersonateDisabled: boolean;
  onApprove: () => void;
  onReject: () => void;
  onImpersonate: () => void;
  confirming: boolean;
  onConfirmImpersonate: () => void;
  onCancelConfirm: () => void;
}) {
  const isPending = seller.status === "Pending Approval";
  const isApproved = seller.status === "Approved";
  const isRejected = seller.status === "Rejected";
  const canImpersonate = isApproved && !impersonateDisabled;

  return (
    <li className="px-5 py-4 text-sm transition hover:bg-primary-50/40">
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-4 min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
              <Store className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-secondary-900">
                {seller.businessName}
              </p>
              <p className="truncate text-xs text-slate-500">
                ID #{String(seller.id)}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-3 min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-secondary-900">
            <UserCircle className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{seller.contactPerson}</span>
          </div>
          <p className="truncate text-xs text-slate-500">{seller.email}</p>
          <p className="truncate text-xs text-slate-500">
            {seller.mobileNumber}
          </p>
        </div>

        <div className="col-span-2">
          <StatusBadge status={seller.status} />
          {seller.reviewedAt && (
            <p className="mt-1 text-[11px] text-slate-400">
              {isApproved
                ? "Approved"
                : isRejected
                  ? "Rejected"
                  : "Reviewed"}{" "}
              on {formatDate(seller.reviewedAt)}
            </p>
          )}
        </div>

        <div className="col-span-1 text-xs text-slate-500">
          {formatDate(seller.createdAt)}
        </div>

        <div className="col-span-2 flex flex-wrap justify-end gap-2">
          {isPending && (
            <>
              <ActionBtn
                tone="emerald"
                label="Approve"
                icon={CheckCircle2}
                onClick={onApprove}
                disabled={busy}
              />
              <ActionBtn
                tone="rose"
                label="Reject"
                icon={XCircle}
                onClick={onReject}
                disabled={busy}
              />
            </>
          )}
          {!isPending && !isApproved && !isRejected && (
            <ActionBtn
              tone="slate"
              label="Reviewed"
              icon={Eye}
              onClick={() => undefined}
              disabled
            />
          )}
          {!isApproved && (
            <button
              type="button"
              onClick={onApprove}
              disabled={busy}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {!isRejected && (
            <button
              type="button"
              onClick={onReject}
              disabled={busy}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 disabled:opacity-50"
            >
              Reject
            </button>
          )}
          {/* Impersonation — only for approved sellers */}
          {isApproved && (
            <ActionBtn
              tone="indigo"
              label={confirming ? "Confirm?" : "Login as"}
              icon={LogIn}
              onClick={onImpersonate}
              disabled={!canImpersonate}
            />
          )}
        </div>
      </div>

      {/* Inline confirmation strip */}
      {confirming && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs">
          <p className="font-semibold text-indigo-900">
            Impersonate <b>{seller.businessName}</b>? You'll see the
            marketplace exactly as they do. You can exit from the yellow
            banner at any time.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelConfirm}
              className="rounded-full border border-secondary-200 bg-white px-3 py-1.5 text-xs font-bold text-secondary-700 transition hover:bg-secondary-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmImpersonate}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-800"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login as seller
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  tone,
  disabled,
}: {
  icon: typeof CheckCircle2;
  label: string;
  onClick: () => void;
  tone: "emerald" | "rose" | "slate" | "indigo";
  disabled?: boolean;
}) {
  const tones = {
    emerald:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    slate: "border-secondary-200 bg-secondary-50 text-secondary-700 hover:bg-secondary-100",
    indigo:
      "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-secondary-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-12 items-center gap-4 px-5 py-4"
          aria-hidden="true"
        >
          <div className="col-span-4 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-secondary-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 animate-pulse rounded bg-secondary-200" />
              <div className="h-2 w-1/3 animate-pulse rounded bg-secondary-200" />
            </div>
          </div>
          <div className="col-span-3 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-secondary-200" />
            <div className="h-2 w-2/3 animate-pulse rounded bg-secondary-200" />
          </div>
          <div className="col-span-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-secondary-200" />
          </div>
          <div className="col-span-1">
            <div className="h-3 w-20 animate-pulse rounded bg-secondary-200" />
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <div className="h-7 w-20 animate-pulse rounded-full bg-secondary-200" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-secondary-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
