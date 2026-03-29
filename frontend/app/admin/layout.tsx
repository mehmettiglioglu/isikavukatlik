import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import AdminLogout from "./AdminLogout";

export const metadata: Metadata = {
  title: { default: "Admin Panel | Işık Hukuk", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Token yoksa nav olmadan sadece içeriği render et (login sayfası için)
  if (!token) {
    return <div className="min-h-screen bg-[#f8f7f4]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/admin/blog" className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image src="/pnglogoısık.png" alt="" fill className="object-contain" sizes="32px" />
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
              { href: "/admin/blog", label: "Makaleler" },
              { href: "/admin/dosyalar", label: "Dosyalar" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-navy">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden text-xs text-gray-400 hover:text-navy sm:block">
              Siteyi Görüntüle ↗
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
