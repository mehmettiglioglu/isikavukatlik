import { Outlet, Link, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Mail, X, ArrowRight } from "lucide-react";
import AdminLogout from "../components/admin/AdminLogout";
import { adminGetMessages, adminMarkMessageRead, type ContactMessage } from "../lib/api";
import { getAdminToken } from "../lib/auth";
import { AdminModalProvider } from "../components/ui/AdminModal";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    adminGetMessages(token)
      .then((msgs) => {
        const unread = msgs.filter((m) => !m.isRead);
        if (unread.length > 0) {
          setUnreadMessages(unread);
          setShowPopup(true);
        }
      })
      .catch(() => {/* sessizce geç */});
  }, []);

  async function goToMessages() {
    setShowPopup(false);
    navigate("/admin/mesajlar");
  }

  async function dismissPopup() {
    // Tüm okunmamışları okundu olarak işaretle
    const token = getAdminToken();
    if (token) {
      await Promise.allSettled(
        unreadMessages.map((m) => adminMarkMessageRead(token, m.id))
      );
    }
    setShowPopup(false);
  }

  return (
    <AdminModalProvider>
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
              { to: "/admin/mesajlar", label: "Mesajlar" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="relative px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-navy"
              >
                {label}
                {label === "Mesajlar" && unreadMessages.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                    {unreadMessages.length > 9 ? "9+" : unreadMessages.length}
                  </span>
                )}
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

      {/* Okunmamış mesaj popup */}
      {showPopup && unreadMessages.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white shadow-2xl border border-gray-100">
          <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center bg-gold/10">
                <Mail size={15} className="text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">Yeni Mesajlar</p>
                <p className="text-xs text-gray-400">{unreadMessages.length} okunmamış mesaj</p>
              </div>
            </div>
            <button onClick={dismissPopup} className="text-gray-300 transition-colors hover:text-gray-500">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
            {unreadMessages.slice(0, 4).map((msg) => (
              <div key={msg.id} className="px-5 py-3">
                <p className="text-sm font-medium text-navy truncate">{msg.name}</p>
                <p className="text-xs text-gray-400 truncate">{msg.subject}</p>
                <p className="mt-0.5 text-xs text-gray-300 truncate">{msg.message}</p>
              </div>
            ))}
            {unreadMessages.length > 4 && (
              <div className="px-5 py-2 text-xs text-gray-400 text-center">
                +{unreadMessages.length - 4} mesaj daha
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-5 py-3">
            <button
              onClick={goToMessages}
              className="flex w-full items-center justify-center gap-2 bg-navy py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Tüm Mesajları Gör <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
    </AdminModalProvider>
  );
}
