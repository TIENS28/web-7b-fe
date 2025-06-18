// src/layouts/PublicLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div>
        <Outlet /> {/* Đây là nơi các page component của public sẽ được render */}
    </div>
  );
};

export default PublicLayout;
