import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/calisma-alanlari", label: "Çalışma Alanları" },
  { to: "/blog", label: "Yazılar" },
  { to: "/iletisim", label: "İletişim" },
];

export default function Navigation() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Ana navigasyon">
      {/* Desktop */}
      <ul className="hidden items-center gap-7 md:flex" role="list">
        {LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              aria-current={pathname === to ? "page" : undefined}
              className={clsx(
                "text-sm transition-colors",
                pathname === to
                  ? "text-navy font-medium relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-gold"
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
            className="border border-navy bg-navy px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-85"
          >
            Randevu Al
          </Link>
        </li>
      </ul>

      {/* Mobile toggle */}
      <button
        className="flex items-center justify-center md:hidden text-navy"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Menüyü aç/kapat"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full z-50 border-t border-gray-100 bg-white shadow-lg md:hidden"
        >
          <ul className="flex flex-col py-2" role="list">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === to ? "page" : undefined}
                  className={clsx(
                    "block px-6 py-3 text-sm transition-colors",
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
        </div>
      )}
    </nav>
  );
}
