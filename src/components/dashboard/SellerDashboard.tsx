

export interface SellerDashboardProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

export default function SellerDashboard({ onNavigateHome, onLogin }: SellerDashboardProps) {
  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      <p className="text-gray-700">
        This is a placeholder for the seller dashboard. Here you can manage your inventory,
        update pricing, view orders, and track order status.
      </p>
      <div className="mt-4 flex gap-4">
        <button onClick={onNavigateHome} className="px-4 py-2 bg-blue-600 text-white rounded">Home</button>
        <button onClick={onLogin} className="px-4 py-2 bg-gray-200 rounded">Login</button>
      </div>
    </div>
  );
}
