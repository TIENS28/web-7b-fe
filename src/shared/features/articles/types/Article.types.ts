/**
 * Interface cho bản dịch bài viết
 */
export interface ArticleTranslation {
  id?: string;
  languageCode: string;
  title: string;
  content: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  articleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface cho bài viết
 */
export interface Article {
  id: string;
  slug: string;
  authorName?: string | null;
  createdByUserId: string;
  categoryId?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
  featuredImage?: string | null;
  createdAt: string;
  updatedAt: string;
  translations: ArticleTranslation[];
}

/**
 * Interface cho tham số lấy danh sách bài viết
 */
export interface GetArticlesParams {
  language?: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  tagSlug?: string;
  // Thêm các filter khác nếu cần: categoryId, tagSlug, status, authorName, etc.
}

/**
 * Interface cho phản hồi danh sách bài viết
 */
export interface ArticleListResponse {
  articles: Article[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interface cho payload tạo bài viết mới
 */
export interface CreateArticleRequest {
  slug: string;
  authorName?: string | null;
  createdByUserId: string;
  categoryId?: string | null;
  tagIds?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
  featuredImage?: string | null;
  translations: Omit<ArticleTranslation, 'id' | 'articleId' | 'createdAt' | 'updatedAt'>[];
}

/**
 * Interface cho payload cập nhật bài viết
 */
export interface UpdateArticleRequest {
  slug?: string;
  authorName?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
  featuredImage?: string | null;
  translations?: ArticleTranslation[];
}

/**
 * Interface cho phản hồi API thành công
 */
export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Interface cho lỗi API
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
} 
