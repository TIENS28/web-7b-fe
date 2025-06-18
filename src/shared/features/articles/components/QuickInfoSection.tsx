import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getArticles } from 'shared/features/articles/services/ArticlesApi';
import type { Article } from 'shared/features/articles/types/Article.types';

/**
 * Component hiển thị thông tin nhanh với layout 8/12 + 4/12 sidebar
 * Tối ưu cho việc hiển thị thông tin chi tiết bệnh viện và tin tức cập nhật
 */
export default function QuickInfoSection() {
  // Query danh sách tin tức cho sidebar
  const { data: sidebarArticles } = useQuery<Article[], Error>({
    queryKey: ['articles', 'sidebar-quick'],
    queryFn: () => getArticles({ 
      language: 'vi', 
      page: 1, 
      pageSize: 8
    }),
    staleTime: 5 * 60 * 1000,
    throwOnError: false,
    // Retry ít hơn để tránh spam requests khi server down
    retry: 1,
    // Cache lâu hơn để sử dụng dữ liệu cũ khi có lỗi
    gcTime: 30 * 60 * 1000, // 30 phút
  });

  // Component tin tức sidebar với thumbnail nhỏ
  const SidebarNewsCard = ({ article }: { article: Article }) => {
    const translation = article.translations.find(t => t.languageCode === 'vi') || article.translations[0];
    
    if (!translation) return null;

    return (
      <Link
        to={`/news/${article.slug}`}
        className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
      >
        {/* Thumbnail nhỏ */}
        <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-600 text-xs">📄</div>
            </div>
          )}
        </div>

        {/* Thông tin bài viết */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-tight">
            {translation.title}
          </h4>
          
          <time 
            dateTime={article.publishedAt || article.createdAt}
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
          >
            <span>🕒</span>
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
          </time>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Phần chính - 8/12 */}
          <main className="lg:col-span-8">
            {/* Hero Section - Giới thiệu Bệnh viện */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Hình ảnh bệnh viện */}
                <div className="h-64 md:h-80 overflow-hidden">
                  <img 
                    src="https://i.ibb.co/4ZdT6r1K/mohinh3.jpg" 
                    alt="Bệnh viện Quân y 7B" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Thông tin giới thiệu */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    📋 Giới thiệu Bệnh viện
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Bệnh viện Quân y 7B là bệnh viện hàng đầu với trang thiết bị hiện đại, 
                    đội ngũ y bác sĩ giàu kinh nghiệm và dịch vụ chăm sóc sức khỏe chất lượng cao.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 dark:text-green-500 text-lg">🏥</span>
                      <span className="text-gray-700 dark:text-gray-200">Hơn 30 năm kinh nghiệm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600 dark:text-blue-500 text-lg">👨‍⚕️</span>
                      <span className="text-gray-700 dark:text-gray-200">Đội ngũ bác sĩ chuyên môn cao</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-600 dark:text-purple-500 text-lg">🔬</span>
                      <span className="text-gray-700 dark:text-gray-200">Trang thiết bị hiện đại</span>
                    </div>
                  </div>

                  <Link
                    to="/news/Test"
                    className="inline-flex items-center mt-6 px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors w-fit"
                  >
                    Tìm hiểu thêm →
                  </Link>
                </div>
              </div>
            </div>

            {/* Dịch vụ nổi bật */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>🏥</span>
                Dịch vụ nổi bật
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dịch vụ khám bệnh */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-500">🩺</span>
                    Khám chữa bệnh
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-500">✓</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Khám tổng quát</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tầm soát sức khỏe toàn diện</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-500">✓</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Khám chuyên khoa</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tim mạch, Nội tiết, Thần kinh</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-500">✓</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Cấp cứu 24/7</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sẵn sàng phục vụ mọi lúc</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Dịch vụ xét nghiệm */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-500">🔬</span>
                    Xét nghiệm & Chẩn đoán
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-500">✓</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Xét nghiệm máu</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sinh hóa, Huyết học, Vi sinh</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-500">✓</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Chẩn đoán hình ảnh</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">X-quang, CT, MRI, Siêu âm</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-500">✓</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Nội soi</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Dạ dày, Đại tràng, Phế quản</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bảng giá dịch vụ - Căn giữa */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center">
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                  >
                    📋 Xem bảng giá dịch vụ
                  </Link>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar - 4/12 */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Tin tức mới nhất */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📰</span>
                  Tin tức mới nhất
                </h3>
                
                <div className="space-y-1">
                  {sidebarArticles && sidebarArticles.length > 0 ? (
                    sidebarArticles.slice(0, 6).map((article) => (
                      <SidebarNewsCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      <div className="text-2xl mb-2">📰</div>
                      <p className="text-sm">Đang cập nhật tin tức mới...</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    to="/news" 
                    className="block text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                  >
                    Xem tất cả tin tức →
                  </Link>
                </div>
              </div>

              {/* Giờ làm việc */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>⏰</span>
                  Giờ làm việc
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Thứ 2 - Thứ 6</span>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-gray-100">7:00 - 11:30</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">13:30 - 17:00</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Thứ 7</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">7:00 - 11:30</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Chủ nhật</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Nghỉ</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span className="text-red-700 dark:text-red-400 font-medium">Trực Cấp Cứu</span>
                    <span className="font-bold text-red-600 dark:text-red-500">24/7</span>
                  </div>
                  
                  {/* Thông tin liên hệ từ website */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">📞 Hotline:</span>
                        <a href="tel:025139960660" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          02513 99 60 60
                        </a>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">✉️ Email:</span>
                        <a href="mailto:bvquany7b@gmail.com" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          bvquany7b@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
} 
