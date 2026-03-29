"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0">
        <Image src="/justice5.jpg" alt="" fill className="object-cover opacity-10" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-br from-navy/95 to-navy/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-red-400/20 bg-red-400/5">
          <AlertTriangle size={32} className="text-red-400" />
        </div>

        <p className="mb-2 font-serif text-8xl font-light text-white/20">500</p>

        <h1 className="font-serif text-3xl font-light text-white">Bir Hata Oluştu</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-400">
          Sunucu tarafında beklenmeyen bir hata meydana geldi. Lütfen daha sonra tekrar deneyiniz.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-gray-600">Hata kodu: {error.digest}</p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gold px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={15} />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-white/20 px-7 py-3 text-sm text-white transition-colors hover:border-white/50"
          >
            <Home size={15} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
