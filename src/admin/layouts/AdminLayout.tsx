/**
 * Admin Layout với Sidebar Navigation
 * Features: Responsive sidebar, user info, logout, navigation menu
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { useLogoutMutation } from 'shared/hooks/useAuthMutations';
import { Button } from 'shared/components/shadcn/button';
import AdminBreadcrumb from './AdminBreadcrumb';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
  permission?: string;
}

const navigationItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: '🏠' },
  { path: '/admin/users', label: 'Quản lý người dùng', icon: '👥', permission: 'users:list' },
  { path: '/admin/roles', label: 'Quản lý vai trò', icon: '🔐', permission: 'roles:list' },
  { path: '/admin/permissions', label: 'Quản lý quyền hạn', icon: '🛡️', permission: 'permissions:list' },
  { path: '/admin/articles', label: 'Quản lý bài viết', icon: '📝', permission: 'articles:list' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, hasAnyPermission } = useAuth();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.permission) return true;
    return hasAnyPermission([item.permission]);
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div 
        className={`
          ${sidebarOpen ? 'w-64' : 'w-16'} 
          bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 
          flex flex-col border-r border-gray-200 dark:border-gray-700
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} mb-3`}>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Xin chào,
            </div>
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {user?.fullName}
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900"
          >
            {sidebarOpen ? (
              logoutMutation.isPending ? 'Đang đăng xuất...' : '🚪 Đăng xuất'
            ) : (
              '🚪'
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quản trị hệ thống
              </h2>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  size="sm"
                >
                  🏠 Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AdminBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
