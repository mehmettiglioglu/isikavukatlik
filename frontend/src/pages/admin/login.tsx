import { useState, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { login } from "@/lib/api";
import { setAdminToken } from "@/lib/auth";

function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") ?? "/admin/blog";

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Kullanıcı adı ve şifre zorunludur.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await login(form.username, form.password);
      setAdminToken(data.token);
      navigate(from);
    } catch {
      setError("Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-colors focus:border-navy focus:ring-1 focus:ring-navy";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f7f4]">
      <div className="absolute inset-0 z-0 opacity-30">
        <img src="/justice.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#f8f7f4]/90" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 h-16 w-16">
            <img src="/pnglogoısık.png" alt="Işık Hukuk Bürosu" className="h-full w-full object-contain" loading="eager" />
          </div>
          <h1 className="font-serif text-2xl font-light text-navy">Işık Hukuk Bürosu</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">Yönetim Paneli</p>
        </div>

        <div className="border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-8 py-5">
            <h2 className="font-medium text-[#2d2d2d]">Giriş Yap</h2>
            <p className="mt-0.5 text-xs text-gray-400">Admin paneline erişmek için kimliğinizi doğrulayın.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 py-7 space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Kullanıcı Adı</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="username" type="text" autoComplete="username" required value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className={inputBase} placeholder="Kullanıcı adınız" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Şifre</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className={`${inputBase} pr-10`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="relative w-full overflow-hidden bg-navy py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Işık Hukuk Bürosu. Yetkisiz erişim yasaktır.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
