import { useState } from "react";
import { motion } from "framer-motion";
import CalcShell, { CalcInput, CalcSelect, CalcButton, ResultRow, fmt } from "./CalcShell";

// ---------- İş Kazası Tazminatı ----------
const IS_KAZASI_SEVERITY = [
  { value: "hafif",  label: "Hafif (%1–20 maluliyet)",  yilFaktor: 10 },
  { value: "orta",   label: "Orta (%21–50 maluliyet)",  yilFaktor: 15 },
  { value: "agir",   label: "Ağır (%51–99 maluliyet)",  yilFaktor: 20 },
];

export function IsKazasiTazminati() {
  const [brut, setBrut] = useState("");
  const [maluliyetOran, setMaluliyetOran] = useState("");
  const [tedavi, setTedavi] = useState("");
  const [severity, setSeverity] = useState("orta");
  const [result, setResult] = useState<null | {
    maluliyet: number; tedaviN: number; toplam: number; yilFaktor: number;
  }>(null);

  function hesapla() {
    const brutN = parseFloat(brut.replace(/\./g, "").replace(",", ".")) || 0;
    const oran = parseFloat(maluliyetOran.replace(",", ".")) || 0;
    const tedaviN = parseFloat(tedavi.replace(/\./g, "").replace(",", ".")) || 0;
    if (!brutN || !oran) return;
    const sev = IS_KAZASI_SEVERITY.find((s) => s.value === severity)!;
    const maluliyet = brutN * 12 * (oran / 100) * sev.yilFaktor;
    setResult({ maluliyet, tedaviN, toplam: maluliyet + tedaviN, yilFaktor: sev.yilFaktor });
  }

  return (
    <CalcShell
      title="İş Kazası Tazminatı Hesaplama"
      description="İş kazası sonucu oluşan maluliyet ve gelir kaybına göre tahmini maddi tazminat tutarını hesaplar. SGK rücu hakları ayrıca değerlendirilir."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Baz Yıl Faktörü" value={`${result.yilFaktor} yıl`} />
            <ResultRow label="Maluliyet Tazminatı" value={fmt(result.maluliyet)} />
            {result.tedaviN > 0 && (
              <ResultRow label="Tedavi / Bakım Giderleri" value={fmt(result.tedaviN)} />
            )}
            <ResultRow label="Tahmini Toplam Tazminat" value={fmt(result.toplam)} highlight />
          </motion.div>
        )
      }
      disclaimer="Bu hesaplama PMF tablosu yerine basitleştirilmiş yıl faktörü kullanmaktadır. Gerçek tazminat aktüer raporu ve SGK ödemeleri dikkate alınarak mahkemece belirlenir."
    >
      <CalcInput label="Brüt Aylık Ücret" id="ik-brut" type="number" value={brut} onChange={setBrut} suffix="₺" min="0" placeholder="0,00" />
      <CalcInput label="Maluliyet Oranı" id="ik-oran" type="number" value={maluliyetOran} onChange={setMaluliyetOran} suffix="%" min="0" max="99" step="0.1" placeholder="Örn: 25" />
      <CalcSelect
        label="Yaralanma Ağırlığı"
        id="ik-severity"
        value={severity}
        onChange={setSeverity}
        options={IS_KAZASI_SEVERITY.map((s) => ({ value: s.value, label: s.label }))}
      />
      <CalcInput label="Tedavi / Bakım Giderleri (opsiyonel)" id="ik-tedavi" type="number" value={tedavi} onChange={setTedavi} suffix="₺" min="0" placeholder="0,00" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Trafik Kazası Tazminatı ----------
const YAS_CALISMA_YILI: { max: number; yil: number }[] = [
  { max: 25, yil: 40 }, { max: 30, yil: 35 }, { max: 35, yil: 30 },
  { max: 40, yil: 25 }, { max: 45, yil: 20 }, { max: 50, yil: 15 },
  { max: 55, yil: 10 }, { max: 65, yil: 5  }, { max: 999, yil: 2 },
];

export function TrafikTazminati() {
  const [netGelir, setNetGelir] = useState("");
  const [maluliyetOran, setMaluliyetOran] = useState("");
  const [yas, setYas] = useState("");
  const [tedavi, setTedavi] = useState("");
  const [result, setResult] = useState<null | {
    kalanYil: number; isGoremezlik: number; tedaviN: number; toplam: number;
  }>(null);

  function hesapla() {
    const gelir = parseFloat(netGelir.replace(/\./g, "").replace(",", ".")) || 0;
    const oran = parseFloat(maluliyetOran.replace(",", ".")) || 0;
    const yasN = parseInt(yas) || 0;
    const tedaviN = parseFloat(tedavi.replace(/\./g, "").replace(",", ".")) || 0;
    if (!gelir || !oran || !yasN) return;
    const kalanYil = YAS_CALISMA_YILI.find((y) => yasN < y.max)?.yil ?? 2;
    const isGoremezlik = gelir * 12 * (oran / 100) * kalanYil;
    setResult({ kalanYil, isGoremezlik, tedaviN, toplam: isGoremezlik + tedaviN });
  }

  return (
    <CalcShell
      title="Trafik Kazası Tazminat Hesaplama"
      description="Yaralanmalı trafik kazalarında maluliyet ve gelir kaybına dayalı tahmini iş göremezlik tazminatını hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Tahmini Kalan Çalışma Yılı" value={`${result.kalanYil} yıl`} />
            <ResultRow label="İş Göremezlik Tazminatı" value={fmt(result.isGoremezlik)} />
            {result.tedaviN > 0 && (
              <ResultRow label="Tedavi / Onarım Giderleri" value={fmt(result.tedaviN)} />
            )}
            <ResultRow label="Tahmini Toplam Tazminat" value={fmt(result.toplam)} highlight />
          </motion.div>
        )
      }
      disclaimer="Hesaplama aktüeryal PMF tablosu yerine basit yıl faktörü kullanır. Manevi tazminat, destekten yoksun kalma ve SGK rücu hakları dahil değildir."
    >
      <CalcInput label="Net Aylık Gelir" id="tt-gelir" type="number" value={netGelir} onChange={setNetGelir} suffix="₺" min="0" placeholder="0,00" />
      <CalcInput label="Maluliyet Oranı" id="tt-oran" type="number" value={maluliyetOran} onChange={setMaluliyetOran} suffix="%" min="0" max="99" step="0.1" placeholder="Örn: 15" />
      <CalcInput label="Yaş" id="tt-yas" type="number" value={yas} onChange={setYas} suffix="yaş" min="18" max="80" placeholder="Örn: 35" />
      <CalcInput label="Tedavi / Araç Onarım Giderleri (opsiyonel)" id="tt-tedavi" type="number" value={tedavi} onChange={setTedavi} suffix="₺" min="0" placeholder="0,00" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Araç Değer Kaybı ----------
const ARAC_YAS_FAKTOR: { label: string; value: string; faktor: number }[] = [
  { value: "0-1",  label: "0–1 yıl",  faktor: 0.10 },
  { value: "1-3",  label: "1–3 yıl",  faktor: 0.08 },
  { value: "3-5",  label: "3–5 yıl",  faktor: 0.06 },
  { value: "5-8",  label: "5–8 yıl",  faktor: 0.04 },
  { value: "8+",   label: "8+ yıl",   faktor: 0.02 },
];

export function AracDegerKaybi() {
  const [aracDeger, setAracDeger] = useState("");
  const [hasarOran, setHasarOran] = useState("");
  const [yasKademe, setYasKademe] = useState("1-3");
  const [result, setResult] = useState<null | { degerKaybi: number; faktor: number }>(null);

  function hesapla() {
    const deger = parseFloat(aracDeger.replace(/\./g, "").replace(",", ".")) || 0;
    const hasar = parseFloat(hasarOran.replace(",", ".")) || 0;
    if (!deger || !hasar) return;
    const faktor = ARAC_YAS_FAKTOR.find((y) => y.value === yasKademe)!.faktor;
    const degerKaybi = deger * (hasar / 100) * (1 - faktor * (hasar / 100));
    setResult({ degerKaybi, faktor });
  }

  return (
    <CalcShell
      title="Araç Değer Kaybı Hesaplama"
      description="Trafik kazası sonrası araç piyasa değeri, hasar ağırlığı ve araç yaşına göre tahmini değer kaybı tazminatını hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Araç Değeri" value={fmt(parseFloat(aracDeger) || 0)} />
            <ResultRow label="Hasar Oranı" value={`%${hasarOran}`} />
            <ResultRow label="Yaş Amortisman Faktörü" value={`%${(result.faktor * 100).toFixed(0)}`} />
            <ResultRow label="Tahmini Değer Kaybı" value={fmt(result.degerKaybi)} highlight />
          </motion.div>
        )
      }
      disclaimer="Değer kaybı miktarı eksper raporu, aracın marka/modeli ve hasarın niteliğine göre mahkemece belirlenir. Bu hesaplama tahmini aralık sunmaktadır."
    >
      <CalcInput label="Aracın Piyasa Değeri" id="adk-deger" type="number" value={aracDeger} onChange={setAracDeger} suffix="₺" min="0" placeholder="0,00" />
      <CalcInput label="Hasar Oranı" id="adk-hasar" type="number" value={hasarOran} onChange={setHasarOran} suffix="%" min="0" max="100" step="0.1" placeholder="Örn: 30" />
      <CalcSelect
        label="Araç Yaşı"
        id="adk-yas"
        value={yasKademe}
        onChange={setYasKademe}
        options={ARAC_YAS_FAKTOR.map((y) => ({ value: y.value, label: y.label }))}
      />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}
