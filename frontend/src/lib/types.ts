export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  coverImageUrl: string | null;
  categoryName: string;
  categorySlug: string;
  publishedAt: string | null;
}

export interface ArticleDetail extends ArticleListItem {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

export interface PracticeArea {
  slug: string;
  title: string;
  description: string;
  icon: string; // lucide-react icon name
}
