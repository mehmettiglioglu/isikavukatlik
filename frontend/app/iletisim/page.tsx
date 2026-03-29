"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";

export default function IletisimPage() {
  const contactItems = [
    { icon: MapPin, label: "Adres", value: "Konya, Türkiye", detail: "Detaylı adres için arayınız" },
    { icon: Phone, label: "Telefon", value: "+90 500 123 45 67", href: "tel:+905001234567" },
    { icon: Mail, label: "E-posta", value: "info@isikavukatlik.com", href: "mailto:info@isikavukatlik.com" },
    { icon: Clock, label: "Çalışma Saatleri", value: "Pazartesi – Cuma", detail: "09:00 – 18:00" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <Image src="/justice2.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" priority />
          <div className="absolute inset-0 bg-linear-to-r from-navy/95 to-navy/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Ulaşın
            </p>
            <h1 className="font-serif text-5xl font-light text-white">İletişim</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
              Hukuki danışmanlık ve randevu talepleriniz için bizimle iletişime geçebilirsiniz.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.h2 variants={fadeUp} className="mb-8 font-serif text-2xl font-light text-navy">
                Bize Ulaşın
              </motion.h2>
              <div className="space-y-4">
                {contactItems.map(({ icon: Icon, label, value, detail, href }) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className="flex items-start gap-4 border border-gray-100 p-5 transition-colors hover:border-gold/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400">{label}</p>
                      {href ? (
                        <a href={href} className="mt-1 block font-medium text-navy transition-colors hover:text-gold">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 font-medium text-navy">{value}</p>
                      )}
                      {detail && <p className="text-sm text-gray-500">{detail}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="relative overflow-hidden border border-gray-100 bg-surface p-8">
                {/* Köşe dekor */}
                <div aria-hidden="true" className="absolute top-0 right-0 h-16 w-16 border-t-2 border-r-2 border-gold/30" />
                <h2 className="font-serif text-2xl font-light text-navy">Randevu Talebi</h2>
                <div className="mt-2 h-px w-12 bg-gold" aria-hidden="true" />
                <p className="mt-5 text-sm text-gray-600 leading-relaxed">
                  Ön görüşme ve danışmanlık randevusu için telefon veya e-posta yoluyla
                  büromuzla iletişime geçebilirsiniz. Taleplerinizi mümkün olan en kısa sürede
                  yanıtlamaya özen göstermekteyiz.
                </p>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  İlk görüşmelerde davanız ya da hukuki durumunuz hakkında ön değerlendirme
                  yapılmakta; süreç ve olası sonuçlar hakkında bilgi verilmektedir.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="tel:+905001234567"
                    className="inline-flex items-center justify-center gap-2 bg-navy px-6 py-3 text-sm text-white transition-opacity hover:opacity-90"
                  >
                    <Phone size={14} />
                    Hemen Ara
                  </a>
                  <a
                    href="mailto:info@isikavukatlik.com?subject=Randevu%20Talebi"
                    className="group inline-flex items-center justify-center gap-2 border border-navy px-6 py-3 text-sm text-navy transition-all hover:bg-navy hover:text-white"
                  >
                    E-posta Gönder
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
