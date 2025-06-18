import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import { Card } from 'shared/components/shadcn/card';
import { Badge } from 'shared/components/shadcn/badge';
import { DataTable, createActionColumn } from 'shared/components/data-table/data-table';
import { useUsers } from '../hooks/useUsers';
import { User, UserRole } from '../types/userTypes';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const { data, isLoading, error } = useUsers({ 
    page: currentPage, 
    pageSize 
  });

  const users = data?.data?.users || [];
  const meta = data?.data?.pagination;

  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  // Định nghĩa columns cho DataTable
  const columnHelper = createColumnHelper<User>();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = useMemo(() => [
    columnHelper.accessor('fullName', {
      id: 'user',
      header: 'Người dùng',
      enableSorting: true,
      cell: info => {
        const user = info.row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.fullName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user.personalId} • {user.email || 'Chưa có email'}
              </div>
            </div>
          </div>
        );
      },
    }),
    
    columnHelper.accessor('roles', {
      id: 'roles',
      header: 'Vai trò',
      enableSorting: false,
      cell: info => {
        const roles = info.getValue();
        return (
          <div className="flex flex-wrap gap-1">
            {roles.length > 0 ? (
              roles.map((userRole: UserRole, index: number) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                >
                  {userRole.role.name}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">Chưa có vai trò</span>
            )}
          </div>
        );
      },
    }),
    
    columnHelper.accessor('isLocked', {
      id: 'status',
      header: 'Trạng thái',
      enableSorting: true,
      cell: info => {
        const isLocked = info.getValue();
        return (
          <Badge 
            variant={isLocked ? "destructive" : "default"}
            className={`text-xs ${
              isLocked 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            }`}
          >
            {isLocked ? 'Đã khóa' : 'Hoạt động'}
          </Badge>
        );
      },
    }),
    
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: 'Ngày tạo',
      enableSorting: true,
      cell: info => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(info.getValue() || Date.now()).toLocaleDateString('vi-VN')}
        </div>
      ),
    }),
  ], [columnHelper]);

  // Create complete columns with actions
  const tableColumns = useMemo(() => {
    const handleViewUser = (user: User) => {
      navigate(`/admin/users/${user.id}`);
    };

    const handleEditUser = (user: User) => {
      navigate(`/admin/users/${user.id}/edit`);
    };

    const handleManageRoles = (user: User) => {
      navigate(`/admin/users/${user.id}/roles`);
    };
      const actions = [
      {
        type: 'view' as const,
        label: 'Xem chi tiết',
        onClick: handleViewUser,
      },
      {
        type: 'edit' as const,
        label: 'Chỉnh sửa',
        onClick: handleEditUser,
      },
      {
        type: 'custom' as const,
        label: 'Quản lý vai trò',
        onClick: handleManageRoles,
        icon: <Users className="h-4 w-4" />,
        className: 'text-purple-600 hover:text-purple-700',
      },
    ];

    return [
      ...columns,
      createActionColumn(actions)
    ];
  }, [columns, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Có lỗi xảy ra khi tải danh sách người dùng
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
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Quản lý thông tin và quyền hạn của người dùng
            </p>
          </div>
        </div>
        <Button 
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số người dùng</p>
              <p className="text-xl font-bold dark:text-white">{meta?.total || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</p>
              <p className="text-xl font-bold dark:text-white">
                {users.filter((u: User) => !u.isLocked).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
              <Users className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bị khóa</p>
              <p className="text-xl font-bold dark:text-white">
                {users.filter((u: User) => u.isLocked).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
              <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trang hiện tại</p>
              <p className="text-xl font-bold dark:text-white">
                {currentPage}/{meta?.totalPages || 1}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable<User>
        data={users || []}
        columns={tableColumns as ColumnDef<User, unknown>[]}
        loading={isLoading}
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, CCCD, email..."
        pagination={meta ? {
          current: currentPage,
          pageSize: pageSize,
          total: meta.total,
          onPageChange: setCurrentPage,
        } : undefined}
        emptyState={{
          icon: <Users className="h-12 w-12" />,
          title: 'Không có người dùng nào',
          description: 'Bắt đầu bằng cách thêm người dùng đầu tiên'
        }}
        className="bg-white dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
  );
};

export default UserListPage; 
