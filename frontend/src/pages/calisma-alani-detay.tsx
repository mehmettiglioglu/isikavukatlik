import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import { getArticles } from "@/lib/api";
import type { ArticleListItem } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";
import PracticeAreaIcon from "@/components/ui/PracticeAreaIcon";
import PageHead from "@/components/seo/PageHead";
import NotFound from "./not-found";

export default function CalismaAlaniDetayPage() {
  const { slug } = useParams<{ slug: string }>();
  const area = PRACTICE_AREAS.find((a) => a.slug === slug);
  const [articles, setArticles] = useState<ArticleListItem[]>([]);

  useEffect(() => {
    if (!slug) return;
    getArticles({ categorySlug: slug, pageSize: 6 })
      .then((data) => setArticles(data.data ?? []))
      .catch(() => {});
  }, [slug]);

  if (!area) return <NotFound />;

  return (
    <main>
      <PageHead title={area.title} description={area.description} canonical={`/calisma-alanlari/${slug}`} />
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-5xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><ChevronRight size={12} /></li>
              <li><Link to="/calisma-alanlari" className="hover:text-white transition-colors">Çalışma Alanları</Link></li>
              <li><ChevronRight size={12} /></li>
              <li aria-current="page" className="text-gold">{area.title}</li>
            </ol>
          </nav>
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/15 bg-white/8">
              <PracticeAreaIcon name={area.icon} size={24} className="text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-light text-white">{area.title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300">{area.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-64 overflow-hidden">
        <img src="/justice4.jpg" alt={area.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-linear-to-b from-navy/60 to-transparent" />
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          {articles.length > 0 ? (
            <>
              <h2 className="mb-10 font-serif text-2xl font-light text-navy">Bu Alandaki Yazılar</h2>
              <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {articles.map((article) => (
                  <li key={article.id}><ArticleCard article={article} /></li>
                ))}
              </ul>
            </>
          ) : (
            <div className="rounded-none border border-gray-100 bg-surface px-8 py-12 text-center">
              <p className="text-gray-500">Bu alana ait henüz yayınlanmış makale bulunmamaktadır.</p>
              <Link to="/blog" className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
                Tüm yazılara git <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
