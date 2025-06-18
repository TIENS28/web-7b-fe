/**
 * Router cho Permissions Feature
 * Quản lý các routes liên quan đến permissions
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../app/router/ProtectedRoute';
import { ErrorBoundary, ErrorFallback } from 'shared/components';
import { PermissionListPage, PermissionDetailPage, PermissionFormPage } from './pages';

/**
 * Permissions Routes với protection
 */
const PermissionsRouter: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Routes>
      {/* Danh sách permissions */}
      <Route
        path=""
        element={
          <ProtectedRoute requirePermission="permissions:list">
            <PermissionListPage />
          </ProtectedRoute>
        }
      />

      {/* Tạo permission mới */}
      <Route
        path="create"
        element={
          <ProtectedRoute requirePermission="permissions:create">
            <PermissionFormPage />
          </ProtectedRoute>
        }
      />

      {/* Chi tiết permission */}
      <Route
        path=":id"
        element={
          <ProtectedRoute requirePermission="permissions:read">
            <PermissionDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Chỉnh sửa permission */}
      <Route
        path=":id/edit"
        element={
          <ProtectedRoute requirePermission="permissions:update">
            <PermissionFormPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </ErrorBoundary>
  );
};

export default PermissionsRouter; 
