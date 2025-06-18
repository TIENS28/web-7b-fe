/**
 * Router cho Articles Feature
 * Quản lý các routes liên quan đến bài viết
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../app/router/ProtectedRoute';
import { ErrorBoundary, ErrorFallback } from 'shared/components';
import { ArticleCreatePage, ArticleEditPage } from './pages';
import ArticlesManagement from './components/ArticlesManagement';

/**
 * Articles Routes với protection
 */
const ArticlesRouter: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Routes>
      {/* Danh sách bài viết */}
      <Route
        path=""
        element={
          <ProtectedRoute requirePermission="articles:list">
            <ArticlesManagement />
          </ProtectedRoute>
        }
      />

      {/* Tạo bài viết mới */}
      <Route
        path="create"
        element={
          <ProtectedRoute requirePermission="articles:create">
            <ArticleCreatePage />
          </ProtectedRoute>
        }
      />

      {/* Chỉnh sửa bài viết */}
      <Route
        path=":id/edit"
        element={
          <ProtectedRoute requirePermission="articles:update">
            <ArticleEditPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </ErrorBoundary>
  );
};

export default ArticlesRouter; 
