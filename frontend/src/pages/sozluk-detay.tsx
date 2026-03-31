import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, BookOpen, Calendar, Tag } from "lucide-react";
import { getLegalTermBySlug } from "@/lib/api";
import type { LegalTermDetail } from "@/lib/types";
import PageHead from "@/components/seo/PageHead";
import NotFound from "./not-found";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://isikavukatlik.com";

export default function SozlukDetayPage() {
  const { slug } = useParams<{ slug: string }>();
  const [term, setTerm] = useState<LegalTermDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getLegalTermBySlug(slug)
      .then(setTerm)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
      </div>
    );
  }

  if (notFound || !term) return <NotFound />;

  const updatedDate = new Date(term.updatedAt).toLocaleDateString("tr-TR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.title,
    description: term.shortDescription ?? term.definition.slice(0, 160),
    url: `${SITE_URL}/sozluk/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Hukuki Terimler Sözlüğü",
      url: `${SITE_URL}/sozluk`,
    },
    termCode: term.letter,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${term.title} nedir?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: term.definition,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Hukuki Sözlük", item: `${SITE_URL}/sozluk` },
      { "@type": "ListItem", position: 3, name: term.title, item: `${SITE_URL}/sozluk/${term.slug}` },
    ],
  };

  return (
    <main>
      <PageHead
        title={`${term.title} Nedir? | Hukuki Terimler Sözlüğü`}
        description={term.shortDescription ?? term.definition.slice(0, 155)}
        canonical={`/sozluk/${term.slug}`}
        og={{ type: "article" }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-navy via-navy/95 to-[#162442]" />
          <div aria-hidden="true" className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-gold/10" />
          <div aria-hidden="true" className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full border border-gold/8" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><ChevronRight size={12} /></li>
              <li><Link to="/sozluk" className="hover:text-white transition-colors">Hukuki Sözlük</Link></li>
              <li><ChevronRight size={12} /></li>
              <li aria-current="page" className="text-gold">{term.title}</li>
            </ol>
          </nav>

          {/* Kategori + harf */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="border border-gold/50 px-3 py-1 text-xs text-gold">{term.category}</span>
            <span className="flex h-6 w-6 items-center justify-center bg-gold/15 font-serif text-sm text-gold">{term.letter}</span>
          </div>

          <h1 className="font-serif text-4xl font-light leading-snug text-white md:text-5xl">
            {term.title} Nedir?
          </h1>
          {term.shortDescription && (
            <p className="mt-5 text-base leading-relaxed text-gray-300">{term.shortDescription}</p>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={11} />
            <time dateTime={term.updatedAt}>Son güncelleme: {updatedDate}</time>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
          {/* Ana içerik */}
          <article>
            <h2 className="mb-4 font-serif text-2xl font-light text-navy">Tanım ve Açıklama</h2>
            <div className="prose prose-gray max-w-none prose-p:leading-relaxed prose-p:text-gray-700 prose-headings:font-serif prose-headings:font-light prose-headings:text-navy">
              <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">{term.definition}</p>
            </div>

            {/* İlgili makaleler */}
            {term.relatedArticles.length > 0 && (
              <section className="mt-12" aria-labelledby="ilgili-makaleler">
                <h2 id="ilgili-makaleler" className="mb-6 font-serif text-2xl font-light text-navy">
                  İlgili Hukuki Yazılar
                </h2>
                <ul className="space-y-4" role="list">
                  {term.relatedArticles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        to={`/blog/${article.slug}`}
                        className="group flex items-start gap-4 border border-gray-100 bg-white px-5 py-4 transition-all hover:border-gold/40 hover:shadow-sm"
                      >
                        <BookOpen size={16} className="mt-0.5 shrink-0 text-gold" />
                        <div className="min-w-0">
                          <p className="font-medium text-navy group-hover:text-gold transition-colors line-clamp-2">
                            {article.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Tag size={10} />{article.categoryName}
                            </span>
                            {article.publishedAt && (
                              <time dateTime={article.publishedAt}>
                                {new Date(article.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                              </time>
                            )}
                          </div>
                          {article.summary && (
                            <p className="mt-1.5 line-clamp-2 text-xs text-gray-400">{article.summary}</p>
                          )}
                        </div>
                        <ChevronRight size={14} className="mt-1 shrink-0 text-gray-300 group-hover:text-gold transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <footer className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
              <Link to="/sozluk" className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
                <ArrowLeft size={14} /> Sözlüğe Dön
              </Link>
              <Link to="/iletisim" className="border border-navy px-5 py-2.5 text-sm text-navy transition-all hover:bg-navy hover:text-white">
                Hukuki Danışmanlık Al
              </Link>
            </footer>
          </article>

          {/* Yan panel */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="border border-gray-100 bg-white p-5">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-gray-400">Kategori</p>
                <p className="text-sm font-medium text-navy">{term.category}</p>
              </div>
              <div className="border border-gold/20 bg-gold/5 p-5">
                <p className="mb-2 font-serif text-base font-light text-navy">Hukuki Destek</p>
                <p className="text-xs leading-relaxed text-gray-500">Bu konuda uzman avukatımızdan bilgi almak ister misiniz?</p>
                <Link to="/iletisim" className="mt-4 block bg-navy py-2.5 text-center text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                  Ücretsiz Görüşme
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
