import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm" role="banner">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Işık Hukuk Bürosu — Ana Sayfa">
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/pnglogoısık.png"
              alt="Işık Hukuk Bürosu Logo"
              fill
              className="object-contain"
              sizes="44px"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base font-medium leading-tight tracking-wide text-navy">
              Işık Hukuk Bürosu
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
              Avukatlık &amp; Danışmanlık
            </span>
          </div>
        </Link>

        <Navigation />
      </div>
    </header>
  );
}
