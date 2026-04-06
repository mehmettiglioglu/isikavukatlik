import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Navigation from "./Navigation";

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      )}
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-3" aria-label="Işık Hukuk Bürosu — Ana Sayfa">
          <div className="relative h-18 w-18 shrink-0 sm:h-20 sm:w-20 lg:h-25 lg:w-25">
            <img
              src="/pnglogoısık.png"
              alt="Işık Hukuk Bürosu Logo"
              className={clsx(
                "absolute inset-0 h-full w-full object-contain transition-all duration-300",
                transparent && "brightness-0 invert"
              )}
              loading="eager"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={clsx(
                "font-serif text-lg font-medium leading-tight tracking-wide transition-colors duration-300 sm:text-xl lg:text-2xl",
                transparent ? "text-white" : "text-navy"
              )}
            >
              Işık Hukuk Bürosu
            </span>
            <span
              className={clsx(
                "text-[9px] uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[10px] sm:tracking-[0.16em] lg:text-[11px] lg:tracking-[0.18em]",
                transparent ? "text-white/60" : "text-gray-400"
              )}
            >
              Avukatlık &amp; Danışmanlık
            </span>
          </div>
        </Link>

        <Navigation transparent={transparent} />
      </div>
    </header>
  );
}
