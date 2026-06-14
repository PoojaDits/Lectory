

export interface AdminDashboardProps {
  onNavigateHome: () => void;
  onLogin: () => void;
}

export default function AdminDashboard({ onNavigateHome, onLogin }: AdminDashboardProps) {
  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-700">Placeholder admin panel to manage marketplace operations.</p>
      <div className="mt-4 flex gap-4">
        <button onClick={onNavigateHome} className="px-4 py-2 bg-blue-600 text-white rounded">Home</button>
        <button onClick={onLogin} className="px-4 py-2 bg-gray-200 rounded">Login</button>
      </div>
    </div>
  );
}
