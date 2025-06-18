/**
 * Trang chi tiết permission
 * Hiển thị thông tin chi tiết của permission và các roles có permission này
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const PermissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link 
            to="/admin/permissions" 
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Quản lý quyền
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white">Chi tiết quyền</span>
        </nav>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          Chi tiết quyền #{id}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Thông tin cơ bản
              </h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {id}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Action
                  </dt>
                  <dd className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      create
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Resource
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    users
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ngày tạo
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    15/01/2024, 09:00
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mô tả
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    Quyền tạo người dùng mới trong hệ thống
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/admin/permissions/${id}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Chỉnh sửa
                </Link>
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Xóa quyền
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Roles có permission này */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Vai trò có quyền này
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Admin
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      2 người dùng
                    </p>
                  </div>
                  <Link
                    to="/admin/roles/1"
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 text-sm"
                  >
                    Xem
                  </Link>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Manager
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      5 người dùng
                    </p>
                  </div>
                  <Link
                    to="/admin/roles/2"
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 text-sm"
                  >
                    Xem
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2 vai trò đang sử dụng quyền này
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionDetailPage; 
