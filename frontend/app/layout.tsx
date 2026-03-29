import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Işık Hukuk Bürosu";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://isikavukatlik.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Hukuki Danışmanlık ve Avukatlık Hizmetleri`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Ceza, aile, ticaret ve iş hukuku alanlarında profesyonel avukatlık ve hukuki danışmanlık hizmetleri.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <PageLoader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
