import { useEffect, useState } from "react";
import { getArticles } from "@/lib/api";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import { STATIC_ARTICLES } from "@/lib/static-articles";
import type { ArticleListItem } from "@/lib/types";
import HeroSection from "@/components/home/HeroSection";
import PracticeAreas from "@/components/home/PracticeAreas";
import LatestArticles from "@/components/home/LatestArticles";
import ContactSection from "@/components/home/ContactSection";
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
        title="Konya Avukat | Işık Hukuk Bürosu | Avukatlık & Danışmanlık"
        description="Konya avukat arıyorsanız doğru adrestesiniz. Işık Hukuk Bürosu; iş hukuku, boşanma, ceza, icra, ticaret ve gayrimenkul hukuku başta olmak üzere 14 alanda Konya'da profesyonel avukatlık hizmeti sunar."
        canonical="/"
      />
      <LegalServiceJsonLd />
      <HeroSection />
      <PracticeAreas areas={PRACTICE_AREAS} />
      <ContactSection />
      <LatestArticles articles={articles} />
    </>
  );
}
