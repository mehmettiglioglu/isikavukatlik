import type { Metadata } from "next";
import Image from "next/image";
import { getArticles, getCategories } from "@/lib/api";
import { STATIC_ARTICLES } from "@/lib/static-articles";
import ArticleCard from "@/components/ui/ArticleCard";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ sayfa?: string; kategori?: string }>;
}

export const metadata: Metadata = {
  title: "Hukuki Yazılar ve Makaleler",
  description:
    "Ceza, aile, ticaret ve iş hukuku başta olmak üzere çeşitli hukuk dallarında bilgilendirici makaleler ve güncel hukuki yorumlar.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: Props) {
  const { sayfa, kategori } = await searchParams;
  const page = Number(sayfa) || 1;

  const [articlesData, categories] = await Promise.all([
    getArticles({ page, pageSize: 9, categorySlug: kategori }).catch(() => null),
    getCategories().catch(() => []),
  ]);

  const articles = articlesData?.data?.length ? articlesData.data : STATIC_ARTICLES;
  const total = articlesData?.total ?? articles.length;
  const totalPages = Math.ceil(total / 9);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <Image src="/justice5.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" priority />
          <div className="absolute inset-0 bg-linear-to-r from-navy/90 to-navy/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            Yayınlar
          </p>
          <h1 className="font-serif text-5xl font-light text-white">Hukuki Yazılar</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
            Güncel hukuki gelişmeler, dava süreçleri ve hak arama yolları hakkında
            bilgilendirici makaleler.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Kategori filtresi */}
          {categories.length > 0 && (
            <nav aria-label="Kategori filtresi" className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`border px-4 py-1.5 text-sm transition-colors ${
                  !kategori ? "border-navy bg-navy text-white" : "border-gray-200 text-gray-500 hover:border-navy hover:text-navy"
                }`}
              >
                Tümü
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?kategori=${cat.slug}`}
                  className={`border px-4 py-1.5 text-sm transition-colors ${
                    kategori === cat.slug
                      ? "border-navy bg-navy text-white"
                      : "border-gray-200 text-gray-500 hover:border-navy hover:text-navy"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          )}

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {articles.map((article) => (
              <li key={article.id}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav aria-label="Sayfalama" className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?sayfa=${p}${kategori ? `&kategori=${kategori}` : ""}`}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex h-9 w-9 items-center justify-center border text-sm transition-colors ${
                    p === page ? "border-navy bg-navy text-white" : "border-gray-200 text-gray-500 hover:border-navy"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
