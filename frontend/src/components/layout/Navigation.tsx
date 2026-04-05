import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/calisma-alanlari", label: "Çalışma Alanları" },
  { to: "/hesaplamalar", label: "Hesaplamalar" },
  { to: "/blog", label: "Makaleler" },
  { to: "/iletisim", label: "İletişim" },
];

export default function Navigation({ transparent }: { transparent?: boolean }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Route değişiminde menüyü kapat
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Dışarı tıklayınca menüyü kapat
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <nav aria-label="Ana navigasyon" ref={menuRef}>
      {/* Desktop — lg ve üstü */}
      <ul className="hidden items-center gap-5 xl:gap-7 lg:flex" role="list">
        {LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              aria-current={pathname === to ? "page" : undefined}
              className={clsx(
                "text-sm transition-colors duration-300 whitespace-nowrap",
                pathname === to
                  ? clsx(
                      "font-medium relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-gold",
                      transparent ? "text-white" : "text-navy"
                    )
                  : transparent
                    ? "text-white/70 hover:text-white"
                    : "text-gray-500 hover:text-navy"
              )}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/iletisim"
            className={clsx(
              "px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 border whitespace-nowrap",
              transparent
                ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                : "border-navy bg-navy text-white hover:opacity-85"
            )}
          >
            Randevu Al
          </Link>
        </li>
      </ul>

      {/* Mobile toggle — lg altı */}
      <button
        className={clsx(
          "flex items-center justify-center lg:hidden transition-colors duration-300 p-1",
          transparent ? "text-white" : "text-navy"
        )}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Menüyü aç/kapat"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu — slide down */}
      <div
        id="mobile-menu"
        className={clsx(
          "absolute left-0 right-0 top-full z-50 lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          open
            ? "max-h-[420px] opacity-100 border-t border-gray-100 shadow-lg"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white">
          <ul className="flex flex-col py-3" role="list">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === to ? "page" : undefined}
                  className={clsx(
                    "block px-6 py-3.5 text-[15px] transition-colors",
                    pathname === to
                      ? "border-l-2 border-gold bg-surface text-navy font-medium"
                      : "text-gray-600 hover:bg-surface hover:text-navy"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-6 pb-4">
            <Link
              to="/iletisim"
              onClick={() => setOpen(false)}
              className="block w-full border border-navy bg-navy py-3 text-center text-xs font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-85"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
