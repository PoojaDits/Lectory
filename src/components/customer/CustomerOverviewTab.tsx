import { Link } from "react-router-dom";
import {
  Edit2,
  Mail,
  Calendar,
  Tag,
  User,
  Globe,
  MapPin,
} from "lucide-react";
import type { Customer, Order } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import StatusBadge from "@/components/ui/StatusBadge";

interface CustomerOverviewTabProps {
  customer: Customer;
  orders: Order[];
  cartCount: number;
}

export default function CustomerOverviewTab({
  customer,
  orders,
  cartCount,
}: CustomerOverviewTabProps) {
  const defaultAddress =
    customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  return (
    <div className="flex gap-6 p-6 bg-[#f8f7f4] min-h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-80 shrink-0 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-24 w-24 mb-4">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.firstName}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-amber-700 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white shadow">
                  {customer.firstName?.[0]}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-emerald-600 font-medium flex items-center gap-1.5 mt-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />{" "}
              Active
            </p>
            <p className="text-sm text-slate-500 mt-1">
              +255 756 000 000
            </p>
          </div>
        </div>

        {/* General Information */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">General information</h3>
            <button className="text-amber-600 hover:text-amber-700">
              <Edit2 size={16} />
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Mail size={15} /> Email
              </div>
              <p className="font-medium text-slate-900">{customer.email}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar size={15} /> Birthday
              </div>
              <p className="font-medium text-slate-900">August 3, 1980</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Tag size={15} /> Tags
              </div>
              <span className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                Gold Tier
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <User size={15} /> Owner
              </div>
              <p className="font-medium text-slate-900">John Doe</p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Business Information</h3>
            <button className="text-amber-600 hover:text-amber-700">
              <Edit2 size={16} />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="text-slate-500 text-xs">Name</div>
              <p className="font-medium">Ikunda Holding LTD</p>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Website</div>
              <a href="#" className="text-amber-600 hover:underline">ikunda.co.tz</a>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Delivery address</div>
              <p className="font-medium leading-snug">
                {defaultAddress?.street}<br />
                {defaultAddress?.city}, {defaultAddress?.state}<br />
                {defaultAddress?.country} • {defaultAddress?.postalCode}
              </p>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Contact</div>
              <p className="font-medium">+255 756 000 000</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100">
            <div className="text-xs text-slate-500">Total Purchases</div>
            <div className="text-4xl font-bold mt-1 text-slate-900">{orders.length}</div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100">
            <div className="text-xs text-slate-500">Total Spent</div>
            <div className="text-3xl font-bold mt-1 text-slate-900">
              {formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100">
            <div className="text-xs text-slate-500">Last Order Date</div>
            <div className="text-xl font-semibold mt-1 text-slate-900">
              {orders.length > 0
                ? formatDate(recentOrders[0]?.createdAt).split(",")[0]
                : "—"}
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Orders History</h3>
            <Link to="orders" className="text-sm text-amber-600 hover:underline">View all</Link>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2 font-medium">Order ID</th>
                <th className="py-2 font-medium">Amount (TZS)</th>
                <th className="py-2 font-medium">Order Date</th>
                <th className="py-2 font-medium">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-mono text-amber-700">ORD{String(order.id).padStart(4, "0")}</td>
                    <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Payment History</h3>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2 font-medium">Order ID</th>
                <th className="py-2 font-medium">Amount (TZS)</th>
                <th className="py-2 font-medium">Payment Date</th>
                <th className="py-2 font-medium">Payment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-mono text-amber-700">PAY{String(order.id).padStart(4, "0")}</td>
                    <td className="py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="py-3 text-slate-600">Bank / M-Pesa</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No payments yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
