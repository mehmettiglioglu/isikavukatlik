"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ArticleListItem } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";
import { fadeUp, staggerContainer } from "@/components/ui/MotionDiv";

interface Props {
  articles: ArticleListItem[];
}

export default function LatestArticles({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="latest-articles-heading" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.header
          className="mb-14 flex items-end justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Güncel İçerikler
            </p>
            <h2
              id="latest-articles-heading"
              className="font-serif text-4xl font-light text-navy"
            >
              Son Yazılar
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
          >
            Tüm yazılar <ArrowRight size={14} />
          </Link>
        </motion.header>

        <motion.ul
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          {articles.map((article, i) => (
            <motion.li key={article.id} variants={fadeUp} custom={i}>
              <ArticleCard article={article} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-8 sm:hidden">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
            Tüm yazılar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
