export interface ChatNode {
  id: string;
  message: string;
  options?: { label: string; nextId: string }[];
  /** Terminal node — show contact action */
  action?: "contact" | "call" | "whatsapp";
  /** Related practice area slug for linking */
  areaSlug?: string;
  /** Informational cards shown on terminal nodes */
  info?: {
    /** Quick legal facts / rights */
    rights?: string[];
    /** Estimated process duration */
    duration?: string;
    /** Statute of limitations warning */
    deadline?: string;
    /** Documents to bring to consultation */
    documents?: string[];
    /** Typical process steps */
    process?: string[];
  };
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
    message: "İşten çıkarılma durumunda kıdem tazminatı, ihbar tazminatı ve diğer işçilik alacaklarınız için hukuki süreç başlatılabilir.",
    action: "contact",
    areaSlug: "is-hukuku",
    info: {
      rights: [
        "En az 1 yıl çalıştıysanız kıdem tazminatı hakkınız var",
        "İhbar süresi verilmeden çıkarıldıysanız ihbar tazminatı alabilirsiniz",
        "Kullanılmayan yıllık izinler ücret olarak ödenir",
        "Haksız fesih halinde işe iade davası açabilirsiniz (6 ay+ çalışma, 30+ işçi)",
      ],
      deadline: "İşe iade davası için fesih bildiriminden itibaren 1 ay süreniz var. Diğer işçilik alacaklarında zamanaşımı 5 yıldır.",
      duration: "Arabuluculuk: 1-4 hafta, dava süreci: 6-18 ay",
      documents: [
        "İş sözleşmesi",
        "Son 3 aylık maaş bordrosu",
        "Fesih / ihbar bildirimi",
        "SGK hizmet dökümü (e-Devlet'ten alınabilir)",
        "Banka hesap dökümü (maaş ödemeleri)",
      ],
      process: [
        "Zorunlu arabuluculuk başvurusu yapılır",
        "Arabuluculukta anlaşma sağlanamazsa dava açılır",
        "Mahkeme süreci ve karar",
        "Gerekirse istinaf/temyiz",
      ],
    },
  },
  "is-alacak": {
    id: "is-alacak",
    message: "Ödenmemiş maaş, fazla mesai ve yıllık izin ücreti yasal haklarınız arasındadır. Bunları hukuki yollarla tahsil edebilirsiniz.",
    action: "contact",
    areaSlug: "is-hukuku",
    info: {
      rights: [
        "Ödenmeyen ücretler için faiz talep edebilirsiniz",
        "Fazla mesai ücreti saatlik ücretin %50 fazlasıdır",
        "Ücretin 20 gün gecikmesi halinde iş bırakma hakkınız var",
        "Maaş ödenmemesi haklı fesih sebebidir (kıdem tazminatı hakkı doğar)",
      ],
      deadline: "İşçilik alacaklarında zamanaşımı süresi 5 yıldır.",
      duration: "Arabuluculuk: 1-4 hafta, dava süreci: 4-12 ay",
      documents: [
        "İş sözleşmesi",
        "Maaş bordroları",
        "Banka hesap dökümü",
        "Mesai kayıtları / puantaj (varsa)",
        "İşyeri yazışmaları / mesajlar",
      ],
      process: [
        "Zorunlu arabuluculuk başvurusu",
        "Arabuluculukta anlaşılamazsa dava açılır",
        "Bilirkişi incelemesi ile alacak hesaplanır",
        "Mahkeme kararı ve icra takibi",
      ],
    },
  },
  "is-kaza": {
    id: "is-kaza",
    message: "İş kazası durumunda hem tazminat hem de ceza hukuku kapsamında haklarınız mevcuttur. Süre çok önemli — mümkünse hemen arayın.",
    action: "call",
    areaSlug: "is-hukuku",
    info: {
      rights: [
        "İş kazası SGK'ya 3 gün içinde bildirilmelidir",
        "Geçici/kalıcı iş göremezlik ödeneği alabilirsiniz",
        "İşverenin kusuru varsa maddi ve manevi tazminat talep edebilirsiniz",
        "İş güvenliği önlemi almayan işveren cezai sorumluluk taşır",
      ],
      deadline: "İş kazasının SGK'ya bildirimi 3 iş günü içinde yapılmalıdır. Tazminat davası zamanaşımı 10 yıldır.",
      duration: "Maluliyet tespiti: 2-6 ay, dava süreci: 1-2 yıl",
      documents: [
        "Hastane raporu / epikriz",
        "İş kazası tutanağı",
        "SGK iş kazası bildirgesi",
        "Tanık bilgileri",
        "İşyeri güvenlik kayıtları (kamera vb.)",
        "Maaş bordrosu",
      ],
      process: [
        "SGK'ya iş kazası bildirimi",
        "Sağlık raporları ve maluliyet tespiti",
        "Arabuluculuk veya doğrudan dava",
        "Bilirkişi kusur ve tazminat hesabı",
        "Mahkeme kararı",
      ],
    },
  },
  "is-isveren": {
    id: "is-isveren",
    message: "İşveren olarak iş sözleşmesi hazırlama, fesih süreçleri ve mevzuata uyum konularında danışmanlık veriyoruz.",
    action: "contact",
    areaSlug: "is-hukuku",
    info: {
      rights: [
        "Doğru hazırlanmış iş sözleşmesi ileride çıkabilecek davaları önler",
        "Fesih prosedürüne uyulmazsa işe iade riski doğar",
        "İş güvenliği yükümlülüklerini yerine getirmezseniz cezai sorumluluk oluşur",
        "Arabuluculuk sürecinde hukuki destek almanız kritik önem taşır",
      ],
      documents: [
        "Mevcut iş sözleşmeleri",
        "İşyeri iç yönetmeliği (varsa)",
        "Personel özlük dosyaları",
        "SGK bildirgeleri",
      ],
      process: [
        "Mevcut durum analizi",
        "Sözleşme ve politika hazırlama/güncelleme",
        "Fesih danışmanlığı (gerekirse)",
        "Sürekli hukuki destek",
      ],
    },
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
    message: "Anlaşmalı veya çekişmeli boşanma davalarında haklarınızı en iyi şekilde koruyoruz.",
    action: "contact",
    areaSlug: "bosanma-aile-hukuku",
    info: {
      rights: [
        "Anlaşmalı boşanma için evliliğin en az 1 yıl sürmüş olması gerekir",
        "Çekişmeli boşanmada kusurlu eşten tazminat talep edilebilir",
        "Dava süresince tedbir nafakası istenebilir",
        "Ortak çocuklar için velayet ve kişisel ilişki düzenlenir",
      ],
      duration: "Anlaşmalı boşanma: 1-3 ay, çekişmeli boşanma: 1-3 yıl",
      documents: [
        "Nüfus kayıt örneği (e-Devlet)",
        "Evlilik cüzdanı fotokopisi",
        "Anlaşmalı ise protokol taslağı",
        "Ekonomik durumu gösteren belgeler (gelir, taşınmaz vb.)",
        "Varsa deliller (mesajlar, fotoğraflar)",
      ],
      process: [
        "Boşanma dilekçesi hazırlanır ve dava açılır",
        "Tensip duruşması (dosya inceleme)",
        "Ön inceleme ve tahkikat duruşmaları",
        "Karar ve kesinleşme",
        "Nüfus müdürlüğüne bildirim",
      ],
    },
  },
  "nafaka-velayet": {
    id: "nafaka-velayet",
    message: "Nafaka ve velayet davaları hassas konulardır. Durumunuza özel bir değerlendirme yapalım.",
    action: "contact",
    areaSlug: "bosanma-aile-hukuku",
    info: {
      rights: [
        "Tedbir nafakası dava süresince talep edilebilir",
        "Yoksulluk nafakası boşanma sonrası düzenli ödeme sağlar",
        "İştirak nafakası çocuk 18 yaşına kadar (eğitim devam ediyorsa daha uzun) ödenir",
        "Velayet kararı çocuğun üstün yararı gözetilerek verilir",
        "Nafaka miktarı ekonomik koşullara göre artırılıp azaltılabilir",
      ],
      duration: "Nafaka davası: 3-12 ay, velayet değişikliği: 6-18 ay",
      documents: [
        "Boşanma kararı (kesinleşmiş)",
        "Gelir belgeleri (her iki taraf)",
        "Çocuğun okul/sağlık kayıtları",
        "Mevcut nafaka kararı (varsa)",
        "Yaşam koşullarını gösteren belgeler",
      ],
      process: [
        "Dava dilekçesi hazırlanır",
        "Sosyal inceleme raporu (pedagog/psikolog)",
        "Duruşmalar ve delil incelemesi",
        "Çocuğun görüşü alınır (yaşına göre)",
        "Mahkeme kararı",
      ],
    },
  },
  "mal-paylasimi": {
    id: "mal-paylasimi",
    message: "Edinilmiş mallara katılma rejimi kapsamında haklarınızı belirleyip tasfiye sürecini yönetiyoruz.",
    action: "contact",
    areaSlug: "bosanma-aile-hukuku",
    info: {
      rights: [
        "2002 sonrası evliliklerde edinilmiş mallara katılma rejimi uygulanır",
        "Evlilik süresince edinilen mallar kural olarak eşit paylaşılır",
        "Kişisel mallar (miras, bağış) paylaşıma dahil değildir",
        "Aile konutu üzerinde özel koruma hükümleri vardır",
        "Mal kaçırma girişimlerine karşı ihtiyati tedbir alınabilir",
      ],
      deadline: "Mal rejimi tasfiye davası boşanma kararının kesinleşmesinden itibaren 10 yıl içinde açılmalıdır.",
      duration: "Dava süreci: 1-3 yıl (taşınmaz değerleme ve bilirkişi süreçleri)",
      documents: [
        "Boşanma kararı",
        "Tapu kayıtları",
        "Banka hesap dökümleri (evlilik süresince)",
        "Araç ruhsatları",
        "Şirket ortaklık belgeleri (varsa)",
        "Evlilik öncesi mal varlığı belgeleri",
      ],
    },
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
    message: "Kiracı haklarınızın korunması için hukuki süreç başlatabiliriz.",
    action: "contact",
    areaSlug: "kira-hukuku",
    info: {
      rights: [
        "Konut kiralarında yıllık artış oranı TÜFE ile sınırlıdır",
        "Ev sahibi sözleşme süresinde kiracıyı çıkaramaz (istisnalar hariç)",
        "Depozito en fazla 3 aylık kira bedeli olabilir",
        "Tahliye tehdidi alan kiracı itiraz hakkına sahiptir",
        "Kiralanan yerdeki zorunlu tamiratlar kiraya verene aittir",
      ],
      deadline: "İhtarname geldiyse süreler önemlidir — 30 gün içinde itiraz etmeniz gerekebilir.",
      documents: [
        "Kira sözleşmesi",
        "Kira ödeme dekontları",
        "İhtarname (geldiyse)",
        "Yazışmalar (mesaj, e-posta)",
        "Konutun fotoğrafları (hasar durumunda)",
      ],
    },
  },
  "kira-tahliye": {
    id: "kira-tahliye",
    message: "Tahliye davası açma şartları ve süreçleri hakkında size yol gösterelim.",
    action: "contact",
    areaSlug: "kira-hukuku",
    info: {
      rights: [
        "İki haklı ihtar ile tahliye davası açılabilir",
        "Kira bedelinin ödenmemesi halinde 30 gün süreli ihtar çekilir",
        "Kiraya verenin ihtiyacı halinde tahliye istenebilir (ihtiyaç nedeniyle tahliye)",
        "10 yılı dolan kira sözleşmelerinde kiraya veren fesih hakkına sahiptir",
        "Yeni malik de ihtiyaç sebebiyle tahliye isteyebilir",
      ],
      deadline: "İhtiyaç nedeniyle tahliye davasının süre ve ihtarname koşulları vardır — erken başvuru önemlidir.",
      duration: "İhtarname süreci: 30 gün, dava süreci: 6-18 ay",
      documents: [
        "Kira sözleşmesi",
        "Tapu belgesi",
        "Önceki ihtarnameler (varsa)",
        "Kira ödeme kayıtları",
        "İhtiyaç belgesi (kendi kullanımı için tahliye istiyorsanız)",
      ],
      process: [
        "Duruma göre ihtarname çekilir",
        "Süre beklenir (30 gün veya sözleşme bitimi)",
        "Tahliye davası açılır",
        "Duruşma ve karar",
        "Gerekirse icra yoluyla tahliye",
      ],
    },
  },
  "kira-sozlesme": {
    id: "kira-sozlesme",
    message: "Haklarınızı koruyan, güncel mevzuata uygun kira sözleşmesi hazırlıyoruz.",
    action: "contact",
    areaSlug: "kira-hukuku",
    info: {
      rights: [
        "İyi hazırlanmış bir sözleşme ileride çıkabilecek uyuşmazlıkları önler",
        "Kira artış oranı, depozito, tamirat sorumluluğu gibi konular netleştirilir",
        "Kiracı ve kiraya veren haklarının dengeli dağılımı sağlanır",
      ],
      documents: [
        "Tapu belgesi",
        "Kimlik fotokopileri (her iki taraf)",
        "Mevcut kira sözleşmesi (yenileme ise)",
      ],
    },
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
    message: "Alacak tahsili için icra takibi başlatma, itirazın iptali davası ve haciz işlemlerinde yanınızdayız.",
    action: "contact",
    areaSlug: "icra-iflas-hukuku",
    info: {
      rights: [
        "Senet, çek veya sözleşmeye dayalı alacaklar icra yoluyla takip edilebilir",
        "Borçlunun maaş, araç, taşınmaz gibi varlıklarına haciz konulabilir",
        "Borçlu itiraz ederse itirazın iptali davası açılabilir",
        "İcra inkâr tazminatı talep edebilirsiniz (%20)",
      ],
      deadline: "Kambiyo senetlerinde (çek/senet) zamanaşımı sürelerine dikkat edin — bono: 3 yıl, çek: 6 ay.",
      duration: "İcra takibi: 1-6 ay, itiraz davası: 6-12 ay",
      documents: [
        "Senet, çek veya sözleşme aslı",
        "Borçlunun kimlik/adres bilgileri",
        "Varsa yazışmalar ve ödeme kayıtları",
        "Fatura veya cari hesap dökümü",
      ],
      process: [
        "İcra takibi başlatılır (ödeme emri gönderilir)",
        "Borçlunun 7 gün itiraz süresi",
        "İtiraz yoksa haciz aşamasına geçilir",
        "İtiraz varsa dava açılır",
        "Haciz ve tahsilat",
      ],
    },
  },
  "icra-borclu": {
    id: "icra-borclu",
    message: "Hakkınızda başlatılan icra takibine itiraz hakkınız bulunmaktadır. Süre çok önemli.",
    action: "contact",
    areaSlug: "icra-iflas-hukuku",
    info: {
      rights: [
        "Ödeme emrine 7 gün içinde itiraz edebilirsiniz",
        "Borcun zamanaşımına uğradığını ileri sürebilirsiniz",
        "Menfi tespit davası açarak borçlu olmadığınızı kanıtlayabilirsiniz",
        "Haczedilemez mal ve haklar kanunla korunur (asgari geçim düzeyinde eşya, maaşın 3/4'ü vb.)",
        "Taksitle ödeme planı teklif edebilirsiniz",
      ],
      deadline: "Ödeme emrine itiraz süresi 7 gündür — bu süreyi kaçırmayın!",
      duration: "İtiraz: 7 gün, menfi tespit davası: 6-18 ay",
      documents: [
        "Ödeme emri örneği",
        "İlgili sözleşme/senet (varsa)",
        "Ödeme yaptıysanız dekont/makbuz",
        "İtiraz gerekçenizi destekleyen belgeler",
      ],
      process: [
        "Ödeme emri incelenir",
        "7 gün içinde itiraz dilekçesi verilir",
        "Gerekirse menfi tespit/istirdat davası",
        "Mahkeme kararı",
      ],
    },
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
    message: "Soruşturma ve kovuşturma aşamalarında etkin savunma hakkınızı kullanmanız çok önemlidir. Mümkünse hemen arayın.",
    action: "call",
    areaSlug: "ceza-hukuku",
    info: {
      rights: [
        "Gözaltında avukat talep etme hakkınız var — bu hakkınızı mutlaka kullanın",
        "Susma hakkınız anayasal güvence altındadır",
        "İfade vermeden önce avukatınızla görüşme hakkınız var",
        "Gözaltı süresi bireysel suçlarda 24 saati, toplu suçlarda 4 günü geçemez",
        "Tutuklama kararına itiraz edebilirsiniz",
      ],
      deadline: "Gözaltına alındıysanız derhal avukat talep edin. İfade vermeden önce hukuki destek almanız kritik önem taşır.",
      documents: [
        "Soruşturma/dava dosya numarası",
        "Tebligat/çağrı kağıdı",
        "Varsa delil niteliğindeki belgeler",
        "Tanık bilgileri",
      ],
      process: [
        "Soruşturma aşaması (savcılık)",
        "İfade/sorgu",
        "Kovuşturma aşaması (mahkeme)",
        "Duruşmalar ve savunma",
        "Karar ve gerekirse istinaf/temyiz",
      ],
    },
  },
  "ceza-magdur": {
    id: "ceza-magdur",
    message: "Suç mağduru olarak haklarınızı korumak için hukuki destek sağlıyoruz.",
    action: "contact",
    areaSlug: "ceza-hukuku",
    info: {
      rights: [
        "Şikâyet hakkınızı savcılık veya kolluk kuvvetlerine başvurarak kullanabilirsiniz",
        "Kamu davası yanında maddi/manevi tazminat da talep edebilirsiniz",
        "Koruma tedbiri (uzaklaştırma kararı vb.) talep edebilirsiniz",
        "Kovuşturmaya geçilmezse itiraz hakkınız var",
        "Bazı suçlarda uzlaştırma süreci uygulanır",
      ],
      deadline: "Şikâyete bağlı suçlarda şikâyet süresi 6 aydır (öğrenme tarihinden itibaren).",
      duration: "Soruşturma: 1-6 ay, kovuşturma: 6-24 ay",
      documents: [
        "Olay hakkında detaylı yazılı beyan",
        "Varsa deliller (mesaj, fotoğraf, kamera kaydı)",
        "Tanık bilgileri",
        "Sağlık raporu (fiziksel zarar varsa)",
      ],
      process: [
        "Savcılığa şikâyet dilekçesi verilir",
        "Soruşturma yürütülür",
        "İddianame hazırlanır (yeterli delil varsa)",
        "Kovuşturma ve duruşmalar",
        "Karar",
      ],
    },
  },

  // ── Gayrimenkul ──────────────────────────────────────────
  gayrimenkul: {
    id: "gayrimenkul",
    message: "Gayrimenkul hukuku geniş kapsamlı bir alandır. Tapu, imar ve mülkiyet konularında destek sağlıyoruz.",
    action: "contact",
    areaSlug: "gayrimenkul-hukuku",
    info: {
      rights: [
        "Tapu iptali ve tescil davaları ile mülkiyet hakları korunabilir",
        "Kat mülkiyeti uyuşmazlıklarında ortak alan hakları yasayla düzenlenmiştir",
        "Kamulaştırma bedelinin düşük belirlenmesi halinde bedel artırım davası açılabilir",
        "Ayıplı taşınmaz satışında tüketici hakları geçerlidir",
      ],
      duration: "Tapu davaları: 1-3 yıl, kamulaştırma: 6-18 ay",
      documents: [
        "Tapu senedi",
        "Gayrimenkul satış sözleşmesi",
        "Kadastro çapı / imar durumu",
        "Belediye yazışmaları (varsa)",
        "Ekspertiz/değerleme raporu (varsa)",
      ],
    },
  },

  // ── Ticaret Hukuku ───────────────────────────────────────
  "ticaret-hukuku": {
    id: "ticaret-hukuku",
    message: "Şirket kuruluşu, ortaklık, ticari uyuşmazlıklar ve kurumsal danışmanlık konularında hizmet veriyoruz.",
    action: "contact",
    areaSlug: "ticaret-hukuku",
    info: {
      rights: [
        "Şirket kuruluş türü seçimi (Ltd., A.Ş.) vergisel ve hukuki sonuçları etkiler",
        "Ortaklık sözleşmesi anlaşmazlıkları önlemenin en etkili yoludur",
        "Haksız rekabet halinde tazminat ve men davası açılabilir",
        "Ticari alacaklar için ticari faiz talep edebilirsiniz",
      ],
      documents: [
        "Ticaret sicil kaydı",
        "Şirket ana sözleşmesi",
        "Ortaklık sözleşmeleri",
        "Ticari sözleşmeler ve faturalar",
        "Ticaret sicil gazetesi örnekleri",
      ],
    },
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
    info: {
      rights: [
        "Haksız fiil, sözleşme ihlali veya tehlike sorumluluğuna dayanarak tazminat istenebilir",
        "Maddi tazminat: tedavi masrafı, kazanç kaybı, destekten yoksun kalma",
        "Manevi tazminat: acı, elem ve üzüntü karşılığı talep edilir",
        "Trafik kazalarında zorunlu sigorta (trafik + kasko) kapsamı araştırılmalıdır",
      ],
      deadline: "Haksız fiilden kaynaklanan tazminatta zamanaşımı: öğrenme tarihinden 2 yıl, her hâlde 10 yıl.",
      duration: "Dava süreci: 1-3 yıl",
      documents: [
        "Olay belgesi (kaza tutanağı, rapor vb.)",
        "Sağlık raporları ve tedavi faturaları",
        "Gelir belgesi / maaş bordrosu",
        "Sigorta poliçesi bilgileri",
        "Tanık bilgileri",
      ],
    },
  },
  sozlesme: {
    id: "sozlesme",
    message: "Sözleşme hazırlama, inceleme ve uyuşmazlık çözümü konularında profesyonel destek sağlıyoruz.",
    action: "contact",
    areaSlug: "sozlesme-hukuku",
    info: {
      rights: [
        "Sözleşme serbestisi ilkesi gereği taraflar koşulları belirleyebilir (kanun sınırları dahilinde)",
        "Sözleşme ihlalinde aynen ifa veya tazminat talep edilebilir",
        "Aşırı yararlanma (gabin) halinde sözleşme iptal edilebilir",
        "İrade sakatlığı (hata, hile, korkutma) durumunda sözleşme geçersiz sayılabilir",
      ],
      documents: [
        "Mevcut sözleşme taslağı veya imzalı sözleşme",
        "İlgili yazışmalar",
        "Karşı taraf bilgileri",
        "Ödeme kayıtları (uyuşmazlık varsa)",
      ],
    },
  },
  miras: {
    id: "miras",
    message: "Miras paylaşımı, vasiyetname ve miras uyuşmazlıklarında hukuki danışmanlık veriyoruz.",
    action: "contact",
    areaSlug: "miras-hukuku",
    info: {
      rights: [
        "Saklı paylı mirasçıların (eş, çocuk, anne-baba) hakları kanunla korunur",
        "Saklı paya tecavüz eden tasarruflar için tenkis davası açılabilir",
        "Mirastan mal kaçırma durumunda muris muvazaası davası açılabilir",
        "Mirasın reddi, ölümden itibaren 3 ay içinde yapılmalıdır",
        "Vasiyetname düzenlenmesi ile mirasçılar arasında adil paylaşım sağlanabilir",
      ],
      deadline: "Mirasın reddi süresi: 3 ay. Tenkis davası: öğrenme tarihinden 1 yıl, her hâlde 10 yıl.",
      duration: "Miras davaları: 1-3 yıl",
      documents: [
        "Veraset ilamı (mirasçılık belgesi)",
        "Ölüm belgesi",
        "Vasiyetname (varsa)",
        "Tapu kayıtları ve banka hesap bilgileri",
        "Nüfus kayıt örneği",
      ],
    },
  },
  tuketici: {
    id: "tuketici",
    message: "Tüketici hakları ihlalleri ve ayıplı mal/hizmet konularında hukuki destek sağlıyoruz.",
    action: "contact",
    areaSlug: "tuketici-hukuku",
    info: {
      rights: [
        "Ayıplı mal için onarım, değişim, iade veya bedel indirimi talep edebilirsiniz",
        "Cayma hakkı: mesafeli satışlarda 14 gün içinde sebepsiz iade yapabilirsiniz",
        "Tüketici hakem heyetine ücretsiz başvurabilirsiniz (belirli tutara kadar zorunlu)",
        "Garanti süresi içinde ücretsiz onarım hakkınız var",
        "Haksız şartlar içeren sözleşme maddeleri geçersiz sayılabilir",
      ],
      deadline: "Ayıp bildirimi: makul süre içinde. Tüketici davası zamanaşımı: genel olarak 2 yıl.",
      documents: [
        "Fatura / fiş",
        "Garanti belgesi",
        "Ürün/hizmet sözleşmesi",
        "Arıza/şikâyet kayıtları",
        "Yazışmalar (firma ile)",
      ],
    },
  },
  idare: {
    id: "idare",
    message: "İdari işlemlere itiraz, iptal davaları ve kamu kurumlarıyla uyuşmazlıklarda yanınızdayız.",
    action: "contact",
    areaSlug: "idare-hukuku",
    info: {
      rights: [
        "Hukuka aykırı idari işlemler için iptal davası açılabilir",
        "İdari işlem nedeniyle oluşan zarar için tam yargı davası açılabilir",
        "Yürütmenin durdurulması talep edilerek işlem durdurulabilir",
        "İdari başvuru yolları tüketildikten sonra dava hakkı doğar",
      ],
      deadline: "İdari dava açma süresi: tebliğ tarihinden itibaren genellikle 60 gün. Vergi davalarında 30 gün.",
      duration: "İdare mahkemesi: 6-18 ay",
      documents: [
        "İdari işlem belgesi (karar, tebligat)",
        "İtiraz/başvuru dilekçesi ve cevapları",
        "İlgili kurum yazışmaları",
        "Zararı gösteren belgeler",
      ],
    },
  },
  saglik: {
    id: "saglik",
    message: "Tıbbi hata ve malpraktis davalarında hem hasta hem de sağlık profesyonellerinin haklarını savunuyoruz.",
    action: "contact",
    areaSlug: "saglik-hukuku",
    info: {
      rights: [
        "Tıbbi hata (malpraktis) durumunda maddi ve manevi tazminat hakkınız var",
        "Aydınlatılmış onam alınmadan yapılan müdahale hukuka aykırıdır",
        "Kamu hastanesi ise idare mahkemesinde, özel hastane ise tüketici mahkemesinde dava açılır",
        "Hekim kusuru Adli Tıp Kurumu veya üniversite bilirkişi raporuyla belirlenir",
      ],
      deadline: "Tazminat davası zamanaşımı: öğrenme tarihinden 5 yıl, her hâlde 20 yıl.",
      duration: "Bilirkişi raporu: 3-6 ay, dava süreci: 1-3 yıl",
      documents: [
        "Hastane kayıtları ve epikriz raporları",
        "Tıbbi görüntüleme (MR, röntgen vb.)",
        "Reçeteler ve tedavi faturaları",
        "Onam formları",
        "Tanık bilgileri",
      ],
    },
  },
  yabancilar: {
    id: "yabancilar",
    message: "Oturma izni, vatandaşlık başvuruları ve yabancı uyruklu bireylere yönelik hukuki hizmetler sunuyoruz.",
    action: "contact",
    areaSlug: "yabancılar-hukuku",
    info: {
      rights: [
        "Kısa dönem, uzun dönem, aile, öğrenci ve çalışma izni türleri mevcuttur",
        "Türk vatandaşı ile evli yabancılar kolaylaştırılmış vatandaşlık başvurusu yapabilir (3 yıl)",
        "Genel vatandaşlık başvurusu için 5 yıl kesintisiz ikamet gerekir",
        "Oturma izni reddi veya deport kararına itiraz hakkınız var",
        "Çalışma izni işveren aracılığıyla başvurulur",
      ],
      deadline: "Oturma izni uzatma başvurusu süre dolmadan yapılmalıdır. Deport kararına itiraz süresi 7 gündür.",
      documents: [
        "Pasaport (geçerli)",
        "Biyometrik fotoğraf",
        "Adres belgesi",
        "Sağlık sigortası",
        "Gelir belgesi / banka dökümü",
        "Evlilik cüzdanı (aile izni için)",
      ],
    },
  },

  // ── Randevu ──────────────────────────────────────────────
  appointment: {
    id: "appointment",
    message: "Randevu almak için bizi arayabilir veya mesaj bırakabilirsiniz. İlk görüşmede durumunuza özel bir değerlendirme yapılır.",
    action: "contact",
    info: {
      process: [
        "Telefon veya mesaj yoluyla randevu talebi",
        "Uygun gün ve saat belirlenir",
        "İlk görüşmede durumunuz dinlenir ve hukuki yol haritası çizilir",
        "Anlaşma sağlanırsa vekaletname ile süreç başlar",
      ],
      documents: [
        "Konuyla ilgili tüm belgeler",
        "Kimlik fotokopisi",
        "Varsa daha önce alınan hukuki görüşler",
      ],
    },
  },

  // ── Devam eden dava ──────────────────────────────────────
  "ongoing-case": {
    id: "ongoing-case",
    message: "Devam eden davanız hakkında detaylı bilgi almak için doğrudan avukatınızla iletişime geçin. Gizlilik nedeniyle dava bilgileri yalnızca birebir görüşmede paylaşılabilir.",
    action: "call",
    info: {
      rights: [
        "Dava dosyanızı e-Devlet UYAP üzerinden takip edebilirsiniz",
        "Avukatınızdan her aşamada bilgi alma hakkınız var",
        "Duruşma tarihlerini UYAP Vatandaş Portal'dan görebilirsiniz",
      ],
    },
  },

  // ── Ücret bilgisi ────────────────────────────────────────
  pricing: {
    id: "pricing",
    message: "Avukatlık ücretleri davanın türüne ve kapsamına göre belirlenir. İlk görüşmede durumunuza özel bilgilendirme yapılır.",
    action: "contact",
    info: {
      rights: [
        "Avukatlık Asgari Ücret Tarifesi (AAÜT) altında ücret belirlenemez",
        "Ücret sözleşmesi yazılı olarak yapılır",
        "Dava masrafları (harç, bilirkişi, tebligat) ayrıca hesaplanır",
        "Kazanılan davada karşı taraf vekâlet ücreti ödemeye mahkûm edilir",
        "Adli yardım kapsamında ücretsiz avukatlık hizmeti alınabilir (gelir durumuna göre)",
      ],
      process: [
        "İlk görüşmede konu ve kapsam belirlenir",
        "Yazılı ücret sözleşmesi hazırlanır",
        "Vekaletname düzenlenir",
        "Hukuki süreç başlatılır",
      ],
    },
  },
};
