import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ArticleListItem } from "@/lib/types";

interface Props {
  article: ArticleListItem;
}

export default function ArticleCard({ article }: Props) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="group flex h-full flex-col rounded-sm border border-gray-100 bg-white transition-all duration-300 hover:border-gold/30 hover:shadow-lg overflow-hidden">
      <Link to={`/blog/${article.slug}`} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative aspect-video overflow-hidden bg-surface">
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-navy/10 to-gold/10" />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs">
          <Link
            to={`/blog?kategori=${article.categorySlug}`}
            className="font-medium uppercase tracking-wider text-gold hover:underline"
          >
            {article.categoryName}
          </Link>
          {date && (
            <>
              <span className="text-gray-200">&middot;</span>
              <time dateTime={article.publishedAt!} className="text-gray-400">{date}</time>
            </>
          )}
        </div>

        <h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-navy">
          <Link to={`/blog/${article.slug}`} className="transition-colors hover:text-gold">
            {article.title}
          </Link>
        </h3>

        {article.summary && (
          <p className="mb-4 flex-1 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {article.summary}
          </p>
        )}

        <Link
          to={`/blog/${article.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-navy"
          aria-label={`${article.title} yazısını oku`}
        >
          Devamını oku
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
