/**
 * Router cho Roles Feature
 * Quản lý các routes liên quan đến roles
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../app/router/ProtectedRoute';
import { ErrorBoundary, ErrorFallback } from 'shared/components';
import { RoleListPage, RoleDetailPage, RoleFormPage } from './pages';

/**
 * Roles Routes với protection
 */
const RolesRouter: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Routes>
      {/* Danh sách roles */}
      <Route
        path=""
        element={
          <ProtectedRoute requirePermission="roles:list">
            <RoleListPage />
          </ProtectedRoute>
        }
      />

      {/* Tạo role mới */}
      <Route
        path="create"
        element={
          <ProtectedRoute requirePermission="roles:create">
            <RoleFormPage />
          </ProtectedRoute>
        }
      />

      {/* Chi tiết role */}
      <Route
        path=":id"
        element={
          <ProtectedRoute requirePermission="roles:read">
            <RoleDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Chỉnh sửa role */}
      <Route
        path=":id/edit"
        element={
          <ProtectedRoute requirePermission="roles:update">
            <RoleFormPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </ErrorBoundary>
  );
};

export default RolesRouter; 
