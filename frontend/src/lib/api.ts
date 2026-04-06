import type { ArticleDetail, ArticleListItem, Category, LegalTermDetail, LegalTermListItem, PaginatedResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5050/api";

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

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
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
  return fetchApi(`/articles?${qs.toString()}`);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  return fetchApi(`/articles/${slug}`);
}

export async function getCategories(): Promise<Category[]> {
  return fetchApi("/categories");
}

// ---- Admin API (JWT gerektirir) ----

export async function adminGetAllArticles(token: string, page = 1) {
  return fetchApi(`/articles/admin/all?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminCreateArticle(token: string, data: unknown) {
  return fetchApi("/articles", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminGetArticleById(token: string, id: number) {
  return fetchApi(`/articles/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateArticle(token: string, id: number, data: unknown) {
  return fetchApi(`/articles/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function adminDeleteArticle(token: string, id: number) {
  return fetchApi(`/articles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function sendContactMessage(data: {
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean }> {
  return fetchApi("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getLegalTerms(): Promise<LegalTermListItem[]> {
  return fetchApi("/legalterms");
}

export async function getLegalTermBySlug(slug: string): Promise<LegalTermDetail> {
  return fetchApi(`/legalterms/${slug}`);
}

export async function login(username: string, password: string) {
  return fetchApi<{ token: string; username: string; role: string; expiresAt: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminGetMessages(token: string) {
  return fetchApi<ContactMessage[]>("/contact", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUploadImage(token: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Yükleme başarısız.");
  }
  return res.json();
}

export async function adminMarkMessageRead(token: string, id: number) {
  return fetchApi<void>(`/contact/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminDeleteMessage(token: string, id: number) {
  return fetchApi<void>(`/contact/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminDeleteMessagesBulk(token: string, ids: number[]) {
  return fetchApi<{ deleted: number }>("/contact/delete-bulk", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
