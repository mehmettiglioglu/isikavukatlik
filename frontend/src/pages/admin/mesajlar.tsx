import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MailOpen, AlertCircle, X, Phone, User, Tag, Clock, Trash2, CheckSquare, Square } from "lucide-react";
import { adminGetMessages, adminMarkMessageRead, adminDeleteMessage, adminDeleteMessagesBulk, type ContactMessage } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import { useAdminModal } from "@/components/ui/AdminModal";

export default function AdminMesajlarPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const { confirm } = useAdminModal();

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

  function toggleSelect(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
    }
  }

  async function handleDeleteSingle(id: number) {
    const token = getAdminToken();
    if (!token) return;
    const ok = await confirm({
      title: "Mesajı Sil",
      message: "Bu mesajı silmek istediğinize emin misiniz?",
      confirmText: "Sil",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await adminDeleteMessage(token, id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelected(null);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } catch {
      setError("Mesaj silinirken hata oluştu.");
    }
  }

  async function handleDeleteBulk() {
    const token = getAdminToken();
    if (!token) return;
    if (selectedIds.size === 0) return;
    const ok = await confirm({
      title: "Toplu Silme",
      message: `${selectedIds.size} mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      confirmText: `${selectedIds.size} Mesajı Sil`,
      variant: "danger",
    });
    if (!ok) return;

    setDeleting(true);
    try {
      await adminDeleteMessagesBulk(token, Array.from(selectedIds));
      setMessages((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      setSelectedIds(new Set());
    } catch {
      setError("Mesajlar silinirken hata oluştu.");
    } finally {
      setDeleting(false);
    }
  }

  const unread = messages.filter((m) => !m.isRead).length;
  const allSelected = messages.length > 0 && selectedIds.size === messages.length;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
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
        {selectedIds.size > 0 && (
          <button
            onClick={handleDeleteBulk}
            disabled={deleting}
            className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {deleting ? "Siliniyor..." : `${selectedIds.size} Mesajı Sil`}
          </button>
        )}
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
                <th className="px-3 py-3 w-10">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-navy transition-colors">
                    {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </th>
                <th className="px-3 py-3 w-8"></th>
                <th className="px-5 py-3">Gönderen</th>
                <th className="px-5 py-3">Konu</th>
                <th className="px-5 py-3">Tarih</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-3 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50/60 ${!msg.isRead ? "bg-amber-50/30" : ""} ${selectedIds.has(msg.id) ? "bg-blue-50/40" : ""}`}
                >
                  <td className="px-3 py-3.5" onClick={(e) => toggleSelect(msg.id, e)}>
                    {selectedIds.has(msg.id)
                      ? <CheckSquare size={16} className="text-navy" />
                      : <Square size={16} className="text-gray-300 hover:text-gray-500" />
                    }
                  </td>
                  <td className="px-3 py-3.5">
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
                  <td className="px-3 py-3.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSingle(msg.id); }}
                      className="text-gray-300 transition-colors hover:text-red-500"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
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
            <div className="flex justify-between border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => handleDeleteSingle(selected.id)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-widest text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 size={12} /> Sil
              </button>
              <div className="flex gap-3">
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
        </div>
      )}
    </div>
  );
}
