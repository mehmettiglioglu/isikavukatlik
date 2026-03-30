import { useState } from "react";
import { motion } from "framer-motion";
import CalcShell, { CalcInput, CalcDatePicker, CalcSelect, CalcButton, ResultRow, fmt } from "./CalcShell";

const ICRA_BASVURU_HARCI = 89.70;
const TEBLIGAT_BIRIM = 75;
const PESINAT_ORAN = 0.00590;

function hesaplaAaüt(deger: number): number {
  if (deger <= 0) return 0;
  if (deger <= 13_000) return 17_900;
  const dilimler = [
    { alt: 0,         ust: 13_000,    oran: 0 },
    { alt: 13_000,    ust: 130_000,   oran: 0.15 },
    { alt: 130_000,   ust: 430_000,   oran: 0.13 },
    { alt: 430_000,   ust: 1_500_000, oran: 0.11 },
    { alt: 1_500_000, ust: 3_500_000, oran: 0.09 },
    { alt: 3_500_000, ust: Infinity,  oran: 0.07 },
  ];
  let toplam = 0;
  for (const d of dilimler) {
    if (deger <= d.alt) break;
    toplam += (Math.min(deger, d.ust) - d.alt) * d.oran;
  }
  return Math.max(toplam, 17_900);
}

// ---------- İlamsız İcra Takibi ----------
export function IcraGiderleri() {
  const [alacak, setAlacak] = useState("");
  const [tebligat, setTebligat] = useState("3");
  const [result, setResult] = useState<null | { basvuru: number; pesinat: number; teb: number; vekalet: number; toplam: number }>(null);

  function hesapla() {
    const a = parseFloat(alacak.replace(/\./g, "").replace(",", ".")) || 0;
    if (!a) return;
    const teb = parseInt(tebligat) || 3;
    const basvuru = ICRA_BASVURU_HARCI;
    const pesinat = a * PESINAT_ORAN;
    const tebGider = teb * TEBLIGAT_BIRIM;
    const vekalet = hesaplaAaüt(a);
    setResult({ basvuru, pesinat, teb: tebGider, vekalet, toplam: basvuru + pesinat + tebGider + vekalet });
  }

  return (
    <CalcShell
      title="İlamsız İcra Takibi Tahmini Maliyeti"
      description="Alacak miktarına göre harçlar, tebligat giderleri ve AAÜT vekalet ücretini içeren toplam tahmini maliyet dökümü."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Başvuru Harcı" value={fmt(result.basvuru)} />
            <ResultRow label="Peşin Harç (‰5,9)" value={fmt(result.pesinat)} />
            <ResultRow label="Tebligat Giderleri" value={fmt(result.teb)} />
            <ResultRow label="Min. Vekalet Ücreti (AAÜT)" value={fmt(result.vekalet)} />
            <ResultRow label="Toplam Tahmini Gider" value={fmt(result.toplam)} highlight />
          </motion.div>
        )
      }
      disclaimer="Harç tutarları 2025 bütçe kanununa göredir. Tahsil harcı ve yargılama giderleri ayrıca doğacaktır."
    >
      <CalcInput label="Takip Konusu Alacak" id="ic-alacak" type="number" value={alacak} onChange={setAlacak} suffix="₺" min="0" placeholder="0,00" />
      <CalcInput label="Tahmini Tebligat Sayısı" id="ic-teb" type="number" value={tebligat} onChange={setTebligat} suffix="adet" min="1" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Gecikme Faizi ----------
const FAIZ_ORANLARI = [
  { value: "yasal",  label: "Yasal Faiz — %9",           oran: 9 },
  { value: "ticari", label: "TCMB Avans (Ticari) — ~%48", oran: 48 },
  { value: "custom", label: "Özel Oran Gir",              oran: 0 },
];

export function GecikmeGaizi() {
  const [anaPara, setAnaPara] = useState("");
  const [baslangic, setBaslangic] = useState<Date | null>(null);
  const [bitis, setBitis] = useState<Date | null>(null);
  const [faizTuru, setFaizTuru] = useState("yasal");
  const [customOran, setCustomOran] = useState("");
  const [result, setResult] = useState<null | { gun: number; oran: number; faiz: number; toplam: number }>(null);

  function hesapla() {
    const ana = parseFloat(anaPara.replace(/\./g, "").replace(",", ".")) || 0;
    if (!ana || !baslangic || !bitis || bitis <= baslangic) return;
    const gun = Math.floor((bitis.getTime() - baslangic.getTime()) / 86_400_000);
    const oran = faizTuru === "custom"
      ? parseFloat(customOran) || 0
      : FAIZ_ORANLARI.find((f) => f.value === faizTuru)!.oran;
    const faiz = ana * (oran / 100) * (gun / 365);
    setResult({ gun, oran, faiz, toplam: ana + faiz });
  }

  return (
    <CalcShell
      title="Gecikme Faizi Hesaplama"
      description="Yasal veya ticari faiz oranı üzerinden iki tarih arasındaki faiz miktarını basit faiz yöntemiyle hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Süre" value={`${result.gun} gün`} />
            <ResultRow label="Faiz Oranı" value={`%${result.oran}`} />
            <ResultRow label="Ana Para" value={fmt(parseFloat(anaPara) || 0)} />
            <ResultRow label="Faiz Tutarı" value={fmt(result.faiz)} />
            <ResultRow label="Toplam Borç" value={fmt(result.toplam)} highlight />
          </motion.div>
        )
      }
      disclaimer="Yasal faiz %9 (3095 sayılı Kanun, 2024). Ticari faiz için TCMB avans oranı esas alınmıştır. Bileşik faiz hesaplanmamıştır."
    >
      <CalcInput label="Ana Para" id="gf-ana" type="number" value={anaPara} onChange={setAnaPara} suffix="₺" min="0" placeholder="0,00" />
      <div className="grid gap-4 sm:grid-cols-2">
        <CalcDatePicker label="Faiz Başlangıç Tarihi" id="gf-bas" value={baslangic} onChange={setBaslangic} />
        <CalcDatePicker label="Faiz Bitiş Tarihi" id="gf-bit" value={bitis} onChange={setBitis} />
      </div>
      <CalcSelect
        label="Faiz Türü"
        id="gf-tur"
        value={faizTuru}
        onChange={setFaizTuru}
        options={FAIZ_ORANLARI.map((f) => ({ value: f.value, label: f.label }))}
      />
      {faizTuru === "custom" && (
        <CalcInput label="Yıllık Faiz Oranı" id="gf-custom" type="number" value={customOran} onChange={setCustomOran} suffix="%" min="0" step="0.1" placeholder="0,00" />
      )}
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Vekalet Ücreti (AAÜT) ----------
export function VekaletUcreti() {
  const [deger, setDeger] = useState("");
  const [davaTuru, setDavaTuru] = useState("asliye");
  const [result, setResult] = useState<null | { ucret: number; kdv: number; toplam: number }>(null);

  function hesapla() {
    const d = parseFloat(deger.replace(/\./g, "").replace(",", ".")) || 0;
    if (!d) return;
    const minUcret = davaTuru === "sulh" ? 12_900 : 17_900;
    const ucret = Math.max(hesaplaAaüt(d), minUcret);
    const kdv = ucret * 0.20;
    setResult({ ucret, kdv, toplam: ucret + kdv });
  }

  return (
    <CalcShell
      title="Vekalet Ücreti (AAÜT)"
      description="2025 Avukatlık Asgari Ücret Tarifesi'ne göre dava değerine bağlı asgari vekalet ücretini ve KDV'yi hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="AAÜT Asgari Ücreti" value={fmt(result.ucret)} />
            <ResultRow label="KDV (%20)" value={fmt(result.kdv)} />
            <ResultRow label="KDV Dahil Toplam" value={fmt(result.toplam)} highlight />
          </motion.div>
        )
      }
      disclaimer="Bu yalnızca asgari ücrettir. Fiili avukatlık ücreti sözleşmeyle serbestçe belirlenebilir. Karşı taraf aleyhine hükmedilen ücret mahkeme kararıyla belirlenir."
    >
      <CalcInput label="Dava / Alacak Değeri" id="v-deger" type="number" value={deger} onChange={setDeger} suffix="₺" min="0" placeholder="0,00" />
      <CalcSelect
        label="Mahkeme Türü"
        id="v-tur"
        value={davaTuru}
        onChange={setDavaTuru}
        options={[
          { value: "asliye", label: "Asliye / İş / İdare Mahkemesi" },
          { value: "sulh",   label: "Sulh Hukuk Mahkemesi" },
        ]}
      />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}
