"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import PracticeAreaIcon from "@/components/ui/PracticeAreaIcon";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";

export default function CalismaAlanlariPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <Image src="/justice3.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" priority />
          <div className="absolute inset-0 bg-linear-to-r from-navy/95 to-navy/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Uzmanlık
            </p>
            <h1 className="font-serif text-5xl font-light text-white">Çalışma Alanları</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
              Büromuz, hukukun farklı dallarında uzmanlaşmış kadrosuyla müvekkillerimize kapsamlı
              danışmanlık ve temsil hizmeti sunmaktadır.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Liste */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.ul
            className="grid gap-4 sm:grid-cols-2"
            role="list"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {PRACTICE_AREAS.map((area, i) => (
              <motion.li key={area.slug} variants={fadeUp} custom={i}>
                <Link
                  href={`/calisma-alanlari/${area.slug}`}
                  className="group flex items-start gap-5 border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-navy/8 bg-surface transition-colors group-hover:border-gold/40 group-hover:bg-gold/5">
                    <PracticeAreaIcon name={area.icon} size={20} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-[#2d2d2d] leading-snug transition-colors group-hover:text-navy">
                      {area.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {area.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="mt-1 shrink-0 text-gold opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                  />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </main>
  );
}
