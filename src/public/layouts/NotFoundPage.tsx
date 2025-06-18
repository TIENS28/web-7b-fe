// src/pages/NotFoundPage.tsx (Hoặc src/pages/public/PublicNotFoundPage.tsx)
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Trang không tìm thấy</h1>
      <p>Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <p>
        Bạn có thể quay lại{' '}
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Trang chủ
        </Link>
        .
      </p>
      {/* Bạn có thể thêm hình ảnh hoặc các yếu tố khác cho trang 404 */}
    </div>
  );
};

export default NotFoundPage;
