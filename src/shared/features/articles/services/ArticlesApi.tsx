import axiosInstance from 'shared/lib/apiInstance';
import type {
  Article,
  GetArticlesParams,
  ArticleListResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
  ApiSuccessResponse
} from 'shared/features/articles/types/Article.types';

/**
 * Lấy danh sách bài viết công khai
 * @param params - Tham số lọc và phân trang
 * @returns Promise<Article[]> - Danh sách bài viết
 */
export const getArticles = async (params?: GetArticlesParams): Promise<Article[]> => {
  try {
    const response = await axiosInstance.get<ApiSuccessResponse<ArticleListResponse>>('/articles', { params });
    return response.data.data.articles;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết bài viết theo slug
 * @param slug - Slug của bài viết
 * @param language - Mã ngôn ngữ (mặc định: 'vi')
 * @returns Promise<Article> - Chi tiết bài viết
 */
export const getArticleBySlug = async (slug: string, language = 'vi'): Promise<Article> => {
  try {
    const response = await axiosInstance.get<ApiSuccessResponse<Article>>(`/articles/${slug}`, { 
      params: { language } 
    });
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bài viết với slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Lấy chi tiết bài viết theo ID
 * @param id - ID của bài viết
 * @param language - Mã ngôn ngữ (mặc định: 'vi')
 * @returns Promise<Article> - Chi tiết bài viết
 */
export const getArticleById = async (id: string, language = 'vi'): Promise<Article> => {
  try {
    const response = await axiosInstance.get<ApiSuccessResponse<Article>>(`/articles/id/${id}`, { 
      params: { language } 
    });
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bài viết với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo bài viết mới (cần xác thực)
 * @param payload - Dữ liệu bài viết mới
 * @returns Promise<Article> - Bài viết đã tạo
 */
export const createArticle = async (payload: CreateArticleRequest): Promise<Article> => {
  try {
    const response = await axiosInstance.post<ApiSuccessResponse<Article>>('/articles', payload);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi tạo bài viết:', error);
    throw error;
  }
};

/**
 * Cập nhật bài viết (cần xác thực)
 * @param id - ID của bài viết
 * @param payload - Dữ liệu cập nhật
 * @returns Promise<Article> - Bài viết đã cập nhật
 */
export const updateArticle = async (id: string, payload: UpdateArticleRequest): Promise<Article> => {
  try {
    const response = await axiosInstance.put<ApiSuccessResponse<Article>>(`/articles/${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật bài viết ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa bài viết (cần xác thực admin)
 * @param id - ID của bài viết cần xóa
 * @returns Promise<void>
 */
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/articles/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa bài viết ${id}:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách bài viết với thông tin phân trang đầy đủ
 * @param params - Tham số lọc và phân trang
 * @returns Promise<ArticleListResponse> - Danh sách bài viết với thông tin phân trang
 */
export const getArticlesWithPagination = async (params?: GetArticlesParams): Promise<ArticleListResponse> => {
  try {
    const response = await axiosInstance.get<ApiSuccessResponse<ArticleListResponse>>('/articles', { params });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết với phân trang:', error);
    throw error;
  }
};

// Alias cho backward compatibility
export const getNews = getArticles;
export const getNewsBySlug = getArticleBySlug;
export const getNewsById = getArticleById;
export const createNews = createArticle;
export const updateNews = updateArticle;
