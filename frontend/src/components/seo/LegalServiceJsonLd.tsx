const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://isikavukatlik.tr";

export default function LegalServiceJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${SITE_URL}/#organization`,
    name: "Işık Hukuk Bürosu",
    alternateName: "Işık Avukatlık & Danışmanlık",
    url: SITE_URL,
    logo: `${SITE_URL}/pnglogoısık.png`,
    image: `${SITE_URL}/justice2.jpg`,
    description:
      "Konya'da iş hukuku, aile hukuku, ceza hukuku, ticaret hukuku, icra ve iflas hukuku başta olmak üzere 14 farklı alanda uzman avukatlık ve hukuki danışmanlık hizmetleri sunan Işık Hukuk Bürosu.",
    telephone: "+90-505-400-53-80",
    email: "info@isikavukatlik.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Konya",
      addressRegion: "Konya",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.876,
      longitude: 32.4812,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:30",
        closes: "17:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Konya" },
      { "@type": "Country", name: "Türkiye" },
    ],
    priceRange: "₺₺",
    knowsLanguage: ["tr", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Konya Avukatlık Hizmetleri",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya İş Hukuku Avukatı", description: "İşçi-işveren uyuşmazlıkları, kıdem ve ihbar tazminatı, işe iade davaları" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Boşanma Avukatı", description: "Anlaşmalı ve çekişmeli boşanma, nafaka, velayet davaları" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Ceza Avukatı", description: "Ceza davaları, tutukluluk, savcılık soruşturmaları" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Ticaret Hukuku Avukatı", description: "Şirket davaları, ticari uyuşmazlıklar" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya İcra Avukatı", description: "Alacak takibi, icra ve iflas süreçleri" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Kira Hukuku Avukatı", description: "Kira sözleşmeleri, tahliye davaları" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Gayrimenkul Avukatı", description: "Tapu işlemleri, gayrimenkul uyuşmazlıkları" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Miras Avukatı", description: "Miras paylaşımı, vasiyetname, tenkis davaları" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Tazminat Avukatı", description: "Maddi ve manevi tazminat, iş kazası tazminatı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Konya Tüketici Avukatı", description: "Tüketici hakları, ayıplı mal davaları" } },
      ],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
