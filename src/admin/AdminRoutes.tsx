//AdminRoutes
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from '../app/router/ProtectedRoute';
import UserRoutes from './features/users/router';
import RoleRoutes from './features/roles/router';
import PermissionRoutes from './features/permissions/router';
import ArticlesRouter from './features/articles/router';

// Dashboard Component
const DashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Quản trị
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Chào mừng bạn đến với bảng điều khiển quản trị hệ thống
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Tổng người dùng
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  1,234
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Tổng bài viết
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  456
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔐</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Vai trò
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  12
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Quyền hạn
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  48
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Admin Routes với Layout và Protection
 */
const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* Dashboard - Cần quyền admin */}
        <Route
          path=""
          element={
            <ProtectedRoute requirePermission="admin_panel:access">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Articles Management */}
        <Route path="articles/*" element={<ArticlesRouter />} />

        {/* User Management Routes */}
        <Route path="users/*" element={<UserRoutes />} />

        {/* Role Management Routes */}
        <Route path="roles/*" element={<RoleRoutes />} />

        {/* Permission Management Routes */}
        <Route path="permissions/*" element={<PermissionRoutes />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
