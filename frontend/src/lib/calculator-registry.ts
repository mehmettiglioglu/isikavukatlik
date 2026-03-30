export type CalcCategory =
  | "is-hukuku"
  | "aile-hukuku"
  | "icra-finans"
  | "tazminat"
  | "ceza-diger";

export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: CalcCategory;
  categoryLabel: string;
  icon: string;
}

export const CALCULATORS: CalculatorMeta[] = [
  // ── İş Hukuku ──────────────────────────────────────────────────────
  {
    slug: "kidem-tazminati",
    title: "Kıdem Tazminatı Hesaplama",
    shortTitle: "Kıdem Tazminatı",
    description:
      "Brüt maaş ve işe giriş/çıkış tarihlerine göre 2025 yasal tavanını baz alarak tahmini kıdem tazminatınızı hesaplayın.",
    category: "is-hukuku",
    categoryLabel: "İş Hukuku",
    icon: "Briefcase",
  },
  {
    slug: "ihbar-tazminati",
    title: "İhbar Tazminatı Hesaplama",
    shortTitle: "İhbar Tazminatı",
    description:
      "Çalışma süresine göre belirlenen ihbar önelini ve brüt ücret üzerinden hesaplanan ihbar tazminatı tutarını öğrenin.",
    category: "is-hukuku",
    categoryLabel: "İş Hukuku",
    icon: "Briefcase",
  },
  {
    slug: "yillik-izin",
    title: "Yıllık İzin Ücreti Hesaplama",
    shortTitle: "Yıllık İzin Ücreti",
    description:
      "Kullanılmayan yıllık izin günlerinizin son brüt maaşınız üzerinden nakde çevrilmesi durumundaki tahmini tutarı hesaplayın.",
    category: "is-hukuku",
    categoryLabel: "İş Hukuku",
    icon: "CalendarDays",
  },
  {
    slug: "is-kazasi-tazminati",
    title: "İş Kazası Tazminatı Hesaplama",
    shortTitle: "İş Kazası Tazminatı",
    description:
      "İş kazası sonucu oluşan maluliyet oranı ve gelir kaybına göre tahmini maddi tazminat tutarını hesaplayın.",
    category: "is-hukuku",
    categoryLabel: "İş Hukuku",
    icon: "HardHat",
  },

  // ── Aile Hukuku ────────────────────────────────────────────────────
  {
    slug: "nafaka",
    title: "Nafaka Tahmin Aracı",
    shortTitle: "Nafaka Tahmini",
    description:
      "Yoksulluk ve iştirak nafakası için mahkeme takdir aralığını gelir ve çocuk sayısına göre tahmini olarak öğrenin.",
    category: "aile-hukuku",
    categoryLabel: "Aile Hukuku",
    icon: "Users",
  },
  {
    slug: "miras-paylasimi",
    title: "Miras Paylaşımı Simülatörü",
    shortTitle: "Miras Paylaşımı",
    description:
      "Türk Medeni Kanunu'na göre eş, çocuk ve anne-babanın yasal miras paylarını ve tahmini tutarlarını hesaplayın.",
    category: "aile-hukuku",
    categoryLabel: "Aile Hukuku",
    icon: "ScrollText",
  },

  // ── İcra & Finans ──────────────────────────────────────────────────
  {
    slug: "icra-masrafi",
    title: "İcra Masrafı Hesaplama",
    shortTitle: "İcra Masrafı",
    description:
      "İlamsız icra takibinde doğacak başvuru harcı, peşin harç, tebligat giderleri ve vekalet ücretinin toplam dökümünü görün.",
    category: "icra-finans",
    categoryLabel: "İcra & Finans",
    icon: "Landmark",
  },
  {
    slug: "gecikme-faizi",
    title: "Gecikme Faizi Hesaplama",
    shortTitle: "Gecikme Faizi",
    description:
      "Yasal veya ticari faiz oranı üzerinden iki tarih arasındaki faiz miktarını ve toplam borç tutarını hesaplayın.",
    category: "icra-finans",
    categoryLabel: "İcra & Finans",
    icon: "TrendingUp",
  },
  {
    slug: "vekalet-ucreti",
    title: "Vekalet Ücreti Hesaplama (AAÜT)",
    shortTitle: "Vekalet Ücreti",
    description:
      "2025 Avukatlık Asgari Ücret Tarifesi'ne göre dava değerinize karşılık gelen asgari vekalet ücretini ve KDV tutarını hesaplayın.",
    category: "icra-finans",
    categoryLabel: "İcra & Finans",
    icon: "Scale",
  },
  {
    slug: "islah-harci",
    title: "Islah Harcı Hesaplama",
    shortTitle: "Islah Harcı",
    description:
      "Dava sürecinde artırılan talep miktarı üzerinden ödenmesi gereken ek ıslah harcını 2025 yargı harç tarifesine göre hesaplayın.",
    category: "icra-finans",
    categoryLabel: "İcra & Finans",
    icon: "FileText",
  },

  // ── Tazminat ───────────────────────────────────────────────────────
  {
    slug: "trafik-tazminati",
    title: "Trafik Kazası Tazminat Hesaplama",
    shortTitle: "Trafik Tazminatı",
    description:
      "Yaralanmalı trafik kazalarında maluliyet oranı ve gelir kaybına dayalı tahmini iş göremezlik ve tedavi tazminatını hesaplayın.",
    category: "tazminat",
    categoryLabel: "Tazminat Hukuku",
    icon: "Car",
  },
  {
    slug: "arac-deger-kaybi",
    title: "Araç Değer Kaybı Hesaplama",
    shortTitle: "Araç Değer Kaybı",
    description:
      "Trafik kazası sonrası araç piyasa değeri, hasar ağırlığı ve araç yaşına göre tahmini değer kaybı tazminatını hesaplayın.",
    category: "tazminat",
    categoryLabel: "Tazminat Hukuku",
    icon: "Car",
  },

  // ── Ceza & Diğer ───────────────────────────────────────────────────
  {
    slug: "adli-para-cezasi",
    title: "Adli Para Cezası Hesaplama",
    shortTitle: "Adli Para Cezası",
    description:
      "TCK m.52 uyarınca gün para cezasının ekonomik duruma göre alt ve üst limitlerdeki parasal karşılığını hesaplayın.",
    category: "ceza-diger",
    categoryLabel: "Ceza & Diğer",
    icon: "Gavel",
  },
  {
    slug: "kira-artis",
    title: "Kira Artış Oranı Hesaplama",
    shortTitle: "Kira Artışı",
    description:
      "Konut kiranızın TBK m.344 çerçevesinde TÜFE 12 aylık ortalama değişim oranına göre azami artış tutarını hesaplayın.",
    category: "ceza-diger",
    categoryLabel: "Ceza & Diğer",
    icon: "Home",
  },
  {
    slug: "e-tebligat",
    title: "E-Tebligat Tebliğ Tarihi Hesaplama",
    shortTitle: "E-Tebligat Tarihi",
    description:
      "7201 sayılı Tebligat Kanunu'na göre elektronik tebligatın muhatabın okuma durumuna bağlı tebliğ tarihini hesaplayın.",
    category: "ceza-diger",
    categoryLabel: "Ceza & Diğer",
    icon: "Mail",
  },
];

export const CALCULATOR_MAP: Record<string, CalculatorMeta> = Object.fromEntries(
  CALCULATORS.map((c) => [c.slug, c])
);

export const CATEGORIES: { id: CalcCategory | "hepsi"; label: string }[] = [
  { id: "hepsi",       label: "Tümü" },
  { id: "is-hukuku",   label: "İş Hukuku" },
  { id: "aile-hukuku", label: "Aile Hukuku" },
  { id: "icra-finans", label: "İcra & Finans" },
  { id: "tazminat",    label: "Tazminat" },
  { id: "ceza-diger",  label: "Ceza & Diğer" },
];
