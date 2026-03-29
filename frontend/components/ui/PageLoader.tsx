"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);   // ilk yüklemede açık
  const isFirst = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // İlk açılış
  useEffect(() => {
    timer.current = setTimeout(() => setVisible(false), 1800);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  // Sonraki route değişimlerinde
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 900);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={pathname}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center"
        >
          <motion.div className="absolute inset-0 bg-navy/92 backdrop-blur-md" />

          <div className="relative z-10 flex flex-col items-center gap-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-20 w-20"
            >
              <Image
                src="/pnglogoısık.png"
                alt="Işık Hukuk Bürosu"
                fill
                className="object-contain brightness-0 invert"
                priority
                sizes="80px"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <p className="font-serif text-xl font-light tracking-wide text-white">
                Işık Hukuk Bürosu
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gold">
                Avukatlık &amp; Danışmanlık
              </p>
            </motion.div>

            {/* Progress çubuğu */}
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gold"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
