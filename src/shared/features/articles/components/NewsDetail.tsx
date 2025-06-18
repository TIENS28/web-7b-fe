import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from 'shared/features/articles/services/ArticlesApi';
import type { Article } from 'shared/features/articles/types/Article.types';
import { TipTapViewer } from 'shared/components/editor/tiptap-editor';

/**
 * Component hiển thị chi tiết bài viết
 * Sử dụng API /articles/{slug} để lấy thông tin chi tiết bài viết
 */
export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError, error } = useQuery<Article, Error>({
    queryKey: ['articleDetail', slug],
    queryFn: () => {
      if (!slug) throw new Error('Slug is required');
      return getArticleBySlug(slug);
    },
    enabled: !!slug, // Chỉ thực hiện query khi slug tồn tại
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-pulse">Đang tải bài viết...</div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-red-600">
          {error?.message || 'Không tìm thấy bài viết.'}
        </div>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Quay lại trang chủ
        </Link>
      </div>
    );
  }

  // Lấy bản dịch tiếng Việt hoặc bản dịch đầu tiên
  const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];

  if (!translation) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-red-600">Không có nội dung bài viết.</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-10 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-green-700 hover:underline">
          ← Quay lại trang chủ
        </Link>
      </nav>

      {/* Article Content */}
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 italic">{translation.excerpt}</p>
              </div>
            )}
          </header>

          {/* Article Content with TipTap Viewer */}
          <div className="prose max-w-none">
            <TipTapViewer 
              content={translation.content}
              className="text-gray-800 leading-relaxed"
            />
          </div>
        </div>
      </article>

      {/* SEO Meta Info (chỉ hiển thị nếu có) */}
      {(translation.metaTitle || translation.metaDescription) && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Thông tin SEO</h3>
          {translation.metaTitle && (
            <p className="text-blue-800 mb-1">
              <strong>Meta Title:</strong> {translation.metaTitle}
            </p>
          )}
          {translation.metaDescription && (
            <p className="text-blue-800">
              <strong>Meta Description:</strong> {translation.metaDescription}
            </p>
          )}
        </div>
      )}
    </section>
  );
} 
