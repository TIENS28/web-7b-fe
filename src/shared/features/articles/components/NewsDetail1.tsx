import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug, getArticles } from 'shared/features/articles/services/ArticlesApi';
import type { Article } from 'shared/features/articles/types/Article.types';
import { TipTapViewer } from 'shared/components/editor/tiptap-editor';

/**
 * Component hiển thị chi tiết bài viết với layout 8/12 + 4/12 sidebar
 * Tối ưu cho việc hiển thị thông tin chi tiết bệnh viện và tin tức cập nhật
 */
export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Query chi tiết bài viết chính
  const { data: article, isLoading, isError, error } = useQuery<Article, Error>({
    queryKey: ['articleDetail', slug],
    queryFn: () => {
      if (!slug) throw new Error('Slug is required');
      return getArticleBySlug(slug);
    },
    enabled: !!slug,
  });

  // Query danh sách tin tức cho sidebar
  const { data: sidebarArticles } = useQuery<Article[], Error>({
    queryKey: ['articles', 'sidebar'],
    queryFn: () => getArticles({ 
      language: 'vi', 
      page: 1, 
      pageSize: 8
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Component tin tức sidebar với thumbnail nhỏ
  const SidebarNewsCard = ({ article }: { article: Article }) => {
    const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];
    
    if (!translation) return null;

    return (
      <Link
        to={`/news/${article.slug}`}
        className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        {/* Thumbnail nhỏ */}
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-gray-400 text-sm">📄</div>
            </div>
          )}
        </div>

        {/* Thông tin bài viết */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
            {translation.title}
          </h4>
          
          <time 
            dateTime={article.publishedAt || article.createdAt}
            className="text-xs text-gray-500 flex items-center gap-1"
          >
            <span>🕒</span>
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
          </time>
        </div>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="animate-pulse bg-gray-200 h-64 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="animate-pulse bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded w-full"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded w-5/6"></div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="animate-pulse bg-gray-200 h-8 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-red-600 mb-4">
          {error?.message || 'Không tìm thấy bài viết.'}
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];

  if (!translation) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-red-600 mb-4">Không có nội dung bài viết.</div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-green-700 hover:underline">
          ← Quay lại trang chủ
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Phần chính - 8/12 */}
        <main className="lg:col-span-8">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            {article.featuredImage && (
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img 
                  src={article.featuredImage} 
                  alt={translation.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Article Header */}
              <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {translation.title}
                </h1>
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
                  {article.authorName && (
                    <div className="flex items-center gap-1">
                      <span>👤</span>
                      <span>{article.authorName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <span>🕒</span>
                    <time dateTime={article.publishedAt || article.createdAt}>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
                    </time>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      article.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {article.status === 'PUBLISHED' ? 'Đã xuất bản' :
                       article.status === 'DRAFT' ? 'Bản nháp' : 'Đã lưu trữ'}
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                {translation.excerpt && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-700 italic font-medium">{translation.excerpt}</p>
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div className="prose max-w-none">
                <TipTapViewer 
                  content={translation.content}
                  className="text-gray-800 leading-relaxed"
                />
              </div>

              {/* Tags hoặc thông tin bổ sung */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Bệnh viện
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Y tế
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    Dịch vụ
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Thông tin SEO (ẩn đi để tập trung vào nội dung chính) */}
          {(translation.metaTitle || translation.metaDescription) && (
            <details className="mt-6 p-4 bg-gray-50 rounded-lg">
              <summary className="cursor-pointer text-gray-600 font-medium">
                Thông tin SEO
              </summary>
              <div className="mt-2 space-y-2">
                {translation.metaTitle && (
                  <p className="text-gray-700">
                    <strong>Meta Title:</strong> {translation.metaTitle}
                  </p>
                )}
                {translation.metaDescription && (
                  <p className="text-gray-700">
                    <strong>Meta Description:</strong> {translation.metaDescription}
                  </p>
                )}
              </div>
            </details>
          )}
        </main>

        {/* Sidebar - 4/12 */}
        <aside className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Tin tức mới nhất */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📰</span>
                Tin tức mới nhất
              </h3>
              
              <div className="space-y-1">
                {sidebarArticles && sidebarArticles.length > 0 ? (
                  sidebarArticles.slice(0, 6).map((sidebarArticle) => (
                    <SidebarNewsCard key={sidebarArticle.id} article={sidebarArticle} />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-2xl mb-2">📰</div>
                    <p className="text-sm">Đang cập nhật tin tức mới...</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link 
                  to="/news" 
                  className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Xem tất cả tin tức →
                </Link>
              </div>
            </div>

            {/* Liên hệ nhanh */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📞</span>
                Liên hệ nhanh
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-green-600 text-xl">🏥</span>
                  <div>
                    <p className="font-medium text-gray-900">Hotline</p>
                    <p className="text-green-600 font-bold">1900-xxx-xxx</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <span className="text-blue-600 text-xl">📅</span>
                  <div>
                    <p className="font-medium text-gray-900">Đặt lịch khám</p>
                    <p className="text-blue-600 text-sm">24/7 online</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Link
                  to="/contact"
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors"
                >
                  Liên hệ ngay
                </Link>
                <Link
                  to="/appointment"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  Đặt lịch khám
                </Link>
              </div>
            </div>

            {/* Dịch vụ nổi bật */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⭐</span>
                Dịch vụ nổi bật
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Khám tổng quát</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Xét nghiệm chuyên sâu</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Chẩn đoán hình ảnh</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Điều trị chuyên khoa</span>
                </li>
              </ul>

              <Link 
                to="/services" 
                className="block mt-4 text-center text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Xem bảng giá dịch vụ →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
} 
