import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0a1628]"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/justice.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-l from-[#0a1628]/95 via-[#0a1628]/70 to-[#0a1628]/30" />
      </div>

      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-1 bg-linear-to-b from-transparent via-gold to-transparent opacity-60"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <div className="ml-auto max-w-2xl flex flex-col items-end text-right">

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold"
          >
            Konya — Hukuki Danışmanlık &amp; Avukatlık
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            className="font-serif text-5xl font-light leading-[1.15] text-white md:text-6xl"
          >
            Hukukta
            <br />
            <span className="text-gold">Güvenilir</span>
            <br />
            Bir Ortak
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-gray-300"
          >
            Konya merkezli büromuz; iş, kira, icra, tazminat, aile ve ticaret hukuku başta olmak
            üzere hukukun pek çok alanında bireyler ve kurumlara profesyonel avukatlık hizmeti
            sunmaktadır.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-end gap-4"
          >
            <Link
              to="/iletisim"
              className="group inline-flex items-center gap-2 border border-white/25 px-7 py-3 text-sm text-white transition-all hover:border-white/60"
            >
              <Phone size={14} />
              İletişime Geçin
            </Link>
            <Link
              to="/calisma-alanlari"
              className="group inline-flex items-center gap-2 border border-gold bg-gold px-7 py-3 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-gold"
            >
              Çalışma Alanları
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-20 flex flex-wrap justify-end gap-10 border-t border-white/10 pt-10"
        >
          {[
            { value: "2014", label: "Kuruluş Yılı" },
            { value: "10+", label: "Yıllık Deneyim" },
            { value: "14", label: "Çalışma Alanı" },
          ].map((stat) => (
            <div key={stat.label} className="text-right">
              <p className="font-serif text-3xl font-light text-gold">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
