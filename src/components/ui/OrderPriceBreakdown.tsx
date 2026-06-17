import type { OrderTotals } from "@/lib/pricing";
import { formatCurrency } from "@/utils/helpers";

interface Props {
  totals: OrderTotals;
  className?: string;
}

/** Compact, read-only price breakdown (subtotal / discount / shipping / tax / total). */
export default function OrderPriceBreakdown({ totals: t, className }: Props) {
  return (
    <dl className={`space-y-1.5 text-xs ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <dt className="text-slate-500">Subtotal</dt>
        <dd className="font-bold text-slate-700">{formatCurrency(t.subtotal)}</dd>
      </div>

      {t.discount > 0 && (
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Discount</dt>
          <dd className="font-bold text-emerald-600">− {formatCurrency(t.discount)}</dd>
        </div>
      )}

      <div className="flex items-center justify-between">
        <dt className="text-slate-500">Shipping</dt>
        <dd className="font-bold text-slate-700">
          {t.shipping === 0 ? "Free" : formatCurrency(t.shipping)}
        </dd>
      </div>

      <div className="flex items-center justify-between">
        <dt className="text-slate-500">Tax (GST)</dt>
        <dd className="font-bold text-slate-700">{formatCurrency(t.tax)}</dd>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
        <dt className="font-black text-slate-900">Total Paid</dt>
        <dd className="font-black text-emerald-700">{formatCurrency(t.total)}</dd>
      </div>
    </dl>
  );
}
