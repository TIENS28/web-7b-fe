import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getArticles } from 'shared/features/articles/services/ArticlesApi';
import type { Article } from 'shared/features/articles/types/Article.types';

/**
 * Component hiển thị tin tức theo layout mới
 * - 1 tin nổi bật lớn ở đầu
 * - Các tin nhỏ với thumbnail nhỏ bên dưới
 */
export default function QuickInfoSection() {
  // Query lấy tất cả tin tức
  const { data: allArticles } = useQuery<Article[], Error>({
    queryKey: ['articles', 'featured'],
    queryFn: () => getArticles({ 
      language: 'vi', 
      page: 1, 
      pageSize: 10
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Component cho tin nổi bật lớn
  const FeaturedArticleCard = ({ article }: { article: Article }) => {
    const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];
    
    if (!translation) return null;

    return (
      <Link
        to={`/news/${article.slug}`}
        className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Featured Image - Giảm kích thước xuống 20-30% */}
        <div className="aspect-[4/3] overflow-hidden">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-gray-400 text-4xl">📄</div>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="p-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {translation.title}
          </h2>
          
          {translation.excerpt && (
            <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
              {translation.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            {article.authorName && (
              <span className="flex items-center gap-1">
                <span>👤</span>
                {article.authorName}
              </span>
            )}
            
            <time 
              dateTime={article.publishedAt || article.createdAt}
              className="flex items-center gap-1"
            >
              <span>🕒</span>
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
            </time>
          </div>
        </div>
      </Link>
    );
  };

  // Component cho tin nhỏ với thumbnail
  const SmallArticleCard = ({ article }: { article: Article }) => {
    const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];
    
    if (!translation) return null;

    return (
      <Link
        to={`/news/${article.slug}`}
        className="group flex gap-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3"
      >
        {/* Small Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-gray-400 text-lg">📄</div>
            </div>
          )}
        </div>

        {/* Article Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
            {translation.title}
          </h3>
          
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

  // Phân chia bài viết: bài đầu làm featured, còn lại làm small
  const featuredArticle = allArticles?.[0];
  const smallArticles = allArticles?.slice(1, 7) || []; // Lấy 6 bài tiếp theo

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Giới thiệu */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-green-700">
                📋 Giới thiệu
              </h3>
              <Link 
                to="/category/gioi-thieu" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xem tất cả →
              </Link>
            </div>
            
            {/* Tin nổi bật */}
            {featuredArticle && (
              <div className="mb-6">
                <FeaturedArticleCard article={featuredArticle} />
              </div>
            )}

            {/* Các tin nhỏ */}
            {smallArticles.length > 0 && (
              <div className="space-y-3">
                {smallArticles.slice(0, 2).map((article) => (
                  <SmallArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Dịch vụ */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-green-700">
                🏥 Dịch vụ
              </h3>
              <Link 
                to="/category/dich-vu" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xem tất cả →
              </Link>
            </div>
            
            {/* Tin nổi bật dịch vụ */}
            {smallArticles[2] && (
              <div className="mb-6">
                <FeaturedArticleCard article={smallArticles[2]} />
              </div>
            )}

            {/* Các tin nhỏ dịch vụ */}
            {smallArticles.length > 3 && (
              <div className="space-y-3">
                {smallArticles.slice(3, 5).map((article) => (
                  <SmallArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Tin tức */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-green-700">
                📰 Tin tức - Thông báo
              </h3>
              <Link 
                to="/category/tin-tuc" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xem tất cả →
              </Link>
            </div>
            
            {/* Tin nổi bật tin tức */}
            {smallArticles[5] && (
              <div className="mb-6">
                <FeaturedArticleCard article={smallArticles[5]} />
              </div>
            )}

            {/* Các tin nhỏ tin tức */}
            {smallArticles.length > 6 && (
              <div className="space-y-3">
                {smallArticles.slice(6).map((article) => (
                  <SmallArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-6 inline-block shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Cần hỗ trợ thêm thông tin?
            </h4>
            <p className="text-gray-600 mb-4">
              Liên hệ với chúng tôi để được tư vấn chi tiết
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors"
              >
                📞 Liên hệ ngay
              </Link>
              <Link
                to="/appointment"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
              >
                📅 Đặt lịch khám
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
