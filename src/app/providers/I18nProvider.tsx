// src/app/providers/I18nProvider.tsx
import React, { ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import loader cho bản dịch (ví dụ: i18next-http-backend nếu file dịch nằm ngoài public/)
// Hoặc chỉ cần import trực tiếp nếu bạn muốn bundling các file dịch vào app
// Ví dụ với Vite, có thể dùng import.meta.glob nếu muốn bundling
const resources = {
  en: {
    translation: (await import('locales/en/translation.json')).default,
  },
  vi: {
    translation: (await import('locales/vi/translation.json')).default
  },
};

// Chỉ khởi tạo i18n nếu chưa được khởi tạo
if (!i18n.isInitialized) {
  i18n
    // Phát hiện ngôn ngữ trình duyệt của người dùng (và từ localStorage, cookie)
    .use(LanguageDetector)
    // Truyền instance i18n vào react-i18next
    .use(initReactI18next)
    // Khởi tạo i18n
    .init({
      // fallbackLng: Ngôn ngữ dự phòng nếu ngôn ngữ hiện tại không có bản dịch
      fallbackLng: 'en',
      debug: import.meta.env.DEV, // Bật debug mode trong môi trường phát triển
      resources,
      // Cấu hình tải bản dịch từ public folder
      // Nếu các file bản dịch của bạn nằm trong public/locales,
      // i18next-http-backend sẽ tự động tìm kiếm.
      // Nếu không dùng i18next-http-backend, bạn có thể load resources trực tiếp như ví dụ trên
      // hoặc sử dụng i18next-fs-backend cho Node.js backend.
      
      // Đối với project front-end với Vite, đơn giản nhất là để i18next tìm file
      // trong public/locales/<lng>/<ns>.json
      // hoặc bạn có thể import chúng trực tiếp nếu muốn chúng được đóng gói vào bundle JS.
      // Với cấu trúc `public/locales/`, i18next-http-backend sẽ tự hoạt động.
      
      // Nếu bạn muốn import trực tiếp (bundling):

      interpolation: {
        escapeValue: false, // React đã tự động escape XSS
      },
      ns: ['translation'], // Namespaces mặc định, có thể có nhiều hơn
      defaultNS: 'translation',
    });
}

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Không cần logic gì thêm ở đây, chỉ cần bọc children
  // i18next đã được khởi tạo global.
  return <>{children}</>;
};
