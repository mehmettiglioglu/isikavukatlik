import { useState } from "react";
import { motion } from "framer-motion";
import CalcShell, { CalcInput, CalcDatePicker, CalcButton, ResultRow, fmt } from "./CalcShell";

// 2025 / 1. yarı kıdem tazminatı tavanı
const KIDEM_TAVAN = 47_499.13;

// ---------- Kıdem Tazminatı ----------
export function KidemTazminati() {
  const [giris, setGiris] = useState<Date | null>(null);
  const [cikis, setCikis] = useState<Date | null>(null);
  const [brut, setBrut] = useState("");
  const [result, setResult] = useState<null | { gun: number; yil: number; baz: number; tutar: number }>(null);

  function hesapla() {
    const brutN = parseFloat(brut.replace(/\./g, "").replace(",", ".")) || 0;
    if (!giris || !cikis || !brutN || cikis <= giris) return;
    const gun = Math.floor((cikis.getTime() - giris.getTime()) / 86_400_000);
    const yil = gun / 365;
    const baz = Math.min(brutN, KIDEM_TAVAN);
    setResult({ gun, yil, baz, tutar: baz * yil });
  }

  return (
    <CalcShell
      title="Kıdem Tazminatı Hesaplama"
      description="Brüt maaş ve çalışma süresine göre kıdem tazminatını, 2025/1. yarı yasal tavan (₺47.499,13) baz alarak hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Toplam Çalışma Süresi" value={`${result.gun} gün · ${result.yil.toFixed(2)} yıl`} />
            <ResultRow label="Hesaba Esas Ücret" value={fmt(result.baz)} />
            {result.baz < (parseFloat(brut) || 0) && (
              <ResultRow label="Tavan Uygulandı" value={`₺${KIDEM_TAVAN.toLocaleString("tr-TR")}`} />
            )}
            <ResultRow label="Tahmini Kıdem Tazminatı" value={fmt(result.tutar)} highlight />
          </motion.div>
        )
      }
      disclaimer="Kıdem tazminatı hak kazanma koşulları (en az 1 yıl çalışma, haklı nedenle fesih vb.) gözetilmemiştir. Damga vergisi ve diğer kesintiler dahil değildir."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CalcDatePicker label="İşe Giriş Tarihi" id="k-giris" value={giris} onChange={setGiris} />
        <CalcDatePicker label="İşten Çıkış Tarihi" id="k-cikis" value={cikis} onChange={setCikis} />
      </div>
      <CalcInput label="Brüt Aylık Ücret" id="k-brut" type="number" value={brut} onChange={setBrut} suffix="₺" min="0" step="1" placeholder="0,00" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- İhbar Tazminatı ----------
const IHBAR_KADEMELERI = [
  { minAy: 0,  maxAy: 6,        hafta: 2, label: "0 – 6 ay" },
  { minAy: 6,  maxAy: 18,       hafta: 4, label: "6 – 18 ay" },
  { minAy: 18, maxAy: 36,       hafta: 6, label: "18 – 36 ay" },
  { minAy: 36, maxAy: Infinity,  hafta: 8, label: "36 ay ve üzeri" },
];

export function IhbarTazminati() {
  const [giris, setGiris] = useState<Date | null>(null);
  const [cikis, setCikis] = useState<Date | null>(null);
  const [brut, setBrut] = useState("");
  const [result, setResult] = useState<null | { ay: number; hafta: number; gun: number; tutar: number; kademe: string }>(null);

  function hesapla() {
    const brutN = parseFloat(brut.replace(/\./g, "").replace(",", ".")) || 0;
    if (!giris || !cikis || !brutN || cikis <= giris) return;
    const gun = Math.floor((cikis.getTime() - giris.getTime()) / 86_400_000);
    const ay = gun / 30.44;
    const k = IHBAR_KADEMELERI.find((x) => ay >= x.minAy && ay < x.maxAy)!;
    const ihbarGun = k.hafta * 7;
    setResult({ ay, hafta: k.hafta, gun: ihbarGun, tutar: (brutN / 30) * ihbarGun, kademe: k.label });
  }

  return (
    <CalcShell
      title="İhbar Tazminatı Hesaplama"
      description="İş Kanunu 17. maddesine göre çalışma süresine karşılık gelen ihbar süresi ve brüt ücret üzerinden tazminat tutarını hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Toplam Süre" value={`${result.ay.toFixed(1)} ay`} />
            <ResultRow label="Kademe" value={result.kademe} />
            <ResultRow label="İhbar Süresi" value={`${result.hafta} hafta (${result.gun} gün)`} />
            <ResultRow label="Günlük Brüt" value={fmt(parseFloat(brut) / 30)} />
            <ResultRow label="Tahmini İhbar Tazminatı" value={fmt(result.tutar)} highlight />
          </motion.div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CalcDatePicker label="İşe Giriş Tarihi" id="i-giris" value={giris} onChange={setGiris} />
        <CalcDatePicker label="İşten Çıkış Tarihi" id="i-cikis" value={cikis} onChange={setCikis} />
      </div>
      <CalcInput label="Brüt Aylık Ücret" id="i-brut" type="number" value={brut} onChange={setBrut} suffix="₺" min="0" step="1" placeholder="0,00" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Yıllık İzin ----------
export function YillikIzin() {
  const [brut, setBrut] = useState("");
  const [gun, setGun] = useState("");
  const [result, setResult] = useState<null | { gunluk: number; tutar: number }>(null);

  function hesapla() {
    const brutN = parseFloat(brut.replace(/\./g, "").replace(",", ".")) || 0;
    const g = parseInt(gun) || 0;
    if (!brutN || !g) return;
    const gunluk = brutN / 30;
    setResult({ gunluk, tutar: gunluk * g });
  }

  return (
    <CalcShell
      title="Yıllık İzin Ücreti Hesaplama"
      description="Kullanılmayan yıllık izin günlerinin, iş akdinin sona erdiği tarihteki son brüt maaş üzerinden nakde çevrilmesini hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Günlük Brüt Ücret" value={fmt(result.gunluk)} />
            <ResultRow label="Kullanılmayan İzin" value={`${gun} gün`} />
            <ResultRow label="Tahmini İzin Ücreti" value={fmt(result.tutar)} highlight />
          </motion.div>
        )
      }
      disclaimer="Vergi ve SGK kesintileri gösterilmemiştir. Fiili ödeme miktarı net ücret hesabından düşük olacaktır."
    >
      <CalcInput label="Son Brüt Aylık Ücret" id="y-brut" type="number" value={brut} onChange={setBrut} suffix="₺" min="0" placeholder="0,00" />
      <CalcInput label="Kullanılmayan İzin Gün Sayısı" id="y-gun" type="number" value={gun} onChange={setGun} suffix="gün" min="0" placeholder="0" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}
