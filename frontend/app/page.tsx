import type { Metadata } from "next";
import { getArticles } from "@/lib/api";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import { STATIC_ARTICLES } from "@/lib/static-articles";
import HeroSection from "@/components/home/HeroSection";
import PracticeAreas from "@/components/home/PracticeAreas";
import LatestArticles from "@/components/home/LatestArticles";
import LegalServiceJsonLd from "@/components/seo/LegalServiceJsonLd";

export const metadata: Metadata = {
  title: "Işık Hukuk Bürosu | Hukuki Danışmanlık ve Avukatlık Hizmetleri",
  description:
    "Konya merkezli Işık Hukuk Bürosu; iş, kira, icra, aile ve ticaret hukuku başta olmak üzere 14 farklı hukuk alanında profesyonel avukatlık hizmeti sunmaktadır.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articlesData = await getArticles({ pageSize: 3 }).catch(() => null);
  const latestArticles = articlesData?.data?.length ? articlesData.data : STATIC_ARTICLES;

  return (
    <>
      <LegalServiceJsonLd />
      <HeroSection />
      <PracticeAreas areas={PRACTICE_AREAS} />
      <LatestArticles articles={latestArticles} />
    </>
  );
}
