import { useEffect } from "react";

const SITE_NAME = import.meta.env.VITE_SITE_NAME ?? "Işık Hukuk Bürosu";
const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://isikavukatlik.com";

interface PageHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  og?: { type?: string; image?: string; publishedTime?: string };
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function PageHead({ title, description, canonical, noIndex, og }: PageHeadProps) {
  const fullTitle = title
    ? title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Hukuki Danışmanlık ve Avukatlık Hizmetleri`;

  useEffect(() => {
    document.title = fullTitle;

    if (description) setMeta("description", description);
    if (canonical) setLink("canonical", `${SITE_URL}${canonical}`);
    if (noIndex) setMeta("robots", "noindex,nofollow");

    setMeta("og:title", fullTitle, true);
    if (description) setMeta("og:description", description, true);
    setMeta("og:locale", "tr_TR", true);
    setMeta("og:site_name", SITE_NAME, true);
    if (og?.type) setMeta("og:type", og.type, true);
    if (og?.image) setMeta("og:image", og.image, true);
    if (og?.publishedTime) setMeta("article:published_time", og.publishedTime, true);
  }, [fullTitle, description, canonical, noIndex, og]);

  return null;
}
