import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.hash = "";
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <p className="mb-2"><strong>User ID:</strong> {auth.userId ?? "-"}</p>
      <p className="mb-4"><strong>Role:</strong> {auth.role ?? "guest"}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
