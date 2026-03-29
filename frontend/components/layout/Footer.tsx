import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-navy text-gray-300" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + açıklama */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/pnglogoısık.png"
                  alt="Işık Hukuk Bürosu"
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="font-serif text-base font-light text-white">Işık Hukuk Bürosu</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Konya</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              Konya merkezli büromuz, iş, kira, icra, aile ve ticaret hukuku başta olmak üzere
              hukukun pek çok alanında bireylere ve kurumlara profesyonel avukatlık hizmeti
              sunmaktadır.
            </p>
          </div>

          {/* Sayfalar */}
          <nav aria-label="Alt navigasyon">
            <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">Sayfalar</p>
            <ul className="space-y-2.5 text-sm" role="list">
              {[
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/calisma-alanlari", label: "Çalışma Alanları" },
                { href: "/blog", label: "Hukuki Yazılar" },
                { href: "/iletisim", label: "İletişim" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* İletişim */}
          <address className="not-italic text-sm space-y-3">
            <p className="mb-4 text-xs uppercase tracking-widest text-gray-500 not-italic">İletişim</p>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
              <span className="text-gray-400 leading-relaxed">Konya, Türkiye</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="shrink-0 text-gold" />
              <a href="tel:+905001234567" className="text-gray-400 transition-colors hover:text-white">
                +90 500 123 45 67
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="shrink-0 text-gold" />
              <a href="mailto:info@isikavukatlik.com" className="text-gray-400 transition-colors hover:text-white">
                info@isikavukatlik.com
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock size={14} className="mt-0.5 shrink-0 text-gold" />
              <span className="text-gray-400">Pzt – Cum: 09:00 – 18:00</span>
            </div>
          </address>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {year} Işık Hukuk Bürosu. Tüm hakları saklıdır.</p>
          <p>Konya Barosu'na kayıtlıdır.</p>
        </div>
      </div>
    </footer>
  );
}
