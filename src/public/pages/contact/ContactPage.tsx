/**
 * Trang Liên hệ - Thông tin liên hệ và bản đồ Bệnh viện Quân y 7B
 */

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-xl md:text-2xl text-green-100">
              Bệnh viện Quân y 7B - Luôn sẵn sàng phục vụ bạn
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Thông tin liên hệ */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-6">
                {/* Địa chỉ */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Địa chỉ</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Đường Nguyễn Ái Quốc, P. Tân Mai<br />
                      Thành phố Biên Hoà, Tỉnh Đồng Nai
                    </p>
                  </div>
                </div>

                {/* Điện thoại */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Điện thoại</h3>
                    <a 
                      href="tel:0251399660"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      0251 39 99 60 60
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Trực Cấp Cứu: 24/7
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <a 
                      href="mailto:bvquany7b@gmail.com"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      bvquany7b@gmail.com
                    </a>
                  </div>
                </div>

                {/* Thời gian làm việc */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Thời gian làm việc</h3>
                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
                      <p><strong>Thứ 2 - Thứ 6:</strong> 7:00 - 17:00</p>
                      <p><strong>Thứ 7:</strong> 7:00 - 12:00</p>
                      <p><strong>Chủ nhật:</strong> Nghỉ (trừ cấp cứu)</p>
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        <strong>Cấp cứu:</strong> 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Các khoa phòng chính */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Các khoa phòng chính
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Nội tổng hợp</p>
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Ngoại tổng hợp</p>
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Sản - Phụ khoa</p>
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Nhi</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Cấp cứu</p>
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Chẩn đoán hình ảnh</p>
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Xét nghiệm</p>
                  <p className="text-gray-600 dark:text-gray-300">• Khoa Dược</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Gửi tin nhắn cho chúng tôi
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chủ đề
                </label>
                <select
                  id="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="appointment">Đặt lịch khám</option>
                  <option value="consultation">Tư vấn y tế</option>
                  <option value="complaint">Góp ý, khiếu nại</option>
                  <option value="general">Câu hỏi chung</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nội dung tin nhắn *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Vị trí bệnh viện
          </h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Bản đồ Google Maps</p>
                <p className="text-sm">
                  Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai
                </p>
                <p className="text-xs mt-2 text-gray-400">
                  (Tích hợp Google Maps sẽ được thêm vào sau)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 