import React from 'react';
import ProtectedRoute from '../../../app/router/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ErrorFallback } from 'shared/components';
import UserListPage from './pages/UserListPage';
// import UserDetailPage from './pages/UserDetailPage';
// import UserFormPage from './pages/UserFormPage';
// import UserManageRolesPage from './pages/UserManageRolesPage';

// Temporary placeholder components
const UserDetailPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold dark:text-white">Chi tiết người dùng</h1>
    <p className="text-gray-600 dark:text-gray-400">Tính năng đang phát triển...</p>
  </div>
);

const UserFormPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold dark:text-white">Form người dùng</h1>
    <p className="text-gray-600 dark:text-gray-400">Tính năng đang phát triển...</p>
  </div>
);

const UserManageRolesPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold dark:text-white">Quản lý vai trò</h1>
    <p className="text-gray-600 dark:text-gray-400">Tính năng đang phát triển...</p>
  </div>
);

/**
 * User Management Routes với permission-based protection
 */
const UserRoutes: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Routes>
      {/* Danh sách Users */}
      <Route
        path=""
        element={
          <ProtectedRoute requirePermission="users:list">
            <UserListPage />
          </ProtectedRoute>
        }
      />

      {/* Chi tiết User */}
      <Route
        path=":id"
        element={
          <ProtectedRoute requirePermission="users:read">
            <UserDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Chỉnh sửa User */}
      <Route
        path=":id/edit"
        element={
          <ProtectedRoute requirePermission="users:update">
            <UserFormPage />
          </ProtectedRoute>
        }
      />

      {/* Quản lý Roles của User */}
      <Route
        path=":id/roles"
        element={
          <ProtectedRoute requirePermission="users:manage_roles">
            <UserManageRolesPage />
          </ProtectedRoute>
        }
      />

      {/* Tạo mới User */}
      <Route
        path="create"
        element={
          <ProtectedRoute requirePermission="users:create">
            <UserFormPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </ErrorBoundary>
  );
};

export default UserRoutes; 
