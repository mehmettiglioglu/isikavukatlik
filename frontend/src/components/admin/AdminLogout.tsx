import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { clearAdminToken } from "../../lib/auth";

export default function AdminLogout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-sm border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut size={12} />
      Çıkış
    </button>
  );
}
