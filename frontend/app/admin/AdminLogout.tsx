"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogout() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "admin_token=; path=/admin; max-age=0; SameSite=Strict";
    router.push("/admin/login");
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
