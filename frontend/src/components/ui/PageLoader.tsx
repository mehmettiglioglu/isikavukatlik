import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const isFirst = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setVisible(false), 1800);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        >
          <motion.div className="absolute inset-0 bg-navy/92 backdrop-blur-md" />

          <div className="relative z-10 flex flex-col items-center gap-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-30 w-30"
            >
              <img
                src="/pnglogoısık.png"
                alt="Işık Hukuk Bürosu"
                className="absolute inset-0 h-full w-full object-contain brightness-0 invert"
                loading="eager"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <p className="font-serif text-3xl font-light tracking-wide text-white">
                Işık Hukuk Bürosu
              </p>
              <p className="mt-1.5 text-[15px] uppercase tracking-[0.25em] text-gold">
                Avukatlık &amp; Danışmanlık
              </p>
            </motion.div>

            <div className="h-px w-60 overflow-hidden bg-white/10">
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
