import { Outlet, Link } from "react-router-dom";
import { Suspense } from "react";
import AdminLogout from "../components/admin/AdminLogout";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/admin/blog" className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <img src="/pnglogoısık.png" alt="" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-serif text-sm font-medium text-navy">Işık Hukuk</span>
              <span className="ml-2 rounded-sm bg-navy/8 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-navy/60">
                Admin
              </span>
            </div>
          </Link>

          <nav className="hidden gap-1 md:flex">
            {[
              { to: "/admin/blog", label: "Makaleler" },
              { to: "/admin/dosyalar", label: "Dosyalar" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-navy">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden text-xs text-gray-400 hover:text-navy sm:block">
              Siteyi Görüntüle ↗
            </a>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><span className="h-6 w-6 animate-spin rounded-full border-2 border-navy/20 border-t-navy" /></div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
