import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import { getLegalTerms } from "@/lib/api";
import type { LegalTermListItem } from "@/lib/types";
import PageHead from "@/components/seo/PageHead";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://isikavukatlik.com";
const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

export default function SozlukPage() {
  const [terms, setTerms] = useState<LegalTermListItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    getLegalTerms().catch(() => [] as LegalTermListItem[]).then((data) => setTerms(Array.isArray(data) ? data : []));
  }, []);

  const filtered = search.trim()
    ? terms.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    : terms;

  // Harfe göre grupla
  const grouped = filtered.reduce<Record<string, LegalTermListItem[]>>((acc, term) => {
    const l = term.letter.toUpperCase();
    if (!acc[l]) acc[l] = [];
    acc[l].push(term);
    return acc;
  }, {});

  const presentLetters = Object.keys(grouped).sort();

  function scrollToLetter(letter: string) {
    setActiveLetter(letter);
    letterRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Hukuki Terimler Sözlüğü",
    description: "Türk hukukunda sıklıkla kullanılan hukuki terimlerin tanımları ve açıklamaları.",
    url: `${SITE_URL}/sozluk`,
    inLanguage: "tr",
    publisher: { "@type": "LegalService", name: "Işık Hukuk Bürosu", url: SITE_URL },
  };

  return (
    <main>
      <PageHead
        title="Hukuki Terimler Sözlüğü | Konya Avukat — Işık Hukuk"
        description="Türk hukukunda kullanılan 290+ hukuki terimin tanımları ve açıklamaları. Konya Işık Hukuk Bürosu hukuk sözlüğü."
        canonical="/sozluk"
        og={{ type: "website" }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <img src="/justice.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" loading="eager" />
          <div className="absolute inset-0 bg-linear-to-r from-navy/95 to-navy/70" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            Referans
          </p>
          <h1 className="font-serif text-5xl font-light text-white">Hukuki Terimler Sözlüğü</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
            Türk hukukunda sıklıkla karşılaşılan terimlerin sade, anlaşılır ve kapsamlı açıklamaları.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6">

          {/* Arama */}
          <div className="mb-8 relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Terim veya kategori ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-navy"
              aria-label="Hukuki terim ara"
            />
          </div>

          {/* Alfabe navigasyonu */}
          {!search && (
            <nav aria-label="Alfabetik navigasyon" className="mb-10 flex flex-wrap gap-1.5">
              {ALPHABET.map((l) => {
                const active = presentLetters.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => active && scrollToLetter(l)}
                    disabled={!active}
                    aria-label={`${l} harfine git`}
                    className={`flex h-8 w-8 items-center justify-center text-xs font-medium transition-colors ${
                      active
                        ? activeLetter === l
                          ? "bg-navy text-white"
                          : "border border-gray-200 bg-white text-navy hover:border-navy hover:bg-navy hover:text-white"
                        : "text-gray-200 cursor-default"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Terim grupları */}
          {presentLetters.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">
              {search ? "Arama sonucu bulunamadı." : "Henüz terim eklenmemiş."}
            </p>
          ) : (
            <div className="space-y-12">
              {presentLetters.map((letter) => (
                <div
                  key={letter}
                  ref={(el) => { letterRefs.current[letter] = el; }}
                  className="scroll-mt-24"
                >
                  {/* Harf başlığı */}
                  <div className="mb-5 flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-navy font-serif text-lg font-light text-white">
                      {letter}
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>

                  {/* Terimler */}
                  <ul className="grid gap-3 sm:grid-cols-2" role="list">
                    {grouped[letter].map((term) => (
                      <li key={term.id}>
                        <Link
                          to={`/sozluk/${term.slug}`}
                          className="group flex items-start justify-between gap-3 border border-gray-100 bg-white px-5 py-4 transition-all hover:border-gold/40 hover:shadow-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-navy group-hover:text-gold transition-colors">
                              {term.title}
                            </p>
                            <p className="mt-0.5 text-xs text-gold/80">{term.category}</p>
                            {term.shortDescription && (
                              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
                                {term.shortDescription}
                              </p>
                            )}
                          </div>
                          <ChevronRight size={14} className="mt-1 shrink-0 text-gray-300 group-hover:text-gold transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 border border-gray-100 bg-white px-8 py-8 text-center">
            <BookOpen size={28} className="mx-auto mb-3 text-gold" />
            <h2 className="font-serif text-xl font-light text-navy">Hukuki Danışmanlık Alın</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Karmaşık hukuki terimler ve haklarınız hakkında uzman avukatlarımızdan ücretsiz ön görüşme talep edebilirsiniz.
            </p>
            <Link
              to="/iletisim"
              className="mt-5 inline-flex items-center gap-2 bg-navy px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
