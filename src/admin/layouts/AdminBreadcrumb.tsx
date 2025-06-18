/**
 * Admin Breadcrumb Component
 * Hiển thị breadcrumb navigation cho admin pages
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const AdminBreadcrumb: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/admin' }
    ];
    
    if (paths.length > 1) {
      const section = paths[1];
      
      switch (section) {
        case 'users':
          breadcrumbs.push({ label: 'Quản lý người dùng', path: '/admin/users' });
          if (paths[2] === 'create') {
            breadcrumbs.push({ label: 'Tạo người dùng mới' });
          } else if (paths[2] && paths[2] !== 'create') {
            breadcrumbs.push({ label: 'Chi tiết người dùng' });
          }
          break;
          
        case 'roles':
          breadcrumbs.push({ label: 'Quản lý vai trò', path: '/admin/roles' });
          if (paths[2] === 'create') {
            breadcrumbs.push({ label: 'Tạo vai trò mới' });
          } else if (paths[2] && paths[2] !== 'create') {
            breadcrumbs.push({ label: 'Chi tiết vai trò' });
          }
          break;
          
        case 'permissions':
          breadcrumbs.push({ label: 'Quản lý quyền hạn', path: '/admin/permissions' });
          if (paths[2] === 'create') {
            breadcrumbs.push({ label: 'Tạo quyền mới' });
          } else if (paths[2] && paths[2] !== 'create') {
            breadcrumbs.push({ label: 'Chi tiết quyền' });
          }
          break;
          
        case 'articles':
          breadcrumbs.push({ label: 'Quản lý bài viết', path: '/admin/articles' });
          if (paths[2] === 'create') {
            breadcrumbs.push({ label: 'Tạo bài viết mới' });
          } else if (paths[2] && paths[2] !== 'create') {
            breadcrumbs.push({ label: 'Chi tiết bài viết' });
          }
          break;
          
        default:
          breadcrumbs.push({ label: section });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            
            {item.path && index < breadcrumbs.length - 1 ? (
              <Link
                to={item.path}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb; 
