"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, AlertCircle } from "lucide-react";
import { adminGetAllArticles, adminDeleteArticle } from "@/lib/api";

interface AdminArticle {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  name: string;
  publishedAt: string | null;
  updatedAt: string;
  coverImageUrl: string | null;
}

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/admin_token=([^;]+)/);
  return match ? match[1] : null;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetAllArticles(token) as { total: number; data: AdminArticle[] };
      setArticles(data.data);
      setTotal(data.total);
    } catch {
      setError("Makaleler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`"${title}" başlıklı makaleyi silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`)) return;
    const token = getToken();
    if (!token) return;
    setDeleting(id);
    try {
      await adminDeleteArticle(token, id);
      await loadArticles();
    } catch {
      setError("Silme işlemi başarısız oldu.");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const published = articles.filter((a) => a.isPublished).length;
  const draft = articles.length - published;

  return (
    <div>
      {/* Sayfa başlığı */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-navy">Makaleler</h1>
          <p className="mt-1 text-sm text-gray-400">
            {total} makale &mdash; {published} yayında, {draft} taslak
          </p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="inline-flex items-center gap-2 bg-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Yeni Makale
        </Link>
      </div>

      {/* İstatistik kartlar */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Toplam", value: total, color: "text-navy" },
          { label: "Yayında", value: published, color: "text-green-600" },
          { label: "Taslak", value: draft, color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="border border-gray-200 bg-white px-5 py-4">
            <p className={`text-2xl font-light ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Hata */}
      {error && (
        <div className="mb-4 flex items-center gap-2.5 border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Arama */}
      <div className="mb-4 relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Makale veya kategori ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-navy"
        />
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {search ? "Arama sonucu bulunamadı." : "Henüz makale eklenmemiş."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3">Başlık</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3">Güncelleme</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((article) => (
                <tr key={article.id} className="group transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {article.coverImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.coverImageUrl}
                          alt=""
                          className="h-9 w-14 shrink-0 object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-navy max-w-xs">{article.title}</p>
                        <p className="truncate text-xs text-gray-400">/{article.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{article.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      article.isPublished ? "text-green-700" : "text-amber-600"
                    }`}>
                      {article.isPublished
                        ? <><Eye size={12} /> Yayında</>
                        : <><EyeOff size={12} /> Taslak</>
                      }
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(article.updatedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 transition-colors hover:text-navy"
                        title="Görüntüle"
                      >
                        <Eye size={15} />
                      </Link>
                      <Link
                        href={`/admin/blog/${article.id}/duzenle`}
                        className="p-1.5 text-gray-400 transition-colors hover:text-navy"
                        title="Düzenle"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deleting === article.id}
                        className="p-1.5 text-gray-400 transition-colors hover:text-red-500 disabled:opacity-40"
                        title="Sil"
                      >
                        {deleting === article.id
                          ? <span className="h-3.5 w-3.5 animate-spin rounded-full border border-red-400/30 border-t-red-400 block" />
                          : <Trash2 size={15} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
