import React, { useState } from 'react';
import { ChatbotWidget } from 'shared/features/chatbot';

/**
 * Chatbot Demo Page
 * 
 * @description Demo page to test chatbot functionality
 */
export const ChatbotDemoPage: React.FC = () => {
  const [testInput, setTestInput] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Chatbot Demo
          </h1>
          
          {/* Test Input để debug */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test Input (Debug)
            </h2>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Test input để kiểm tra..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <p className="mt-2 text-sm text-gray-600">
              Value: {testInput}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bệnh viện 7B - Chatbot Assistant
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Đây là trang demo để test chatbot. Bạn có thể click vào icon chat ở góc dưới bên phải để bắt đầu trò chuyện.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                  Tính năng chính
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>• Trả lời tự động về giờ làm việc</li>
                  <li>• Thông tin liên hệ và địa chỉ</li>
                  <li>• Bảng giá dịch vụ</li>
                  <li>• Câu hỏi gợi ý thông minh</li>
                  <li>• Giao diện responsive</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-3">
                  Cách sử dụng
                </h3>
                <ul className="space-y-2 text-green-800 dark:text-green-200">
                  <li>• Click icon chat để mở</li>
                  <li>• Nhập câu hỏi hoặc chọn gợi ý</li>
                  <li>• Chatbot sẽ trả lời tự động</li>
                  <li>• Có thể đặt câu hỏi bằng tiếng Việt</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Ví dụ câu hỏi bạn có thể thử:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">• "Giờ làm việc của bệnh viện?"</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">• "Bệnh viện ở đâu?"</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">• "Số điện thoại liên hệ?"</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">• "Chi phí khám bệnh bao nhiêu?"</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">• "Email liên hệ?"</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">• "Bệnh viện có những dịch vụ gì?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot Widget */}
      <ChatbotWidget 
        position="bottom-right"
        theme="light"
        hospitalName="Bệnh viện 7B"
        welcomeMessage="Xin chào! Tôi là trợ lý ảo của Bệnh viện 7B. Tôi có thể giúp gì cho bạn?"
      />
    </div>
  );
}; 