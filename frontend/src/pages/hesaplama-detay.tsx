import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Phone } from "lucide-react";
import { CALCULATOR_MAP, CALCULATORS } from "@/lib/calculator-registry";
import { CALC_COMPONENT_MAP } from "@/components/calculators/calc-component-map";
import CalcIcon from "@/components/ui/CalcIcon";
import PageHead from "@/components/seo/PageHead";
import NotFound from "./not-found";

export default function HesaplamaDetayPage() {
  const { slug } = useParams<{ slug: string }>();
  const calc = CALCULATOR_MAP[slug ?? ""];

  if (!calc) return <NotFound />;

  const Component = CALC_COMPONENT_MAP[calc.slug];

  const ilgili = CALCULATORS.filter(
    (c) => c.category === calc.category && c.slug !== calc.slug
  ).slice(0, 3);

  return (
    <main>
      <PageHead
        title={`${calc.title} | Işık Hukuk Bürosu`}
        description={calc.description}
        canonical={`/hesaplamalar/${slug}`}
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.title,
            description: calc.description,
            applicationCategory: "LegalService",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-5xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <li>
                <Link to="/" className="transition-colors hover:text-white">Ana Sayfa</Link>
              </li>
              <li><ChevronRight size={12} /></li>
              <li>
                <Link to="/hesaplamalar" className="transition-colors hover:text-white">Hesaplamalar</Link>
              </li>
              <li><ChevronRight size={12} /></li>
              <li className="text-gold">{calc.shortTitle}</li>
            </ol>
          </nav>

          {/* Başlık */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-6 sm:flex-row sm:items-start"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <CalcIcon name={calc.icon} size={28} className="text-gold" />
            </div>
            <div>
              <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-gold">
                {calc.categoryLabel}
              </span>
              <h1 className="mt-3 font-serif text-4xl font-light leading-snug text-white md:text-5xl">
                {calc.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300">
                {calc.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Hesaplama ── */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

            {/* Ana hesaplama kartı */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 min-w-0 rounded-2xl bg-white p-8 shadow-sm md:p-10"
              >
                {Component && <Component />}
              </motion.div>
            </AnimatePresence>

            {/* Sağ sidebar */}
            <aside className="lg:w-72 shrink-0 space-y-4">
              {/* Danış kutusu */}
              <div className="rounded-2xl bg-navy p-7">
                <div className="mb-1 h-1 w-8 rounded-full bg-gold" />
                <p className="mt-3 font-serif text-lg font-light leading-snug text-white">
                  Kesin sonuç için avukatınıza danışın
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-400">
                  Bu araç tahmini bilgi sağlar. Hukuki süreçlerinizde uzman desteği için bizimle iletişime geçin.
                </p>
                <div className="mt-6 flex flex-col gap-2.5">
                  <a
                    href="tel:+905452162466"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <Phone size={14} />
                    Hemen Ara
                  </a>
                  <Link
                    to="/iletisim"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm text-white transition-colors hover:border-white/40"
                  >
                    Mesaj Gönder
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Tüm hesaplamalar */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  Tüm Hesaplamalar
                </p>
                <Link
                  to="/hesaplamalar"
                  className="flex items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-gold"
                >
                  <ArrowRight size={13} className="text-gold" />
                  Hesaplama Listesi
                </Link>
              </div>
            </aside>
          </div>

          {/* İlgili hesaplamalar */}
          {ilgili.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h2 className="mb-5 font-serif text-xl font-light text-navy">
                {calc.categoryLabel} Kategorisindeki Diğer Araçlar
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ilgili.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/hesaplamalar/${c.slug}`}
                    className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/5 transition-colors group-hover:bg-gold/10">
                      <CalcIcon name={c.icon} size={18} className="text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy">{c.shortTitle}</p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">{c.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
