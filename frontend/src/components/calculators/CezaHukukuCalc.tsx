import { useState } from "react";
import { motion } from "framer-motion";
import CalcShell, { CalcInput, CalcSelect, CalcButton, ResultRow, fmt } from "./CalcShell";

// TCK m.52: 1 gün = 20 TL (alt) – 100 TL (üst)
const ALT_LIMIT = 20;
const UST_LIMIT = 100;

export function AdliParaCezasi() {
  const [gun, setGun] = useState("");
  const [ekonomik, setEkonomik] = useState("orta");
  const [result, setResult] = useState<null | {
    altMin: number; altMax: number; ustMin: number; ustMax: number; tahmin: number;
  }>(null);

  const KATSAYILAR: Record<string, { alt: number; ust: number; label: string }> = {
    dusuk: { alt: 20, ust: 40, label: "Düşük (20–40 ₺/gün)" },
    orta: { alt: 40, ust: 70, label: "Orta (40–70 ₺/gün)" },
    yuksek: { alt: 70, ust: 100, label: "Yüksek (70–100 ₺/gün)" },
  };

  function hesapla() {
    const g = parseInt(gun) || 0;
    if (!g) return;
    const k = KATSAYILAR[ekonomik];
    setResult({
      altMin: g * ALT_LIMIT,
      altMax: g * UST_LIMIT,
      ustMin: g * k.alt,
      ustMax: g * k.ust,
      tahmin: g * ((k.alt + k.ust) / 2),
    });
  }

  return (
    <CalcShell
      title="Adli Para Cezası Hesaplama"
      description="TCK m.52 uyarınca gün para cezasının, sanığın ekonomik ve kişisel durumuna göre takdir edilen günlük miktarla çarpımını hesaplar."
      result={
        result && (
          <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Gün Sayısı" value={`${gun} gün`} />
            <ResultRow label="Yasal Alt Sınır (20 ₺/gün)" value={fmt(result.altMin)} />
            <ResultRow label="Yasal Üst Sınır (100 ₺/gün)" value={fmt(result.altMax)} />
            <ResultRow label="Seçilen Ekonomik Düzey Aralığı" value={`${fmt(result.ustMin)} – ${fmt(result.ustMax)}`} />
            <ResultRow label="Ortalama Tahmin" value={fmt(result.tahmin)} highlight />
          </motion.div>
        )
      }
      disclaimer="Gün para cezasında günlük miktar hâkim tarafından sanığın ekonomik ve kişisel durumu gözetilerek 20 TL ile 100 TL arasında belirlenir (TCK m.52/2). Bu hesaplama kesin yargı kararı yerine geçmez."
    >
      <CalcInput
        label="Gün Para Cezası (Gün Sayısı)"
        id="ap-gun"
        type="number"
        value={gun}
        onChange={setGun}
        suffix="gün"
        min="1"
        placeholder="Örn: 365"
      />
      <CalcSelect
        label="Ekonomik Durum Kademesi"
        id="ap-ekonomik"
        value={ekonomik}
        onChange={setEkonomik}
        options={Object.entries(KATSAYILAR).map(([v, d]) => ({ value: v, label: d.label }))}
      />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- Kira Artış Oranı (bonus hesaplayıcı) ----------
export function KiraArtis() {
  const [mevcutKira, setMevcutKira] = useState("");
  const [tufe, setTufe] = useState("");
  const [result, setResult] = useState<null | { artis: number; yeni: number; oran: number }>(null);

  function hesapla() {
    const kira = parseFloat(mevcutKira.replace(/\./g, "").replace(",", ".")) || 0;
    const oran = parseFloat(tufe.replace(",", ".")) || 0;
    if (!kira || !oran) return;
    const artis = kira * (oran / 100);
    setResult({ artis, yeni: kira + artis, oran });
  }

  return (
    <CalcShell
      title="Kira Artış Oranı Hesaplama"
      description="Konut kiraları için TÜFE 12 aylık ortalama değişim oranına göre yasal azami kira artışını hesaplar."
      result={
        result && (
          <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Mevcut Kira" value={fmt(parseFloat(mevcutKira) || 0)} />
            <ResultRow label="TÜFE Oranı" value={`%${result.oran}`} />
            <ResultRow label="Artış Tutarı" value={fmt(result.artis)} />
            <ResultRow label="Yeni Kira (Azami)" value={fmt(result.yeni)} highlight />
          </motion.div>
        )
      }
      disclaimer="Konut kira artışı Türk Borçlar Kanunu m.344 uyarınca TÜFE 12 aylık ortalama değişim oranıyla sınırlandırılmıştır. Güncel TÜFE oranını TÜİK'in resmi sitesinden doğrulayınız."
    >
      <CalcInput label="Mevcut Aylık Kira" id="ka-kira" type="number" value={mevcutKira} onChange={setMevcutKira} suffix="₺" min="0" placeholder="0,00" />
      <CalcInput label="TÜFE 12 Aylık Ort. Değişim Oranı" id="ka-tufe" type="number" value={tufe} onChange={setTufe} suffix="%" min="0" step="0.01" placeholder="Örn: 62.45" />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}
