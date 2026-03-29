import type { ArticleDetail, ArticleListItem, Category, PaginatedResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText} — ${path}`);
  }

  return res.json();
}

// ---- Public API ----

export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
}): Promise<PaginatedResponse<ArticleListItem>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.categorySlug) qs.set("categorySlug", params.categorySlug);
  return fetchApi(`/articles?${qs.toString()}`, { next: { revalidate: 60 } });
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  return fetchApi(`/articles/${slug}`, { next: { revalidate: 300 } });
}

export async function getCategories(): Promise<Category[]> {
  return fetchApi("/categories", { next: { revalidate: 3600 } });
}

// ---- Admin API (JWT gerektirir) ----

export async function adminGetAllArticles(token: string, page = 1) {
  return fetchApi(`/articles/admin/all?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export async function adminCreateArticle(token: string, data: unknown) {
  return fetchApi("/articles", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function adminUpdateArticle(token: string, id: number, data: unknown) {
  return fetchApi(`/articles/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function adminDeleteArticle(token: string, id: number) {
  return fetchApi(`/articles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export async function login(username: string, password: string) {
  // Geçici: Next.js mock endpoint — backend hazır olunca /auth/login kullanılacak
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json() as Promise<{ token: string; username: string; role: string; expiresAt: string }>;
}
