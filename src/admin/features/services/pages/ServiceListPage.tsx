/**
 * Trang danh sách dịch vụ y tế
 * Hiển thị danh sách dịch vụ với tính năng tìm kiếm, lọc, phân trang và CRUD actions
 * Sử dụng DataTable component với TanStack Table
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Plus, Clock, DollarSign, Building2, Tag } from 'lucide-react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Button } from 'shared/components/shadcn/button';
import { Badge } from 'shared/components/shadcn/badge';
import { DataTable, createActionColumn } from 'shared/components/data-table/data-table';
import { ErrorBoundary } from 'shared/components/shadcn/error-boundary';
import { useServices, useDeleteService, useToggleServiceStatus } from '../hooks/useServices';
import type { Service } from '../types/Service.types';

const ServiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const { data, isLoading, error } = useServices({ 
    page: currentPage, 
    pageSize 
  });
  
  const deleteService = useDeleteService();
  const toggleStatus = useToggleServiceStatus();

  const handleDeleteService = async (service: Service) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${service.name}"?`)) {
      await deleteService.mutateAsync(service.id);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    const action = service.isActive ? 'vô hiệu hóa' : 'kích hoạt';
    if (window.confirm(`Bạn có chắc chắn muốn ${action} dịch vụ "${service.name}"?`)) {
      await toggleStatus.mutateAsync({
        id: service.id,
        isActive: !service.isActive
      });
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}p` : `${hours} giờ`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Create TanStack Table columns using columnHelper
  const columnHelper = createColumnHelper<Service>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('code', {
      header: 'Mã dịch vụ',
      enableSorting: true,
      meta: { width: '120px', className: 'font-mono' },
      cell: ({ getValue }) => (
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Tên dịch vụ',
      enableSorting: true,
      meta: { className: 'font-medium min-w-[200px]' },
      cell: ({ getValue, row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {getValue()}
          </span>
          {row.original.description && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {row.original.description}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Danh mục',
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {getValue().name}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('department', {
      header: 'Khoa/Phòng',
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {getValue().name}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('basePrice', {
      header: 'Giá cơ bản',
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-yellow-500" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatPrice(getValue(), row.original.currency)}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('duration', {
      header: 'Thời gian',
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {formatDuration(getValue())}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('isActive', {
      header: 'Trạng thái',
      enableSorting: true,
      cell: ({ getValue }) => (
        <Badge 
          variant={getValue() ? 'default' : 'secondary'}
          className={getValue() 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
          }
        >
          {getValue() ? 'Hoạt động' : 'Tạm dừng'}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Ngày tạo',
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(getValue())}
        </span>
      ),
    }),
  ], []);

  
  // Create complete columns with actions
  const tableColumns = useMemo(() => {
      // Define actions for DataTable
      const actions = [
        {
          type: 'view' as const,
          label: 'Xem chi tiết',
          onClick: (service: Service) => navigate(`/admin/services/${service.id}`)
        },
        {
          type: 'edit' as const,
          label: 'Chỉnh sửa',
          onClick: (service: Service) => navigate(`/admin/services/${service.id}/edit`)
        },
        {
          type: 'custom' as const,
          label: 'Toggle Status',
          onClick: handleToggleStatus,
          icon: '🔄',
          disabled: () => toggleStatus.isPending
        },
        {
          type: 'delete' as const,
          label: 'Xóa',
          onClick: handleDeleteService,
          disabled: () => deleteService.isPending
        }
      ];
      return [
        ...columns,
        createActionColumn(actions)
      ];
    }, [columns, navigate, handleDeleteService, deleteService.isPending]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Có lỗi xảy ra khi tải danh sách dịch vụ
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <HeartHandshake className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý dịch vụ
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Quản lý danh sách dịch vụ y tế và giá dịch vụ
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/admin/services/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo dịch vụ mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartHandshake className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Tổng dịch vụ
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {data?.data?.pagination?.total || data?.data?.services.length}
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
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Đang hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {data?.data?.services.filter(s => s.isActive).length}
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
                <Tag className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Danh mục
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Set(data?.data?.services.map(s => s.category.id)).size}
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
                <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Khoa/Phòng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Set(data?.data?.services.map(s => s.department.id)).size}
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
              <HeartHandshake className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                  Lỗi hiển thị bảng dữ liệu
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">
                  Có lỗi xảy ra khi hiển thị bảng dịch vụ. Vui lòng tải lại trang.
                </p>
              </div>
            </div>
          </div>
        )}
      >
        <DataTable<Service>
          data={data?.data?.services || []}
          columns={tableColumns as ColumnDef<Service, unknown>[]}
          loading={isLoading}
          searchable={true}
          searchPlaceholder="Tìm kiếm theo tên, mã dịch vụ, danh mục..."
          pagination={data?.data?.pagination ? {
            current: currentPage,
            pageSize: pageSize,
            total: data?.data?.pagination.total,
            onPageChange: setCurrentPage,
          } : undefined}
          emptyState={{
            icon: <HeartHandshake className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto" />,
            title: 'Không có dịch vụ nào',
            description: 'Chưa có dịch vụ nào được tạo. Hãy bắt đầu bằng cách tạo dịch vụ đầu tiên.'
          }}
          className="bg-white dark:bg-gray-800 dark:border-gray-700"
        />
      </ErrorBoundary>
    </div>
  );
};

export default ServiceListPage; 
