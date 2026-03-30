import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Users, Landmark, Scale } from "lucide-react";
import { KidemTazminati, IhbarTazminati, YillikIzin } from "@/components/calculators/IsHukukuCalc";
import { NafakaTahmini, MirasPaylasimi } from "@/components/calculators/AileHukukuCalc";
import { IcraGiderleri, GecikmeGaizi, VekaletUcreti } from "@/components/calculators/IcraFinansCalc";
import { AdliParaCezasi, KiraArtis } from "@/components/calculators/CezaHukukuCalc";
import PageHead from "@/components/seo/PageHead";

interface SubCalc {
  id: string;
  label: string;
  component: React.ComponentType;
}

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  calcs: SubCalc[];
}

const CATEGORIES: Category[] = [
  {
    id: "is",
    label: "İş Hukuku",
    icon: Briefcase,
    calcs: [
      { id: "kidem",  label: "Kıdem Tazminatı",    component: KidemTazminati },
      { id: "ihbar",  label: "İhbar Tazminatı",    component: IhbarTazminati },
      { id: "izin",   label: "Yıllık İzin Ücreti", component: YillikIzin },
    ],
  },
  {
    id: "aile",
    label: "Aile & Medeni Hukuk",
    icon: Users,
    calcs: [
      { id: "nafaka", label: "Nafaka Tahmini",      component: NafakaTahmini },
      { id: "miras",  label: "Miras Paylaşımı",     component: MirasPaylasimi },
    ],
  },
  {
    id: "icra",
    label: "İcra & Finansal Hukuk",
    icon: Landmark,
    calcs: [
      { id: "icra",    label: "İcra Takibi Maliyeti", component: IcraGiderleri },
      { id: "faiz",    label: "Gecikme Faizi",        component: GecikmeGaizi },
      { id: "vekalet", label: "Vekalet Ücreti (AAÜT)",component: VekaletUcreti },
    ],
  },
  {
    id: "diger",
    label: "Ceza & Diğer",
    icon: Scale,
    calcs: [
      { id: "para", label: "Adli Para Cezası",   component: AdliParaCezasi },
      { id: "kira", label: "Kira Artış Oranı",   component: KiraArtis },
    ],
  },
];

const DEFAULT_CALC: Record<string, string> = {
  is: "kidem", aile: "nafaka", icra: "icra", diger: "para",
};

export default function HesaplamalarPage() {
  const [activeCat, setActiveCat] = useState("is");
  const [activeCalc, setActiveCalc] = useState<Record<string, string>>(DEFAULT_CALC);

  const category = CATEGORIES.find((c) => c.id === activeCat)!;
  const calcId = activeCalc[activeCat];
  const ActiveComp = category.calcs.find((c) => c.id === calcId)?.component;

  function pickCalc(catId: string, cId: string) {
    setActiveCat(catId);
    setActiveCalc((p) => ({ ...p, [catId]: cId }));
  }

  return (
    <main>
      <PageHead
        title="Hukuki Hesaplamalar"
        description="Kıdem tazminatı, ihbar, nafaka, miras, icra maliyeti ve daha fazlası için tahmini hukuki hesaplama araçları."
        canonical="/hesaplamalar"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-navy py-24">
        <div className="absolute inset-0">
          <img src="/justice3.jpg" alt="" className="h-full w-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-linear-to-br from-navy via-navy/95 to-navy/80" />
        </div>
        {/* ızgara doku */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,150,110,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(184,150,110,.8) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <p className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Hukuki Araçlar
              <span className="h-px w-8 bg-gold" />
            </p>
            <h1 className="font-serif text-5xl font-light leading-snug text-white md:text-6xl">
              Hukuki Hesaplamalar
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300">
              Kıdem tazminatından miras paylaşımına, icra maliyetinden gecikme faizine kadar
              yaygın hukuki hesaplamaları kolayca yapın.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Tüm hesaplamalar bilgilendirme amaçlıdır; kesin hukuki sonuç doğurmaz.
            </p>
          </motion.div>

          {/* Kategori kartları */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`group relative flex flex-col items-center gap-3 px-5 py-6 text-center transition-all duration-300 ${
                    isActive
                      ? "bg-gold text-white"
                      : "border border-white/10 bg-white/5 text-gray-300 hover:border-gold/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={22} className={isActive ? "text-white" : "text-gold"} />
                  <span className="text-sm font-medium leading-snug">{cat.label}</span>
                  <span className={`text-[10px] ${isActive ? "text-white/70" : "text-gray-500"}`}>
                    {cat.calcs.length} hesaplama
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── İçerik ── */}
      <section className="bg-surface min-h-screen py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

            {/* ── Sol sidebar ── */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24">
                {/* Kategori başlığı */}
                <div className="mb-1 border-l-2 border-gold bg-white px-5 py-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Kategori</p>
                  <p className="mt-0.5 font-serif text-lg font-light text-navy">{category.label}</p>
                </div>

                {/* Hesaplama listesi */}
                <nav className="overflow-hidden border border-t-0 border-gray-200 bg-white">
                  {category.calcs.map((calc, i) => {
                    const isActive = calcId === calc.id;
                    return (
                      <button
                        key={calc.id}
                        onClick={() => pickCalc(activeCat, calc.id)}
                        className={`relative flex w-full items-center gap-4 px-5 py-4 text-left transition-all ${
                          isActive
                            ? "bg-navy text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                        } ${i > 0 ? "border-t border-gray-100" : ""}`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-semibold ${
                            isActive ? "bg-gold text-white" : "bg-surface text-gray-400"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm leading-snug">{calc.label}</span>
                        {isActive && (
                          <span className="absolute right-0 top-0 bottom-0 w-0.5 bg-gold" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Diğer kategoriler */}
                <div className="mt-4 space-y-1">
                  {CATEGORIES.filter((c) => c.id !== activeCat).map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCat(cat.id)}
                        className="flex w-full items-center gap-3 border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-500 transition-colors hover:border-gold/40 hover:text-navy"
                      >
                        <Icon size={14} className="text-gray-400 shrink-0" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Avukata danış */}
                <div className="mt-6 bg-navy p-5">
                  <p className="font-serif text-base font-light text-white">Kesin sonuç için bize danışın</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                    Bu araçlar ön fikir verir; hukuki süreçlerde uzman desteği alın.
                  </p>
                  <a
                    href="/iletisim"
                    className="mt-4 inline-flex w-full items-center justify-center bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                  >
                    Ücretsiz Görüşme
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Sağ hesaplama paneli ── */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
                <span>{category.label}</span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-navy">{category.calcs.find((c) => c.id === calcId)?.label}</span>
              </div>

              {/* Hesaplama kartı */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCat}-${calcId}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  className="bg-white p-10 shadow-sm"
                >
                  {ActiveComp && <ActiveComp />}
                </motion.div>
              </AnimatePresence>

              {/* Alt sekme şeridi — diğer hesaplamalar */}
              {category.calcs.length > 1 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {category.calcs.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => pickCalc(activeCat, calc.id)}
                      className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                        calcId === calc.id
                          ? "bg-navy text-white"
                          : "border border-gray-200 bg-white text-gray-500 hover:border-navy hover:text-navy"
                      }`}
                    >
                      {calc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
