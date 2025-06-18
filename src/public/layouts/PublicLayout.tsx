// src/layouts/PublicLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
// Import Header, Footer, Navigation components của bạn
import MainHeader from 'shared/components/Header';
import MainFooter from 'shared/components/Footer';
import Navigation from 'shared/components/Navigation';
import { ChatbotWidget } from 'shared/features/chatbot';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <Navigation />
      <main className="flex-1">
        <Outlet /> {/* Đây là nơi các page component của public sẽ được render */}
      </main>
      <MainFooter />
      
      {/* Chatbot Widget - hiển thị trên tất cả trang public */}
      <ChatbotWidget 
        position="bottom-right"
        theme="light"
        hospitalName="Bệnh viện 7B"
        welcomeMessage="Xin chào! Tôi có thể giúp gì cho bạn?"
      />
    </div>
  );
};

export default PublicLayout;
