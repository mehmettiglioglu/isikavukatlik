"use client";

import { RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen items-center justify-center bg-[#0f1e3c]">
        <div className="max-w-md px-6 py-16 text-center">
          <p className="mb-2 font-serif text-7xl font-light text-white/15">500</p>
          <h1 className="font-serif text-2xl font-light text-white">Kritik Hata</h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Uygulama beklenmedik bir hatayla karşılaştı. Sayfayı yenilemeyi deneyiniz.
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-gray-600">#{error.digest}</p>
          )}
          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-[#b8966e] hover:text-[#b8966e]"
          >
            <RefreshCw size={14} />
            Yenile
          </button>
        </div>
      </body>
    </html>
  );
}
