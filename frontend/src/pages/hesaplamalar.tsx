import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CALCULATORS, CATEGORIES } from "@/lib/calculator-registry";
import CalcIcon from "@/components/ui/CalcIcon";
import PageHead from "@/components/seo/PageHead";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";

export default function HesaplamalarPage() {
  const [activecat, setActivecat] = useState<string>("hepsi");

  const filtered =
    activecat === "hepsi"
      ? CALCULATORS
      : CALCULATORS.filter((c) => c.category === activecat);

  return (
    <main>
      <PageHead
        title="Hukuki Hesaplamalar — Ücretsiz Online Araçlar"
        description="Kıdem tazminatı, ihbar, nafaka, miras, icra masrafı, gecikme faizi ve daha fazlası için ücretsiz tahmini hukuki hesaplama araçları."
        canonical="/hesaplamalar"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-navy py-24">
        <div className="absolute inset-0">
          <img
            src="/justice3.jpg"
            alt=""
            className="h-full w-full object-cover opacity-10"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-br from-navy via-navy/97 to-navy/80" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,150,110,1) 1px,transparent 1px),linear-gradient(90deg,rgba(184,150,110,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Ücretsiz Araçlar
              <span className="h-px w-8 bg-gold" />
            </p>
            <h1 className="font-serif text-5xl font-light text-white md:text-6xl">
              Hukuki Hesaplamalar
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300">
              Kıdem tazminatından e-tebligat tarihine, icra masrafından miras
              paylaşımına kadar {CALCULATORS.length} farklı hukuki hesaplama aracı.
            </p>
            <p className="mt-3 text-xs text-white/30 uppercase tracking-widest">
              Tüm hesaplamalar tahmini bilgi amaçlıdır
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── İçerik ── */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">

          {/* Kategori filtre */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActivecat(cat.id)}
                className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                  activecat === cat.id
                    ? "bg-navy text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-navy/30 hover:text-navy"
                }`}
              >
                {cat.label}
                {cat.id !== "hepsi" && (
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] ${
                      activecat === cat.id ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    {CALCULATORS.filter((c) => c.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Kart ızgarası */}
          <motion.ul
            key={activecat}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filtered.map((calc) => (
              <motion.li key={calc.slug} variants={fadeUp} className="flex">
                <Link
                  to={`/hesaplamalar/${calc.slug}`}
                  className="group flex w-full flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
                >
                  {/* İkon + Kategori */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 transition-colors group-hover:bg-gold/10">
                      <CalcIcon
                        name={calc.icon}
                        size={22}
                        className="text-gold"
                      />
                    </div>
                    <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-gold">
                      {calc.categoryLabel}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h2 className="font-serif text-lg font-medium leading-snug text-navy transition-colors group-hover:text-navy">
                    {calc.shortTitle}
                  </h2>

                  {/* Açıklama */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {calc.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold opacity-0 transition-all duration-200 group-hover:opacity-100">
                    Hesapla
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* Alt CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 rounded-2xl bg-navy px-10 py-10 text-center"
          >
            <p className="font-serif text-2xl font-light text-white">
              Hesaplamanızı bir avukatla değerlendirin
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
              Bu araçlar ön fikir verir; kesin sonuç için hukuki danışmanlık almanızı öneririz.
            </p>
            <Link
              to="/iletisim"
              className="mt-7 inline-flex items-center gap-2 bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
            >
              Ücretsiz Görüşme Talep Et
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
