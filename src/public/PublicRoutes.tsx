//PublicRoutes
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout'; // Đường dẫn tới PublicLayout
import { HomePage } from './features/home';
// Import các trang public khác
import NotFoundPage from './layouts/NotFoundPage'; // Trang 404 cho public
import News from '../shared/features/articles/components/QuickInfoSection2';
import NewsDetail from '../shared/features/articles/components/NewsDetail1';
import Unauthorized from '../shared/components/Unauthorized'; 
import { AboutPage } from 'public/pages/about/index';
import { ContactPage } from 'public/pages/contact/index';
import { ServicesRouter } from './features/services';
import DoctorsRouter from './features/doctors/router';
import { ChatbotDemoPage } from './features/chatbot-demo/pages/ChatbotDemoPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}> {/* Tất cả route public sẽ dùng layout này */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services/*" element={<ServicesRouter />} />
        <Route path="/doctors/*" element={<DoctorsRouter />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/chatbot-demo" element={<ChatbotDemoPage />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/activate" element={<ActivateAccountPage />} /> */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Bắt các route không khớp trong public */}
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
