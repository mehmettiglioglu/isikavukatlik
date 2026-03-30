import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage() {
  return (
    <main className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0">
        <img src="/justice5.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-linear-to-br from-navy/95 to-navy/80" />
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-red-400/20 bg-red-400/5">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <p className="mb-2 font-serif text-8xl font-light text-white/20">500</p>
        <h1 className="font-serif text-3xl font-light text-white">Bir Hata Oluştu</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          Beklenmeyen bir hata meydana geldi. Lütfen daha sonra tekrar deneyiniz.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 bg-gold px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
            <RefreshCw size={15} /> Tekrar Dene
          </button>
          <Link to="/" className="inline-flex items-center gap-2 border border-white/20 px-7 py-3 text-sm text-white transition-colors hover:border-white/50">
            <Home size={15} /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
