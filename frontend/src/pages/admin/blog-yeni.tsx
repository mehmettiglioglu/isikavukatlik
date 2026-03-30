import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, EyeOff, ImageIcon, AlertCircle, CheckCircle } from "lucide-react";
import { getCategories, adminCreateArticle } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import type { Category } from "@/lib/types";

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const FIELD = "w-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy/20";

export default function YeniMakalePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "", slug: "", summary: "", content: "",
    coverImageUrl: "", metaTitle: "", metaDescription: "",
    isPublished: false, categoryId: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { navigate("/admin/login"); return; }
    getCategories().then(setCategories).catch(() => {});
  }, [navigate]);

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((p) => ({ ...p, title, slug: slugify(title), metaTitle: p.metaTitle || title }));
  }

  async function handleSubmit(publish: boolean) {
    if (!form.title) { setError("Başlık zorunludur."); return; }
    if (!form.content) { setError("İçerik zorunludur."); return; }
    if (!form.categoryId) { setError("Kategori seçimi zorunludur."); return; }

    const token = getAdminToken();
    if (!token) { navigate("/admin/login"); return; }

    setSaving(true);
    setError(null);
    try {
      await adminCreateArticle(token, {
        ...form,
        isPublished: publish,
        coverImageUrl: form.coverImageUrl || null,
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        summary: form.summary || null,
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin/blog"), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kaydetme başarısız oldu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-navy">
            <ArrowLeft size={16} /> Geri
          </button>
          <span className="text-gray-200">/</span>
          <h1 className="font-serif text-xl font-light text-navy">Yeni Makale</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleSubmit(false)} disabled={saving} className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-navy hover:text-navy disabled:opacity-50">
            <EyeOff size={14} /> Taslak Kaydet
          </button>
          <button type="button" onClick={() => handleSubmit(true)} disabled={saving} className="inline-flex items-center gap-2 bg-navy px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60">
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={14} />}
            Yayınla
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2.5 border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={15} className="shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 flex items-center gap-2.5 border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle size={15} className="shrink-0" /> Makale başarıyla kaydedildi. Yönlendiriliyorsunuz...
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="border border-gray-200 bg-white p-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Başlık <span className="text-red-400">*</span></label>
              <input type="text" required value={form.title} onChange={handleTitle} className={FIELD} placeholder="Makale başlığı" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Slug (URL)</label>
              <div className="flex items-center border border-gray-200 bg-gray-50 focus-within:border-navy focus-within:ring-1 focus-within:ring-navy/20">
                <span className="border-r border-gray-200 px-3 py-2.5 text-xs text-gray-400">/blog/</span>
                <input type="text" required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" placeholder="makale-slug" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Özet</label>
              <textarea rows={2} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} className={FIELD} placeholder="Kısa özet (liste görünümünde gösterilir)" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">İçerik (HTML) <span className="text-red-400">*</span></label>
              <textarea rows={16} required value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className={`${FIELD} font-mono text-xs leading-relaxed`} placeholder="<h2>Başlık</h2><p>İçerik buraya...</p>" />
            </div>
          </div>
          <div className="border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">SEO Ayarları</h2>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Meta Başlık</label>
              <input type="text" value={form.metaTitle} onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))} className={FIELD} placeholder="SEO başlığı" />
              <p className="mt-1 text-right text-xs text-gray-400">{form.metaTitle.length}/60</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Meta Açıklama</label>
              <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))} className={FIELD} placeholder="Arama sonuçlarında görünen açıklama" />
              <p className="mt-1 text-right text-xs text-gray-400">{form.metaDescription.length}/160</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">Yayın</h2>
            <div className="space-y-3">
              <div onClick={() => setForm((p) => ({ ...p, isPublished: false }))} className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${!form.isPublished ? "border-amber-300 bg-amber-50" : "border-gray-100 hover:border-gray-200"}`}>
                <div className={`h-3.5 w-3.5 rounded-full border-2 ${!form.isPublished ? "border-amber-500 bg-amber-500" : "border-gray-300"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Taslak</p>
                  <p className="text-xs text-gray-400">Sadece adminler görebilir</p>
                </div>
              </div>
              <div onClick={() => setForm((p) => ({ ...p, isPublished: true }))} className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${form.isPublished ? "border-green-300 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}>
                <div className={`h-3.5 w-3.5 rounded-full border-2 ${form.isPublished ? "border-green-500 bg-green-500" : "border-gray-300"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Yayında</p>
                  <p className="text-xs text-gray-400">Herkese açık</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Kategori <span className="text-red-400">*</span></h2>
            <select required value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: Number(e.target.value) }))} className={FIELD}>
              <option value={0} disabled>Kategori seçin...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Kapak Fotoğrafı</h2>
            <input type="url" placeholder="https://..." value={form.coverImageUrl} onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))} className={FIELD} />
            {form.coverImageUrl && (
              <div className="mt-3">
                <button type="button" onClick={() => setPreviewImage(!previewImage)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy">
                  <ImageIcon size={12} /> {previewImage ? "Önizlemeyi gizle" : "Önizle"}
                </button>
                {previewImage && (
                  <div className="relative mt-2 aspect-video overflow-hidden border border-gray-100">
                    <img src={form.coverImageUrl} alt="Kapak önizleme" className="absolute inset-0 h-full w-full object-cover" onError={() => setPreviewImage(false)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
