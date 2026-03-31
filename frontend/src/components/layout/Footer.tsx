import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PRACTICE_AREAS } from "@/lib/practice-areas";

export default function Footer() {
  const year = new Date().getFullYear();

  // 14 alanı ikiye böl
  const half = Math.ceil(PRACTICE_AREAS.length / 2);
  const col1 = PRACTICE_AREAS.slice(0, half);
  const col2 = PRACTICE_AREAS.slice(half);

  return (
    <footer className="border-t border-gray-100 bg-navy text-gray-300" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_260px]">

          {/* Logo + açıklama + sayfalar */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 shrink-0">
                <img src="/pnglogoısık.png" alt="Işık Hukuk Bürosu" className="absolute inset-0 h-full w-full object-contain brightness-0 invert" />
              </div>
              <div>
                <p className="font-serif text-base font-light text-white">Işık Hukuk Bürosu</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Konya</p>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Konya merkezli büromuz, hukukun pek çok alanında bireylere ve kurumlara profesyonel avukatlık hizmeti sunmaktadır.
            </p>

            <nav aria-label="Alt navigasyon">
              <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">Sayfalar</p>
              <ul className="space-y-2 text-sm" role="list">
                {[
                  { to: "/hakkimizda", label: "Hakkımızda" },
                  { to: "/blog", label: "Hukuki Yazılar" },
                  { to: "/sozluk", label: "Hukuki Sözlük" },
                  { to: "/iletisim", label: "İletişim" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="transition-colors hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Çalışma Alanları – 1. kolon */}
          <nav aria-label="Çalışma alanları 1">
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">Çalışma Alanları</p>
            <ul className="space-y-2 text-sm" role="list">
              {col1.map((area) => (
                <li key={area.slug}>
                  <Link to={`/calisma-alanlari/${area.slug}`} className="transition-colors hover:text-white">
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Çalışma Alanları – 2. kolon */}
          <nav aria-label="Çalışma alanları 2">
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-500 invisible">–</p>
            <ul className="space-y-2 text-sm" role="list">
              {col2.map((area) => (
                <li key={area.slug}>
                  <Link to={`/calisma-alanlari/${area.slug}`} className="transition-colors hover:text-white">
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* İletişim */}
          <address className="not-italic text-sm space-y-3">
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-500 not-italic">İletişim</p>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
              <span className="text-gray-400 leading-relaxed">Konya, Türkiye</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="shrink-0 text-gold" />
              <a href="tel:+905001234567" className="text-gray-400 transition-colors hover:text-white">+90 500 123 45 67</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="shrink-0 text-gold" />
              <a href="mailto:info@isikavukatlik.com" className="text-gray-400 transition-colors hover:text-white">info@isikavukatlik.com</a>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock size={14} className="mt-0.5 shrink-0 text-gold" />
              <span className="text-gray-400">Pzt – Cum: 09:00 – 18:00</span>
            </div>
          </address>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {year} Işık Hukuk Bürosu. Tüm hakları saklıdır.</p>
          <p>Konya Barosu'na kayıtlıdır.</p>
        </div>
      </div>
    </footer>
  );
}
