// src/pages/admin/AdminNotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      {/* Giả sử bạn có thể muốn style trang này theo theme của admin */}
      <h1>404 - Trang quản trị không tìm thấy</h1>
      <p>Rất tiếc, trang quản trị bạn đang tìm kiếm không tồn tại.</p>
      <p>
        Bạn có thể quay lại{' '}
        <Link to="/admin/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Bảng điều khiển Admin
        </Link>
        .
      </p>
    </div>
  );
};

export default AdminNotFoundPage;
