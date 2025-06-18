/**
 * Trang danh sách permissions
 * Hiển thị danh sách tất cả permissions với tính năng tìm kiếm, tạo mới, sửa, xóa
 */

import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Plus } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from 'shared/components/shadcn/button';
import { DataTable, createActionColumn } from 'shared/components/data-table/data-table';
import { ErrorBoundary } from 'shared/components/shadcn/error-boundary';
import { usePermissions, useDeletePermission } from '../hooks/usePermissions';
import { Permission } from '../types/permissionTypes';

const PermissionListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = usePermissions();
  const deletePermission = useDeletePermission();


  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      'read': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      'update': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      'delete': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      'list': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
      'manage_permissions': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      'manage_roles': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
      'manage_status': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      'publish': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200',
      'access': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
      'admin': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
      'backup': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200',
      'restore': 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200',
      'view_logs': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
    };
    return colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Create TanStack Table columns using columnHelper
  const columnHelper = createColumnHelper<Permission>();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      enableSorting: true,
      meta: { width: '80px', className: 'font-medium' },
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(String(getValue()))}`}>
          {String(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('resource', {
      header: 'Resource',
      enableSorting: true,
      meta: { className: 'font-medium' },
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {String(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Mô tả',
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="max-w-xs truncate text-gray-600 dark:text-gray-400">
          {String(getValue()) || 'Không có mô tả'}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Ngày tạo',
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDate(String(getValue()))}
        </span>
      ),
    }),
  ], [columnHelper]);

  // Create complete columns with actions
  const tableColumns = useMemo(() => {
    const handleDeletePermission = async (permission: Permission) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa permission này?')) {
        await deletePermission.mutateAsync(permission.id);
      }
    };
    // Define actions for DataTable inside useMemo to avoid recreating on every render
    const actions = [
      {
        type: 'view' as const,
        label: 'Xem chi tiết',
        onClick: (permission: Permission) => navigate(`/admin/permissions/${permission.id}`)
      },
      {
        type: 'edit' as const,
        label: 'Chỉnh sửa',
        onClick: (permission: Permission) => navigate(`/admin/permissions/${permission.id}/edit`)
      },
      {
        type: 'delete' as const,
        label: 'Xóa',
        onClick: handleDeletePermission,
        disabled: () => deletePermission.isPending
      },
    ];

    return [
      ...columns,
      createActionColumn(actions)
    ];
  }, [columns, navigate, deletePermission.isPending, deletePermission.mutateAsync]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Có lỗi xảy ra khi tải danh sách permissions
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const permissions = data?.data || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý quyền
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Quản lý các quyền trong hệ thống
            </p>
          </div>
        </div>
        <Link
          to="/admin/permissions/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo quyền mới
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Tổng số quyền
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {permissions.length}
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
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Resources
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Set(permissions.map((p: Permission) => p.resource)).size}
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
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Actions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Set(permissions.map((p: Permission) => p.action)).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable với Error Boundary */}
      <ErrorBoundary
        fallback={() => (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                  Lỗi hiển thị bảng dữ liệu
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">
                  Có lỗi xảy ra khi hiển thị bảng permissions. Vui lòng tải lại trang.
                </p>
              </div>
            </div>
          </div>
        )}
      >
        <DataTable
          data={permissions}
          columns={tableColumns}
          loading={isLoading}
          searchPlaceholder="Tìm kiếm theo action, resource, mô tả..."
          emptyState={{
            icon: <Shield className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto" />,
            title: 'Không có permissions',
            description: 'Chưa có permissions nào được tạo'
          }}
        />
      </ErrorBoundary>
    </div>
  );
};

export default PermissionListPage; 
