import { useState } from "react";
import { motion } from "framer-motion";
import CalcShell, { CalcInput, CalcSelect, CalcDatePicker, CalcButton, ResultRow, fmt } from "./CalcShell";

// ---------- Islah Harcı ----------
// 2025: Nispi harç oranı binde 68,31 (dava harcı ile aynı kademe)
const ISLAH_ORAN = 68.31 / 1000;

export function IslahHarci() {
  const [asil, setAsil] = useState("");
  const [islah, setIslah] = useState("");
  const [result, setResult] = useState<null | {
    fark: number; harc: number; damga: number; toplam: number;
  }>(null);

  function hesapla() {
    const asilN = parseFloat(asil.replace(/\./g, "").replace(",", ".")) || 0;
    const islahN = parseFloat(islah.replace(/\./g, "").replace(",", ".")) || 0;
    if (!asilN || !islahN || islahN <= asilN) return;
    const fark = islahN - asilN;
    const harc = fark * ISLAH_ORAN;
    const damga = fark * 0.00759; // damga vergisi oranı 2025
    setResult({ fark, harc, damga, toplam: harc + damga });
  }

  return (
    <CalcShell
      title="Islah Harcı Hesaplama"
      description="Dava sürecinde artırılan talep miktarı üzerinden ödenmesi gereken ek ıslah harcını 2025 yargı harç tarifesine göre hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow label="Islah Miktarı (Fark)" value={fmt(result.fark)} />
            <ResultRow label="Nispi Harç (‰68,31)" value={fmt(result.harc)} />
            <ResultRow label="Damga Vergisi (‰7,59)" value={fmt(result.damga)} />
            <ResultRow label="Toplam Ödenmesi Gereken" value={fmt(result.toplam)} highlight />
          </motion.div>
        )
      }
      disclaimer="Islah harcı yalnızca fark miktarı üzerinden hesaplanır. Peşin harç iade ve mahsup koşulları için avukatınıza danışınız."
    >
      <CalcInput
        label="Asıl Dava Değeri (Açılış)"
        id="ih-asil"
        type="number"
        value={asil}
        onChange={setAsil}
        suffix="₺"
        min="0"
        placeholder="0,00"
      />
      <CalcInput
        label="Islah Sonrası Yeni Dava Değeri"
        id="ih-islah"
        type="number"
        value={islah}
        onChange={setIslah}
        suffix="₺"
        min="0"
        placeholder="0,00"
      />
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}

// ---------- E-Tebligat Tebliğ Tarihi ----------
const TEBLIGAT_TURLERI = [
  {
    value: "dava",
    label: "Dava / Hukuki İşlem",
    okunmadanGun: 5,
    cevapGun: 14,
    aciklama: "5. günün sonunda tebliğ sayılır; cevap süresi 2 haftadır.",
  },
  {
    value: "icra",
    label: "İcra / İflas Dairesi",
    okunmadanGun: 5,
    cevapGun: 7,
    aciklama: "5. günün sonunda tebliğ sayılır; itiraz süresi 7 gündür.",
  },
  {
    value: "idari",
    label: "İdari / Vergi Tebligatı",
    okunmadanGun: 5,
    cevapGun: 30,
    aciklama: "5. günün sonunda tebliğ sayılır; itiraz süresi 30 gündür.",
  },
];

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export function ETebligat() {
  const [gonderiTarih, setGonderiTarih] = useState<Date | null>(null);
  const [okunduMu, setOkunduMu] = useState("hayir");
  const [okumaTarih, setOkumaTarih] = useState<Date | null>(null);
  const [tur, setTur] = useState("dava");
  const [result, setResult] = useState<null | {
    tebligTarihi: Date; sonGun: Date; aciklama: string;
  }>(null);

  function hesapla() {
    if (!gonderiTarih) return;
    const turInfo = TEBLIGAT_TURLERI.find((t) => t.value === tur)!;
    let tebligTarihi: Date;

    if (okunduMu === "evet" && okumaTarih) {
      tebligTarihi = okumaTarih;
    } else {
      tebligTarihi = addDays(gonderiTarih, turInfo.okunmadanGun);
    }

    const sonGun = addDays(tebligTarihi, turInfo.cevapGun);
    setResult({ tebligTarihi, sonGun, aciklama: turInfo.aciklama });
  }

  return (
    <CalcShell
      title="E-Tebligat Tebliğ Tarihi Hesaplama"
      description="7201 sayılı Tebligat Kanunu'na göre elektronik tebligatın tebliğ tarihi ve yasal cevap/itiraz süresinin son gününü hesaplar."
      result={
        result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ResultRow
              label={okunduMu === "evet" ? "Tebliğ Tarihi (Okunma)" : "Tebliğ Tarihi (5. Gün)"}
              value={fmtDate(result.tebligTarihi)}
            />
            <ResultRow label="Süre Son Günü" value={fmtDate(result.sonGun)} highlight />
            <p className="mt-4 text-[11px] leading-relaxed text-gray-400">{result.aciklama}</p>
          </motion.div>
        )
      }
      disclaimer="E-tebligat; muhatap tarafından okunduğunda o tarihte, okunmadığında ise sisteme yüklendiği tarihten 5 gün sonra tebliğ edilmiş sayılır (Tebligat K. m.7/a). Resmi takvim tatilleri bu hesaplamada dikkate alınmamıştır."
    >
      <CalcSelect
        label="Tebligat Türü"
        id="et-tur"
        value={tur}
        onChange={setTur}
        options={TEBLIGAT_TURLERI.map((t) => ({ value: t.value, label: t.label }))}
      />
      <CalcDatePicker
        label="Tebligatın Sisteme Yüklendiği Tarih"
        id="et-gonder"
        value={gonderiTarih}
        onChange={setGonderiTarih}
      />
      <CalcSelect
        label="Muhatap Tebligatı Okudu mu?"
        id="et-okundu"
        value={okunduMu}
        onChange={setOkunduMu}
        options={[
          { value: "hayir", label: "Hayır (5 gün kuralı uygulanır)" },
          { value: "evet",  label: "Evet (okuma tarihi girilecek)" },
        ]}
      />
      {okunduMu === "evet" && (
        <CalcDatePicker
          label="Okunma Tarihi"
          id="et-okuma"
          value={okumaTarih}
          onChange={setOkumaTarih}
        />
      )}
      <CalcButton onClick={hesapla} />
    </CalcShell>
  );
}
