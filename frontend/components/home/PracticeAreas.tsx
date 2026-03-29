"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PracticeArea } from "@/lib/types";
import PracticeAreaIcon from "@/components/ui/PracticeAreaIcon";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";

interface Props {
  areas: PracticeArea[];
}

export default function PracticeAreas({ areas }: Props) {
  return (
    <section aria-labelledby="practice-areas-heading" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">

        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-14 flex flex-col items-center text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            Uzmanlık Alanlarımız
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
          </p>
          <h2 id="practice-areas-heading" className="font-serif text-4xl font-light text-[#2d2d2d]">
            Çalışma Alanları
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500">
            Hukukun farklı dallarında uzmanlaşmış kadromuzla kapsamlı danışmanlık ve temsil
            hizmeti sunuyoruz.
          </p>
        </motion.header>

        <motion.ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          {areas.map((area, i) => (
            <motion.li key={area.slug} variants={fadeUp} custom={i} className="flex">
              <Link
                href={`/calisma-alanlari/${area.slug}`}
                className="group flex w-full flex-col rounded-sm border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-lg"
              >
                {/* İkon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm border border-navy/8 bg-surface transition-colors group-hover:border-gold/40 group-hover:bg-gold/5">
                  <PracticeAreaIcon name={area.icon} size={22} className="text-gold" />
                </div>

                {/* Başlık */}
                <h3 className="mb-2.5 text-base font-semibold leading-snug text-[#1a1a2e] transition-colors group-hover:text-navy">
                  {area.title}
                </h3>

                {/* Açıklama */}
                <p className="flex-1 text-sm leading-relaxed text-gray-500">
                  {area.description}
                </p>

                {/* Alt ok */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-gold opacity-0 transition-all duration-200 group-hover:opacity-100">
                  Detaylar
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/calisma-alanlari"
            className="inline-flex items-center gap-2 border border-navy px-8 py-3 text-sm text-navy transition-all hover:bg-navy hover:text-white"
          >
            Tüm Alanları Görün
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
