import React from 'react';
import { Target, Eye, Heart, Shield, Award, Users } from 'lucide-react';

/**
 * Mission Vision Component
 * Section hiển thị sứ mệnh, tầm nhìn và giá trị cốt lõi của bệnh viện
 */
export const MissionVision: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sứ mệnh & Tầm nhìn
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Chúng tôi hướng tới việc trở thành bệnh viện hàng đầu trong khu vực với 
            dịch vụ chăm sóc sức khỏe toàn diện và chất lượng quốc tế.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Sứ mệnh */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sứ mệnh</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Mang đến dịch vụ y tế chất lượng cao, an toàn và hiệu quả cho mọi người dân. 
              Chúng tôi cam kết chăm sóc bệnh nhân với sự tận tâm, chuyên nghiệp và 
              luôn đặt sức khỏe của bệnh nhân lên hàng đầu.
            </p>
          </div>

          {/* Tầm nhìn */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tầm nhìn</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Trở thành bệnh viện đa khoa hàng đầu tại Việt Nam, được công nhận về 
              chất lượng dịch vụ, công nghệ tiên tiến và đội ngũ y bác sĩ chuyên nghiệp, 
              góp phần nâng cao sức khỏe cộng đồng.
            </p>
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Giá trị cốt lõi
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tận tâm</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Chăm sóc bệnh nhân với tình yêu thương và sự tận tụy như người thân trong gia đình
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">An toàn</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tuân thủ nghiêm ngặt các quy trình an toàn y tế và sử dụng công nghệ hiện đại
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Chất lượng</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Không ngừng nâng cao chất lượng dịch vụ và đầu tư vào công nghệ y tế tiên tiến
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tôn trọng</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tôn trọng quyền riêng tư, nhân phẩm và lựa chọn của mỗi bệnh nhân
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
