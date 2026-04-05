export interface ChatNode {
  id: string;
  message: string;
  options?: { label: string; nextId: string }[];
  /** Terminal node — show contact action */
  action?: "contact" | "call" | "whatsapp";
  /** Related practice area slug for linking */
  areaSlug?: string;
}

export const CHATBOT_TREE: Record<string, ChatNode> = {
  root: {
    id: "root",
    message: "Merhaba! Ben Işık Asistan. Size nasıl yardımcı olabilirim?",
    options: [
      { label: "Hukuki danışmanlık almak istiyorum", nextId: "area-select" },
      { label: "Randevu almak istiyorum", nextId: "appointment" },
      { label: "Devam eden davam hakkında bilgi almak istiyorum", nextId: "ongoing-case" },
      { label: "Ücret ve masraflar hakkında bilgi almak istiyorum", nextId: "pricing" },
    ],
  },

  // ── Alan seçimi ──────────────────────────────────────────
  "area-select": {
    id: "area-select",
    message: "Hangi hukuk alanıyla ilgili danışmanlık almak istiyorsunuz?",
    options: [
      { label: "İş Hukuku / İşçi Davaları", nextId: "is-hukuku" },
      { label: "Boşanma / Aile Hukuku", nextId: "bosanma-aile" },
      { label: "Kira Hukuku", nextId: "kira-hukuku" },
      { label: "İcra ve İflas Hukuku", nextId: "icra-iflas" },
      { label: "Ceza Hukuku", nextId: "ceza-hukuku" },
      { label: "Gayrimenkul Hukuku", nextId: "gayrimenkul" },
      { label: "Ticaret / Şirket Hukuku", nextId: "ticaret-hukuku" },
      { label: "Diğer alanlar", nextId: "diger-alanlar" },
    ],
  },

  // ── İş Hukuku ────────────────────────────────────────────
  "is-hukuku": {
    id: "is-hukuku",
    message: "İş hukuku alanında hangi konuda desteğe ihtiyacınız var?",
    areaSlug: "is-hukuku",
    options: [
      { label: "İşten çıkarıldım / tazminat almak istiyorum", nextId: "is-tazminat" },
      { label: "Maaşım / fazla mesai ödenmedi", nextId: "is-alacak" },
      { label: "İş kazası geçirdim", nextId: "is-kaza" },
      { label: "İşveren olarak danışmanlık istiyorum", nextId: "is-isveren" },
    ],
  },
  "is-tazminat": {
    id: "is-tazminat",
    message:
      "İşten çıkarılma ve tazminat konusunda size yardımcı olabiliriz. Kıdem tazminatı, ihbar tazminatı ve diğer işçilik alacaklarınız için hukuki süreç başlatılabilir. Sizinle detaylı görüşmek isteriz.",
    action: "contact",
    areaSlug: "is-hukuku",
  },
  "is-alacak": {
    id: "is-alacak",
    message:
      "Ödenmemiş maaş, fazla mesai ve yıllık izin alacakları yasal haklarınız arasındadır. Bu alacaklarınızı hukuki yollarla tahsil edebiliriz.",
    action: "contact",
    areaSlug: "is-hukuku",
  },
  "is-kaza": {
    id: "is-kaza",
    message:
      "İş kazası durumunda hem tazminat hem de ceza hukuku kapsamında haklarınız mevcuttur. Acil durumlarda hızlı süreç başlatıyoruz.",
    action: "call",
    areaSlug: "is-hukuku",
  },
  "is-isveren": {
    id: "is-isveren",
    message:
      "İşveren olarak iş sözleşmesi hazırlama, fesih süreçleri ve mevzuata uyum konularında danışmanlık veriyoruz.",
    action: "contact",
    areaSlug: "is-hukuku",
  },

  // ── Boşanma / Aile ──────────────────────────────────────
  "bosanma-aile": {
    id: "bosanma-aile",
    message: "Aile hukuku alanında hangi konuda desteğe ihtiyacınız var?",
    areaSlug: "bosanma-aile-hukuku",
    options: [
      { label: "Boşanma davası açmak istiyorum", nextId: "bosanma-dava" },
      { label: "Nafaka / velayet konusu", nextId: "nafaka-velayet" },
      { label: "Mal paylaşımı", nextId: "mal-paylasimi" },
    ],
  },
  "bosanma-dava": {
    id: "bosanma-dava",
    message:
      "Anlaşmalı veya çekişmeli boşanma davalarında haklarınızı en iyi şekilde koruyoruz. Süreç hakkında detaylı bilgi için görüşme ayarlayalım.",
    action: "contact",
    areaSlug: "bosanma-aile-hukuku",
  },
  "nafaka-velayet": {
    id: "nafaka-velayet",
    message:
      "Nafaka belirleme, artırma/azaltma ve velayet davaları hassas konulardır. Durumunuza özel bir değerlendirme yapalım.",
    action: "contact",
    areaSlug: "bosanma-aile-hukuku",
  },
  "mal-paylasimi": {
    id: "mal-paylasimi",
    message:
      "Edinilmiş mallara katılma rejimi kapsamında haklarınızı belirleyip tasfiye sürecini yönetiyoruz.",
    action: "contact",
    areaSlug: "bosanma-aile-hukuku",
  },

  // ── Kira Hukuku ──────────────────────────────────────────
  "kira-hukuku": {
    id: "kira-hukuku",
    message: "Kira hukuku konusunda nasıl bir sorun yaşıyorsunuz?",
    areaSlug: "kira-hukuku",
    options: [
      { label: "Kiracı olarak haklarım ihlal edildi", nextId: "kira-kiraci" },
      { label: "Kiracımı tahliye ettirmek istiyorum", nextId: "kira-tahliye" },
      { label: "Kira sözleşmesi hazırlamak istiyorum", nextId: "kira-sozlesme" },
    ],
  },
  "kira-kiraci": {
    id: "kira-kiraci",
    message:
      "Kiracı haklarınızın korunması için hukuki süreç başlatabiliriz. Haksız tahliye, depozito iadesi ve kira artış sınırlamaları konularında yanınızdayız.",
    action: "contact",
    areaSlug: "kira-hukuku",
  },
  "kira-tahliye": {
    id: "kira-tahliye",
    message:
      "Tahliye davası açma şartları ve süreçleri hakkında size yol gösterelim. İhtarname hazırlama dahil tüm süreçte hizmet veriyoruz.",
    action: "contact",
    areaSlug: "kira-hukuku",
  },
  "kira-sozlesme": {
    id: "kira-sozlesme",
    message:
      "Haklarınızı koruyan, güncel mevzuata uygun kira sözleşmesi hazırlıyoruz.",
    action: "contact",
    areaSlug: "kira-hukuku",
  },

  // ── İcra İflas ───────────────────────────────────────────
  "icra-iflas": {
    id: "icra-iflas",
    message: "İcra ve iflas hukuku kapsamında durumunuz nedir?",
    areaSlug: "icra-iflas-hukuku",
    options: [
      { label: "Alacağımı tahsil etmek istiyorum", nextId: "icra-alacak" },
      { label: "Hakkımda icra takibi başlatılmış", nextId: "icra-borclu" },
    ],
  },
  "icra-alacak": {
    id: "icra-alacak",
    message:
      "Alacak tahsili için icra takibi başlatma, itirazın iptali davası ve haciz işlemlerinde deneyimli ekibimizle yanınızdayız.",
    action: "contact",
    areaSlug: "icra-iflas-hukuku",
  },
  "icra-borclu": {
    id: "icra-borclu",
    message:
      "İcra takibine itiraz, menfi tespit davası ve borca itiraz süreçlerinde haklarınızı koruyoruz.",
    action: "contact",
    areaSlug: "icra-iflas-hukuku",
  },

  // ── Ceza Hukuku ──────────────────────────────────────────
  "ceza-hukuku": {
    id: "ceza-hukuku",
    message: "Ceza hukuku kapsamında durumunuz nedir?",
    areaSlug: "ceza-hukuku",
    options: [
      { label: "Şüpheli / sanık olarak savunma istiyorum", nextId: "ceza-savunma" },
      { label: "Mağdurum, şikayetçi olmak istiyorum", nextId: "ceza-magdur" },
    ],
  },
  "ceza-savunma": {
    id: "ceza-savunma",
    message:
      "Soruşturma ve kovuşturma aşamalarında etkin savunma hakkınızı kullanmanız çok önemlidir. Acil durumlarda hemen arayın.",
    action: "call",
    areaSlug: "ceza-hukuku",
  },
  "ceza-magdur": {
    id: "ceza-magdur",
    message:
      "Suç mağduru olarak şikayette bulunma, tazminat talep etme ve dava sürecinde haklarınızı koruma konusunda size yardımcı olabiliriz.",
    action: "contact",
    areaSlug: "ceza-hukuku",
  },

  // ── Gayrimenkul ──────────────────────────────────────────
  gayrimenkul: {
    id: "gayrimenkul",
    message:
      "Gayrimenkul alım-satım, tapu işlemleri, kat mülkiyeti uyuşmazlıkları ve imar konularında hukuki destek sağlıyoruz.",
    action: "contact",
    areaSlug: "gayrimenkul-hukuku",
  },

  // ── Ticaret Hukuku ───────────────────────────────────────
  "ticaret-hukuku": {
    id: "ticaret-hukuku",
    message:
      "Şirket kuruluşu, ortaklık sözleşmeleri, ticari uyuşmazlıklar ve şirket danışmanlığı konularında hizmet veriyoruz.",
    action: "contact",
    areaSlug: "ticaret-hukuku",
  },

  // ── Diğer alanlar ────────────────────────────────────────
  "diger-alanlar": {
    id: "diger-alanlar",
    message: "Hangi konuda desteğe ihtiyacınız var?",
    options: [
      { label: "Tazminat Hukuku", nextId: "tazminat" },
      { label: "Sözleşme Hukuku", nextId: "sozlesme" },
      { label: "Miras Hukuku", nextId: "miras" },
      { label: "Tüketici Hukuku", nextId: "tuketici" },
      { label: "İdare Hukuku", nextId: "idare" },
      { label: "Sağlık Hukuku / Malpraktis", nextId: "saglik" },
      { label: "Yabancılar Hukuku", nextId: "yabancilar" },
    ],
  },
  tazminat: {
    id: "tazminat",
    message: "Maddi ve manevi tazminat taleplerinde hak sahiplerinin etkin temsili için buradayız.",
    action: "contact",
    areaSlug: "tazminat-hukuku",
  },
  sozlesme: {
    id: "sozlesme",
    message: "Sözleşme hazırlama, inceleme ve uyuşmazlık çözümü konularında profesyonel destek sağlıyoruz.",
    action: "contact",
    areaSlug: "sozlesme-hukuku",
  },
  miras: {
    id: "miras",
    message: "Miras paylaşımı, vasiyetname ve miras uyuşmazlıklarında hukuki danışmanlık veriyoruz.",
    action: "contact",
    areaSlug: "miras-hukuku",
  },
  tuketici: {
    id: "tuketici",
    message: "Tüketici hakları ihlalleri ve ayıplı mal/hizmet konularında hukuki destek sağlıyoruz.",
    action: "contact",
    areaSlug: "tuketici-hukuku",
  },
  idare: {
    id: "idare",
    message: "İdari işlemlere itiraz, iptal davaları ve kamu kurumlarıyla uyuşmazlıklarda yanınızdayız.",
    action: "contact",
    areaSlug: "idare-hukuku",
  },
  saglik: {
    id: "saglik",
    message: "Tıbbi hata ve malpraktis davalarında hem hasta hem de sağlık profesyonellerinin haklarını savunuyoruz.",
    action: "contact",
    areaSlug: "saglik-hukuku",
  },
  yabancilar: {
    id: "yabancilar",
    message: "Oturma izni, vatandaşlık başvuruları ve yabancı uyruklu bireylere yönelik hukuki hizmetler sunuyoruz.",
    action: "contact",
    areaSlug: "yabancılar-hukuku",
  },

  // ── Randevu ──────────────────────────────────────────────
  appointment: {
    id: "appointment",
    message: "Randevu almak için en hızlı yol telefonla aramaktır. Alternatif olarak iletişim formunu doldurabilirsiniz.",
    action: "contact",
  },

  // ── Devam eden dava ──────────────────────────────────────
  "ongoing-case": {
    id: "ongoing-case",
    message:
      "Devam eden davanız hakkında detaylı bilgi almak için lütfen doğrudan avukatınızla iletişime geçin. Gizlilik nedeniyle dava bilgileri yalnızca birebir görüşmede paylaşılabilir.",
    action: "call",
  },

  // ── Ücret bilgisi ────────────────────────────────────────
  pricing: {
    id: "pricing",
    message: "Ücretlerimiz davanın türüne ve kapsamına göre değişmektedir. İlk görüşmede durumunuza özel bilgilendirme yapılır. Ön görüşme için bize ulaşın.",
    action: "contact",
  },
};
