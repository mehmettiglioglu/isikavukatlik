import { Link } from "react-router-dom";
import { Search, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0">
        <img src="/justice3.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-linear-to-br from-navy/95 to-navy/80" />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-white/10 bg-white/5">
          <Search size={32} className="text-gold" />
        </div>
        <p className="mb-2 font-serif text-8xl font-light text-white/20">404</p>
        <h1 className="font-serif text-3xl font-light text-white">Sayfa Bulunamadı</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          Aradığınız sayfa mevcut değil, taşınmış veya kaldırılmış olabilir.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 bg-gold px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
            <Home size={15} /> Ana Sayfaya Dön
          </Link>
          <Link to="/iletisim" className="inline-flex items-center gap-2 border border-white/20 px-7 py-3 text-sm text-white transition-colors hover:border-white/50">
            <ArrowLeft size={15} /> İletişime Geç
          </Link>
        </div>
        <div className="mt-14 border-t border-white/10 pt-10">
          <p className="mb-5 text-xs uppercase tracking-widest text-gray-500">Hızlı Bağlantılar</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { to: "/hakkimizda", label: "Hakkımızda" },
              { to: "/calisma-alanlari", label: "Çalışma Alanları" },
              { to: "/blog", label: "Hukuki Yazılar" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm text-gray-400 transition-colors hover:text-gold">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
