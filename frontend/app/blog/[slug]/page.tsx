import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getArticleBySlug } from "@/lib/api";
import { STATIC_ARTICLES } from "@/lib/static-articles";
import { STATIC_ARTICLE_CONTENTS } from "@/lib/static-article-contents";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    return {
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.summary ?? undefined,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: article.metaTitle ?? article.title,
        description: article.metaDescription ?? article.summary ?? undefined,
        type: "article",
        publishedTime: article.publishedAt ?? undefined,
        ...(article.coverImageUrl && { images: [{ url: article.coverImageUrl, alt: article.title }] }),
      },
    };
  } catch {
    const staticArticle = STATIC_ARTICLES.find((a) => a.slug === slug);
    if (!staticArticle) return { title: "Makale Bulunamadı" };
    return {
      title: staticArticle.title,
      description: staticArticle.summary ?? undefined,
      alternates: { canonical: `/blog/${slug}` },
    };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  // API'dan dene; başarısız olursa statik veriye düş
  let article: {
    title: string; slug: string; summary: string | null;
    content: string; coverImageUrl: string | null;
    categoryName: string; categorySlug: string;
    publishedAt: string | null; updatedAt: string;
    metaTitle?: string | null; metaDescription?: string | null;
  } | null = null;

  try {
    article = await getArticleBySlug(slug);
  } catch {
    const staticItem = STATIC_ARTICLES.find((a) => a.slug === slug);
    const staticContent = STATIC_ARTICLE_CONTENTS[slug];
    if (staticItem && staticContent) {
      article = {
        ...staticItem,
        content: staticContent,
        updatedAt: staticItem.publishedAt ?? new Date().toISOString(),
      };
    }
  }

  if (!article) notFound();

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("tr-TR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <main>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-navy py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={article.coverImageUrl ?? "/justice.jpg"}
            alt=""
            fill
            className="object-cover opacity-20"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy/95 to-navy/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><ChevronRight size={12} /></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><ChevronRight size={12} /></li>
              <li aria-current="page" className="text-gold line-clamp-1">{article.title}</li>
            </ol>
          </nav>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={`/blog?kategori=${article.categorySlug}`}
              className="border border-gold/50 px-3 py-1 text-xs text-gold hover:bg-gold hover:text-white transition-colors"
            >
              {article.categoryName}
            </Link>
            {publishedDate && (
              <time dateTime={article.publishedAt!} className="text-gray-400 text-xs">
                {publishedDate}
              </time>
            )}
          </div>
          <h1 className="font-serif text-3xl font-light leading-snug text-white md:text-4xl">
            {article.title}
          </h1>
          {article.summary && (
            <p className="mt-4 text-base leading-relaxed text-gray-300">{article.summary}</p>
          )}
        </div>
      </section>

      {/* İçerik */}
      <article className="mx-auto max-w-3xl px-6 py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.summary,
              datePublished: article.publishedAt,
              dateModified: article.updatedAt,
              author: { "@type": "Organization", name: "Işık Hukuk Bürosu" },
              publisher: { "@type": "LegalService", name: "Işık Hukuk Bürosu" },
            }),
          }}
        />

        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-serif prose-headings:font-light prose-headings:text-navy
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:leading-relaxed prose-p:text-gray-700
            prose-li:text-gray-700
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="mt-14 flex items-center justify-between border-t border-gray-100 pt-8">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
            ← Tüm Yazılar
          </Link>
          <Link
            href="/iletisim"
            className="border border-navy px-5 py-2.5 text-sm text-navy transition-all hover:bg-navy hover:text-white"
          >
            Hukuki Danışmanlık Al
          </Link>
        </footer>
      </article>
    </main>
  );
}
