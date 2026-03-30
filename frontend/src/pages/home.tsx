import { useEffect, useState } from "react";
import { getArticles } from "@/lib/api";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import { STATIC_ARTICLES } from "@/lib/static-articles";
import type { ArticleListItem } from "@/lib/types";
import HeroSection from "@/components/home/HeroSection";
import PracticeAreas from "@/components/home/PracticeAreas";
import LatestArticles from "@/components/home/LatestArticles";
import LegalServiceJsonLd from "@/components/seo/LegalServiceJsonLd";
import PageHead from "@/components/seo/PageHead";

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleListItem[]>(STATIC_ARTICLES);

  useEffect(() => {
    getArticles({ pageSize: 3 })
      .then((data) => {
        if (data.data?.length) setArticles(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHead
        title="Işık Hukuk Bürosu | Hukuki Danışmanlık ve Avukatlık Hizmetleri"
        description="Konya merkezli Işık Hukuk Bürosu; iş, kira, icra, aile ve ticaret hukuku başta olmak üzere 14 farklı hukuk alanında profesyonel avukatlık hizmeti sunmaktadır."
        canonical="/"
      />
      <LegalServiceJsonLd />
      <HeroSection />
      <PracticeAreas areas={PRACTICE_AREAS} />
      <LatestArticles articles={articles} />
    </>
  );
}
