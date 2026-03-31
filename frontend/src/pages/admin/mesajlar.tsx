import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MailOpen, AlertCircle, X, Phone, User, Tag, Clock } from "lucide-react";
import { adminGetMessages, adminMarkMessageRead, type ContactMessage } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

export default function AdminMesajlarPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) { navigate("/admin/login"); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetMessages(token);
      setMessages(data);
    } catch {
      setError("Mesajlar yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function openMessage(msg: ContactMessage) {
    setSelected(msg);
    if (!msg.isRead) {
      const token = getAdminToken();
      if (!token) return;
      try {
        await adminMarkMessageRead(token, msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch {
        // okundu işareti başarısız olsa da modal açılsın
      }
    }
  }

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-light text-navy">Gelen Mesajlar</h1>
        <p className="mt-1 text-sm text-gray-400">
          {messages.length} mesaj &mdash;{" "}
          {unread > 0 ? (
            <span className="font-medium text-gold">{unread} okunmamış</span>
          ) : (
            "tümü okundu"
          )}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Toplam", value: messages.length, color: "text-navy" },
          { label: "Okunmamış", value: unread, color: "text-gold" },
          { label: "Okundu", value: messages.length - unread, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="border border-gray-200 bg-white px-5 py-4">
            <p className={`text-2xl font-light ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2.5 border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            Henüz mesaj bulunmuyor.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 w-8"></th>
                <th className="px-5 py-3">Gönderen</th>
                <th className="px-5 py-3">Konu</th>
                <th className="px-5 py-3">Tarih</th>
                <th className="px-5 py-3">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50/60 ${!msg.isRead ? "bg-amber-50/30" : ""}`}
                >
                  <td className="pl-5 py-3.5">
                    {msg.isRead
                      ? <MailOpen size={15} className="text-gray-300" />
                      : <Mail size={15} className="text-gold" />
                    }
                  </td>
                  <td className="px-5 py-3.5">
                    <p className={`font-medium ${msg.isRead ? "text-gray-600" : "text-navy"}`}>{msg.name}</p>
                    <p className="text-xs text-gray-400">{msg.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{msg.subject}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${msg.isRead ? "text-gray-400" : "text-gold"}`}>
                      {msg.isRead ? "Okundu" : "Yeni"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mesaj detay modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="w-full max-w-lg bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-serif text-lg font-light text-navy">{selected.subject}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 transition-colors hover:text-navy">
                <X size={18} />
              </button>
            </div>

            {/* Meta bilgiler */}
            <div className="border-b border-gray-100 px-6 py-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User size={13} className="shrink-0 text-gold" />
                <span className="font-medium text-navy">{selected.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={13} className="shrink-0 text-gold" />
                <a href={`mailto:${selected.email}`} className="hover:text-navy transition-colors">{selected.email}</a>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone size={13} className="shrink-0 text-gold" />
                  <a href={`tel:${selected.phone}`} className="hover:text-navy transition-colors">{selected.phone}</a>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Tag size={13} className="shrink-0 text-gold" />
                <span>{selected.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={13} className="shrink-0" />
                <span>
                  {new Date(selected.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Mesaj içeriği */}
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{selected.message}</p>
            </div>

            {/* Aksiyonlar */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="inline-flex items-center gap-2 bg-navy px-5 py-2 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              >
                <Mail size={12} /> Yanıtla
              </a>
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 text-xs font-medium uppercase tracking-widest text-gray-500 transition-colors hover:text-navy"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
