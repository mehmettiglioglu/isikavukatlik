export default function LegalServiceJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Işık Hukuk Bürosu",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://isikavukatlik.com",
    description:
      "Ceza, aile, ticaret, iş ve idare hukuku alanlarında avukatlık ve hukuki danışmanlık hizmetleri.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Örnek Mahallesi, Hukuk Caddesi No:1 Kat:3",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    telephone: "+90-212-123-45-67",
    email: "info@isikavukatlik.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hukuki Hizmetler",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ceza Hukuku" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aile Hukuku" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ticaret Hukuku" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "İş Hukuku" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "İdare Hukuku" } },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
