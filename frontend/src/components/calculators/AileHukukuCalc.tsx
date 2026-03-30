import { useState } from "react";
import { motion } from "framer-motion";
import CalcShell, { CalcInput, CalcSelect, CalcButton, ResultRow, fmt } from "./CalcShell";

// ---------- Nafaka Tahmin Aracı ----------
export function NafakaTahmini() {
  const [netGelir, setNetGelir] = useState("");
  const [nafakaTuru, setNafakaTuru] = useState("yoksulluk");
  const [cocukSayisi, setCocukSayisi] = useState("1");
  const [result, setResult] = useState<null | { min: number; max: number; aciklama: string }>(null);

  function hesapla() {
    const gelir = parseFloat(netGelir.replace(/\./g, "").replace(",", ".")) || 0;
    if (!gelir) return;
    let min = 0, max = 0, aciklama = "";

    if (nafakaTuru === "yoksulluk") {
      min = gelir * 0.20;
      max = gelir * 0.35;
      aciklama = "Yoksulluk nafakası (eş için); mahkeme net gelirin %20–35'i arasında takdir yetkisi kullanır.";
    } else {
      const sayi = parseInt(cocukSayisi) || 1;
      min = gelir * 0.20 * sayi;
      max = gelir * 0.30 * sayi;
      aciklama = `${sayi} çocuk için iştirak nafakası; her çocuk için net gelirin %20–30'u arası yaygın takdir aralığıdır.`;
    }

    setResult({ min, max, aciklama });
  }

  return (
    <CalcShell
      title="Nafaka Tahmin Aracı"
      description="Mahkemenin takdir yetkisine göre yoksulluk ve iştirak nafakası için tahmini aralık sunar. Kesin sonuç değildir."
      result={
        result && (
          <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Nafaka Türü" value={nafakaTuru === "yoksulluk" ? "Yoksulluk Nafakası" : "İştirak Nafakası"} />
            <ResultRow label="Alt Tahmin" value={fmt(result.min)} />
            <ResultRow label="Üst Tahmin" value={fmt(result.max)} />
            <ResultRow label="Tahmini Aylık Aralık" value={`${fmt(result.min)} – ${fmt(result.max)}`} highlight />
            <p className="mt-3 text-[11px] leading-relaxed text-gray-400">{result.aciklama}</p>
          </motion.div>
        )
      }
      disclaimer="Nafaka miktarı; tarafların ekonomik durumu, yaşam standardı ve çocuğun ihtiyaçları gibi çok sayıda faktöre göre hâkim tarafından takdir edilir. Bu araç yalnızca fikir vermek amacıyla tasarlanmıştır."
    >
      <CalcSelect
        label="Nafaka Türü"
        id="n-tur"
        value={nafakaTuru}
        onChange={setNafakaTuru}
        options={[
          { value: "yoksulluk", label: "Yoksulluk Nafakası (Eş)" },
          { value: "istirak", label: "İştirak Nafakası (Çocuk)" },
        ]}
      />
      {nafakaTuru === "istirak" && (
        <CalcInput label="Çocuk Sayısı" id="n-cocuk" type="number" value={cocukSayisi} onChange={setCocukSayisi} suffix="çocuk" min="1" />
      )}
      <CalcInput label="Borçlunun Net Aylık Geliri" id="n-gelir" type="number" value={netGelir} onChange={setNetGelir} suffix="₺" min="0" placeholder="0,00" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Miras Paylaşımı (Veraset) ----------
interface Mirascilar {
  esVar: boolean;
  cocukSayisi: number;
  anneVar: boolean;
  babaVar: boolean;
}

function mirasHesapla(m: Mirascilar, toplam: number) {
  const paylar: { ad: string; oran: string; tutar: number }[] = [];
  const c = m.cocukSayisi;
  const esPay = m.esVar;

  if (c > 0) {
    // 1. zümre: çocuklar
    const esOran = esPay ? 1 / 4 : 0;
    const cocukToplamOran = 1 - esOran;
    const cocukBirimOran = cocukToplamOran / c;
    if (esPay) paylar.push({ ad: "Sağ Kalan Eş", oran: "1/4", tutar: toplam * esOran });
    for (let i = 1; i <= c; i++) {
      paylar.push({
        ad: c === 1 ? "Çocuk" : `Çocuk ${i}`,
        oran: c === 1 ? (esPay ? "3/4" : "Tamamı") : `${cocukToplamOran.toFixed(2)}/${c}`,
        tutar: toplam * cocukBirimOran,
      });
    }
  } else if (m.anneVar || m.babaVar) {
    // 2. zümre: anne/baba
    const esOran = esPay ? 1 / 2 : 0;
    const kalanOran = 1 - esOran;
    const ebevCount = (m.anneVar ? 1 : 0) + (m.babaVar ? 1 : 0);
    const ebevBirim = kalanOran / ebevCount;
    if (esPay) paylar.push({ ad: "Sağ Kalan Eş", oran: "1/2", tutar: toplam * esOran });
    if (m.anneVar) paylar.push({ ad: "Anne", oran: ebevCount === 1 ? (esPay ? "1/2" : "Tamamı") : (esPay ? "1/4" : "1/2"), tutar: toplam * ebevBirim });
    if (m.babaVar) paylar.push({ ad: "Baba", oran: ebevCount === 1 ? (esPay ? "1/2" : "Tamamı") : (esPay ? "1/4" : "1/2"), tutar: toplam * ebevBirim });
  } else if (esPay) {
    paylar.push({ ad: "Sağ Kalan Eş", oran: "Tamamı (1/1)", tutar: toplam });
  }

  return paylar;
}

export function MirasPaylasimi() {
  const [toplam, setToplam] = useState("");
  const [esVar, setEsVar] = useState(true);
  const [cocuk, setCocuk] = useState("2");
  const [anne, setAnne] = useState(false);
  const [baba, setBaba] = useState(false);
  const [result, setResult] = useState<null | { ad: string; oran: string; tutar: number }[]>(null);

  function hesapla() {
    const t = parseFloat(toplam.replace(/\./g, "").replace(",", ".")) || 0;
    if (!t) return;
    const paylar = mirasHesapla(
      { esVar, cocukSayisi: parseInt(cocuk) || 0, anneVar: anne, babaVar: baba },
      t,
    );
    setResult(paylar.length ? paylar : null);
  }

  const cocukSayisi = parseInt(cocuk) || 0;

  return (
    <CalcShell
      title="Miras Paylaşımı Simülatörü"
      description="Türk Medeni Kanunu'na göre yasal mirasçıların (eş, çocuk, anne-baba) miras paylarını ve tahmini tutarları gösterir."
      result={
        result && (
          <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {result.map((p) => (
              <ResultRow key={p.ad} label={p.ad} value={`${p.oran} — ${fmt(p.tutar)}`} />
            ))}
            <ResultRow label="Toplam Miras" value={fmt(parseFloat(toplam) || 0)} highlight />
          </motion.div>
        )
      }
      disclaimer="Bu simülatör yalnızca yasal (kanuni) mirasçıları kapsar; vasiyetname veya miras sözleşmesi durumunda paylar farklılaşır. Saklı pay kuralları (tenkis) ayrıca değerlendirilmelidir."
    >
      <CalcInput label="Toplam Miras Değeri (₺)" id="m-toplam" type="number" value={toplam} onChange={setToplam} suffix="₺" min="0" placeholder="0,00" />

      {/* Mirasçı seçimleri */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Sağ Kalan Eş", checked: esVar, onChange: setEsVar },
          { label: "Anne", checked: anne, onChange: setAnne },
          { label: "Baba", checked: baba, onChange: setBaba },
        ].map(({ label, checked, onChange }) => (
          <label key={label} className="flex cursor-pointer items-center gap-2 border border-gray-200 bg-white px-3 py-2.5 text-sm text-navy transition-colors hover:border-gold/50 has-[:checked]:border-gold/60 has-[:checked]:bg-gold/5">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-gold" />
            {label}
          </label>
        ))}
        <div className="border border-gray-200 bg-white px-3 py-2.5">
          <label htmlFor="m-cocuk" className="block text-[10px] uppercase tracking-wider text-gray-400">Çocuk</label>
          <input
            id="m-cocuk"
            type="number"
            min="0"
            max="20"
            value={cocuk}
            onChange={(e) => setCocuk(e.target.value)}
            className="mt-0.5 w-full bg-transparent text-sm text-navy outline-none"
          />
        </div>
      </div>

      {cocukSayisi === 0 && !esVar && !anne && !baba && (
        <p className="text-xs text-amber-600">Lütfen en az bir mirasçı seçiniz.</p>
      )}

      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}
